import asyncio
import socket
import struct
import json
import websockets

# Mapping of hex identifiers to parameter names
identifier_mapping = {
    0x01: 'battery_soc',
    0x02: 'temperature',
    # Add more mappings here as needed
}

WEBSOCKET_URI = "ws://localhost:8765"  # WebSocket server address

def process_message(data):
    """Parse and process the incoming message."""
    if len(data) == 5:  # 1 byte for identifier, 4 bytes for float value
        identifier, value = struct.unpack('!Bf', data)
        parameter_name = identifier_mapping.get(identifier, f"Unknown(0x{identifier:02X})")
        return {parameter_name: round(value, 2)}
    else:
        print("Invalid message format.")
        return None

async def send_to_websocket(message):
    async with websockets.connect(WEBSOCKET_URI) as websocket:
        await websocket.send(json.dumps(message))

async def receive_tcp_data(host, port):
    """Connect to the TCP server and receive data."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        print(f"Connected to server at {host}:{port}")
        
        while True:
            try:
                # Expecting messages of 5 bytes (1 byte identifier + 4 byte float)
                data = s.recv(5)
                if not data:
                    print("Server closed the connection.")
                    break
                
                # Process the received message
                message = process_message(data)
                if message:
                    print(f"Received: {message}")
                    # Send to WebSocket server
                    await send_to_websocket(message)
                    
            except ConnectionResetError:
                print("Connection lost. Server might have disconnected.")
                break

if __name__ == "__main__":
    host = '10.10.10.1'  # Replace with Speedgoat IP or hostname
    port = 1048  # Replace with the correct port used by the Speedgoat server
    asyncio.run(receive_tcp_data(host, port))
