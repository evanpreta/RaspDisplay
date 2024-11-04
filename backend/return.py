# tcp_client.py
import socket
import struct
import time

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
                data = s.recv(5)
                if not data:
                    print("Server closed the connection.")
                    break
                
                process_message(data)
                
            except ConnectionResetError:
                print("Connection lost. Server might have disconnected.")
                break

def send_test_message(host, port):
    """Send a test message to the TCP server."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        print(f"Connected to server at {host}:{port} for sending test message")
        
        # Send a sample message (1-byte identifier + 4-byte float value)
        identifier = 0x01  # Example identifier
        value = 12.34  # Example float value
        data = struct.pack('!Bf', identifier, value)
        s.sendall(data)
        print(f"Sent: identifier={identifier}, value={value}")

if __name__ == "__main__":
    host = '10.10.10.1'  # Replace with Speedgoat IP or hostname
    port = 1048  # Replace with the correct port used by the Speedgoat server
    
    while True:
        send_test_message(host, port)
        receive_tcp_data(host, port)
        time.sleep(1)  # Delay between iterations to prevent flooding the server
