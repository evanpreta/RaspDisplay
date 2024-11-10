import socket
import struct
import time

# Define the host and port for the simulated TCP server
TCP_HOST = '127.0.0.1'  # Localhost
TCP_PORT = 1048         # Port used in tcp_client.py

# Define some test data for different parameters
test_data = [
    (0x01, 85.0),  # battery_soc (e.g., 85%)
    (0x02, 37.5),  # temperature (e.g., 37.5°C)
    (0x03, 45.2),  # hv_battery_pack_temp
    (0x04, 50.1),  # edu_reported_temp
    (0x05, 1.0),   # drive_mode_active (e.g., "Drive")
    (0x0B, 69.0),   # CACC
]

# Start the simulated TCP server
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
    server_socket.bind((TCP_HOST, TCP_PORT))
    server_socket.listen(1)
    print(f"Simulated TCP server running on {TCP_HOST}:{TCP_PORT}")

    conn, addr = server_socket.accept()
    with conn:
        print(f"Connected by {addr}")
        
        while True:
            for identifier, value in test_data:
                # Pack the identifier and value as a binary message
                data = struct.pack('!Bf', identifier, value)
                conn.sendall(data)
                print(f"Sent: identifier={identifier}, value={value}")

                time.sleep(2)  # Wait 2 seconds between sending messages
