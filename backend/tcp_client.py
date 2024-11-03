# tcp_client.py
import socket
import struct
# Mapping of hex identifiers to parameter names
identifier_mapping = {
    0x01: 'battery_soc',
    0x02: 'temperature',
    # Add more mappings here as needed
}
def process_message(data):
    """Parse and process the incoming message."""
    if len(data) == 5:  # 1 byte for identifier, 4 bytes for float value
        identifier, value = struct.unpack('!Bf', data)
        parameter_name = identifier_mapping.get(identifier, f"Unknown(0x{identifier:02X})")
        print(f"Received: {parameter_name} = {value:.2f}")
    else:
        print("Invalid message format.")
def receive_tcp_data(host, port):
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
                process_message(data)
                
            except ConnectionResetError:
                print("Connection lost. Server might have disconnected.")
                break
if __name__ == "__tcp_client__":
    # Example usage
    host = '192.168.0.10'  # Replace with Speedgoat IP or hostname
    port = 8765  # Replace with the correct port used by the Speedgoat server
    receive_tcp_data(host, port)
