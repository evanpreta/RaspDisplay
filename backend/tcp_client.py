from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import socket
import struct
import json
import queue

# TCP server connection details
TCP_HOST = '127.0.0.1'  # Replace with actual IP or hostname of the TCP server
TCP_PORT = 1048  # Replace with the correct port used by the TCP server

# Flask server details
WEBSOCKET_PORT = 8765

# Mapping of hex identifiers to parameter names
identifier_mapping = {
    0x01: 'battery_soc',
    0x02: 'temperature',
    0x03: 'hv_battery_pack_temp',
    0x04: 'back_edu_reported_temp',
    0x0F: 'front_edu_reported_temp',
    0x05: 'drive_mode_active',
    0x06: 'ain_switch',
    0x07: 'dms_switch',
    0x08: 'cav_dyno_mode_switch',
    0x09: 'distance_to_lead_vehicle',
    0x0A: 'traffic_light_state',
    0x0B: 'cacc_mileage_accumulation',
    0x0C: 'udp_simulation_data_received',
    0x0D: 'request_for_dyno_mode',
    0x0E: 'object_injection_simulation',
    0x11: 'front_axle_power',
    0x12: 'rear_axle_power'
}

# Reverse mapping for sending commands
reverse_identifier_mapping = {v: k for k, v in identifier_mapping.items()}

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
data_store = {}  # Global dictionary to store data received from TCP
command_queue = queue.Queue()  # Queue to store commands from the frontend

@app.route('/data')
def get_data():
    return jsonify(data_store)  # Serve the latest data

@app.route('/send_command', methods=['POST'])
def send_command():
    """Endpoint to receive commands from the frontend and enqueue them for the TCP server."""
    data = request.json
    identifier = data.get('identifier')
    value = data.get('value')
    if identifier in reverse_identifier_mapping:
        command_queue.put((reverse_identifier_mapping[identifier], value))  # Enqueue command as (identifier, value)
        return jsonify({"status": "success", "message": "Command enqueued"}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid identifier"}), 400

def tcp_listener():
    """Listen to TCP server and update data store with received data."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((TCP_HOST, TCP_PORT))
        print(f"Connected to TCP server at {TCP_HOST}:{TCP_PORT}")

        while True:
            try:
                data = s.recv(5)
                if not data:
                    print("TCP server closed the connection.")
                    break

                identifier, value = struct.unpack('!Bf', data)
                parameter_name = identifier_mapping.get(identifier, f"Unknown(0x{identifier:02X})")
                data_store[parameter_name] = round(value, 2)  # Update data store with the latest TCP data
                print(f"Received from TCP server: {parameter_name} = {value}")
            except ConnectionResetError:
                print("Connection lost. TCP server might have disconnected.")
                break

def tcp_command_sender():
    """Send commands from the queue to the TCP server."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((TCP_HOST, TCP_PORT))
        print(f"Connected to TCP server for sending commands at {TCP_HOST}:{TCP_PORT}")

        while True:
            identifier, value = command_queue.get()  # Block until a command is available
            packed_data = struct.pack('!Bf', identifier, value)
            s.sendall(packed_data)
            print(f"Sent to TCP server: identifier={identifier}, value={value}")

def start_server():
    """Run Flask server, TCP listener, and TCP command sender concurrently."""
    threading.Thread(target=tcp_listener).start()  # Start TCP listener in a new thread
    threading.Thread(target=tcp_command_sender).start()  # Start TCP command sender in a new thread
    app.run(port=WEBSOCKET_PORT)  # Start Flask server

if __name__ == "__main__":
    start_server()
