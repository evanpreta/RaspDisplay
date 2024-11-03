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
	if len(data) == 1: # 1 byte for identifier, 4 bytes for float value
		value = struct.unpack('!B', data)[0]
		#parameter_name = identifier_mapping.get(identifier, "Unknown(0x{:02X})".format(identifier))
		print("Received: {:.2f}".format(value))
	else:
		print("Invalid message format.")
		
def receive_tcp_data(host, port):
	"""Connect to the TCP server and receive data."""
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
		s.connect((host, port))
		print("Connected to server at {}:{}".format(host, port))
		while True:
			try:
				# Expecting messages of 5 bytes (1 byte identifier + 4 byte float)
				data = s.recv(1)
				if not data:
					print("Server closed the connection.")
					break

				# Process the received message
				process_message(data)

			except ConnectionResetError:
				print("Connection lost. Server might have disconnected.")
				break
if __name__ == "__main__":
	# Example usage
	host = '10.10.10.1' # Replace with Speedgoat IP or hostname
	port = 1048 # Replace with the correct port used by the Speedgoat server
	receive_tcp_data(host, port)
