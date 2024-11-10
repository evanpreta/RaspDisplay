import socket
import struct
import time
import random

# Define the host and port for the simulated TCP server
TCP_HOST = '127.0.0.1'  # Localhost
TCP_PORT = 1048         # Port used in tcp_client.py

# Define initial test data for different parameters
test_data = [
    (0x01, 85.0),  # battery_soc (e.g., 85%)
    (0x02, 37.5),  # temperature (e.g., 37.5°C)
    (0x03, 45.2),  # hv_battery_pack_temp
    (0x04, 50.1),  # back_edu_reported_temp
    (0x0F, 50.1),  # front_edu_reported_temp
    (0x05, 1.0),   # drive_mode_active (e.g., "Drive")
#0x06-08 are the switches
    (0x09, 20.0),  # distance_to_lead_vehicle
    (0x0A, 0.0),   # traffic_light_state (e.g "Green")
    (0x0B, 69.0),  # CACC 
    #0x0C-0E are yet to be implemented in tcp_client.py
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
            for i, (identifier, value) in enumerate(test_data):
                # Randomize the value within a specified range around the initial value
                if identifier == 0x01:  # battery_soc (e.g., 85% ± 5%)
                    value = random.uniform(80.0, 90.0)
                elif identifier == 0x02:  # temperature (e.g., 37.5°C ± 2°C)
                    value = random.uniform(35.5, 39.5)
                elif identifier == 0x03:  # hv_battery_pack_temp (± 3°C)
                    value = random.uniform(42.2, 48.2)
                elif identifier == 0x04:  # back_edu_reported_temp (± 3°C)
                    value = random.uniform(47.1, 53.1)
                elif identifier == 0x0F:  # front_edu_reported_temp (± 3°C)
                    value = random.uniform(47.1, 53.1)
                elif identifier == 0x05:  # drive_mode_active (fixed value for simplicity)
                    value = 1.0
                elif identifier == 0x09: # distance_to_lead_vehicle (20.0m ± 5.0m)
                    value = random.uniform(15.0, 25.0)
                elif identifier == 0x0A: # traffic_light_state (e.g. "Green")
                    value = random.randint(0, 2)
                elif identifier == 0x0B:  # CACC mileage (e.g., ± 10 miles)
                    value = random.uniform(59.0, 79.0)

                # Update the test_data list with the new value
                test_data[i] = (identifier, value)

                # Pack the identifier and value as a binary message
                data = struct.pack('!Bf', identifier, value)
                conn.sendall(data)
                print(f"Sent: identifier={identifier}, value={value}")

                time.sleep(1)  # Wait 1 seconds between sending messages
