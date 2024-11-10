import asyncio
import socket
import struct
import json
import websockets

# TCP server connection details
TCP_HOST = '10.10.10.1'  # Replace with actual IP or hostname of the TCP server
TCP_PORT = 1048  # Replace with the correct port used by the TCP server

# WebSocket server details
WEBSOCKET_URI = "ws://localhost:8765"  # WebSocket server address

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

# Reverse mapping for sending commands from frontend to TCP server
reverse_identifier_mapping = {v: k for k, v in identifier_mapping.items()}

def process_message(data):
    """Parse and process the incoming TCP message."""
    if len(data) == 5:  # 1 byte for identifier, 4 bytes for float value
        identifier, value = struct.unpack('!Bf', data)
        parameter_name = identifier_mapping.get(identifier, f"Unknown(0x{identifier:02X})")
        print(f"Received from TCP server: {parameter_name} = {value:.2f}")  # Log incoming TCP message
        return {parameter_name: round(value, 2)}
    else:
        print("Invalid message format.")
        return None

async def send_to_websocket(message):
    """Send a message to the WebSocket server for the frontend."""
    async with websockets.connect(WEBSOCKET_URI) as websocket:
        await websocket.send(json.dumps(message))
        print(f"Sent to WebSocket: {message}")  # Log outgoing WebSocket message

async def receive_from_websocket():
    """Listen for messages from WebSocket server and send them to the TCP server."""
    async with websockets.connect(WEBSOCKET_URI) as websocket:
        while True:
            message = await websocket.recv()
            data = json.loads(message)
            identifier = reverse_identifier_mapping.get(data['identifier'])
            if identifier is not None:
                await send_tcp_message(identifier, data['value'])
                print(f"Received from WebSocket: {data}")  # Log incoming WebSocket message

async def send_tcp_message(identifier, value):
    """Send a message to the TCP server."""
    packed_data = struct.pack('!Bf', identifier, value)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((TCP_HOST, TCP_PORT))
        s.sendall(packed_data)
        print(f"Sent to TCP server: identifier={identifier}, value={value}")

async def receive_tcp_data():
    """Connect to the TCP server and receive data, then forward to WebSocket."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((TCP_HOST, TCP_PORT))
        print(f"Connected to TCP server at {TCP_HOST}:{TCP_PORT}")

        while True:
            try:
                data = s.recv(5)  # Expecting 5 bytes (1 byte identifier + 4 byte float)
                if not data:
                    print("TCP server closed the connection.")
                    break
                
                message = process_message(data)
                if message:
                    await send_to_websocket(message)
            except ConnectionResetError:
                print("Connection lost. TCP server might have disconnected.")
                break

async def main():
    # Run TCP receiving and WebSocket receiving concurrently
    await asyncio.gather(
        receive_tcp_data(),
        receive_from_websocket()
    )

# Run the main function
asyncio.run(main())
