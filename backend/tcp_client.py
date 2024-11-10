import asyncio
import websockets
import socket
import struct
import json

# TCP server connection details
TCP_HOST = '10.10.10.1'  # Replace with actual IP or hostname of the TCP server
TCP_PORT = 1048  # Replace with the correct port used by the TCP server

# WebSocket server details
WEBSOCKET_PORT = 8765

# Mapping of hex identifiers to parameter names
identifier_mapping = {
    0x01: 'battery_soc',                     # Battery State of Charge
    0x02: 'temperature',                     # Temperature (e.g., battery or motor)
    0x03: 'hv_battery_pack_temp',            # HV Battery Pack Temperature
    0x04: 'edu_reported_temp',               # EDU Reported Temperature
    0x05: 'drive_mode_active',               # Drive Mode Active
    0x06: 'ain_switch',                      # AIN Switch
    0x07: 'dms_switch',                      # DMS Switch
    0x08: 'cav_dyno_mode_switch',            # CAV Dyno Mode Switch
    0x09: 'distance_to_lead_vehicle',        # Distance and Headway to Lead Vehicle
    0x0A: 'traffic_light_state',             # Traffic Light State
    0x0B: 'cacc_mileage_accumulation',       # CACC Mileage Accumulation
    0x0C: 'udp_simulation_data_received',    # UDP Simulation Data Received Light
    0x0D: 'request_for_dyno_mode',           # Request for Dyno Mode
    0x0E: 'object_injection_simulation',     # Object Injection Simulation
}
reverse_identifier_mapping = {v: k for k, v in identifier_mapping.items()}

connected_clients = set()
tcp_queue = asyncio.Queue()  # Queue to communicate between WebSocket server and TCP client

async def broadcast(message):
    """Send a message to all connected WebSocket clients."""
    if connected_clients:
        await asyncio.wait([client.send(message) for client in connected_clients])

async def websocket_handler(websocket, path):
    """Handle WebSocket client connections and messages."""
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            # Parse message from frontend and put it in the queue for TCP processing
            data = json.loads(message)
            await tcp_queue.put(data)
            print(f"Received from WebSocket client: {data}")
    finally:
        connected_clients.remove(websocket)

async def receive_tcp_data():
    """Connect to the TCP server, receive data, and forward it to WebSocket clients."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((TCP_HOST, TCP_PORT))
        print(f"Connected to TCP server at {TCP_HOST}:{TCP_PORT}")

        while True:
            try:
                data = s.recv(5)
                if not data:
                    print("TCP server closed the connection.")
                    break
                
                # Process received TCP data
                identifier, value = struct.unpack('!Bf', data)
                parameter_name = identifier_mapping.get(identifier, f"Unknown(0x{identifier:02X})")
                message = {parameter_name: round(value, 2)}
                print(f"Received from TCP server: {message}")

                # Forward the message to WebSocket clients
                await broadcast(json.dumps(message))
            except ConnectionResetError:
                print("Connection lost. TCP server might have disconnected.")
                break

async def process_tcp_queue():
    """Send messages from the queue to the TCP server."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((TCP_HOST, TCP_PORT))
        print(f"Connected to TCP server for sending commands at {TCP_HOST}:{TCP_PORT}")

        while True:
            data = await tcp_queue.get()
            identifier = reverse_identifier_mapping.get(data['identifier'])
            if identifier is not None:
                value = data['value']
                packed_data = struct.pack('!Bf', identifier, value)
                s.sendall(packed_data)
                print(f"Sent to TCP server: identifier={identifier}, value={value}")

async def main():
    # Start the WebSocket server
    websocket_server = websockets.serve(websocket_handler, "localhost", WEBSOCKET_PORT)
    print(f"WebSocket server started on ws://localhost:{WEBSOCKET_PORT}")

    # Run TCP and WebSocket tasks concurrently
    await asyncio.gather(
        websocket_server,
        receive_tcp_data(),
        process_tcp_queue()
    )

# Run the main function
asyncio.run(main())
