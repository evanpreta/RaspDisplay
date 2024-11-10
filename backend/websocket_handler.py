import asyncio
import websockets
import json

connected_clients = set()
tcp_queue = asyncio.Queue()  # Queue to communicate between WebSocket server and TCP client

async def broadcast(message):
    """Send message to all connected clients."""
    if connected_clients:  # Only attempt to send if there are connected clients
        await asyncio.wait([client.send(message) for client in connected_clients])

async def handler(websocket, path):
    """Register client connection and handle incoming messages."""
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            # Parse message from frontend
            data = json.loads(message)
            # Example of data format: {"identifier": "dms_switch", "value": 1}
            # Put data in queue for tcp_client to process
            await tcp_queue.put(data)
    finally:
        connected_clients.remove(websocket)

async def start_server():
    """Start WebSocket server and listen for messages from frontend."""
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # Keep the server running

# Run WebSocket server
asyncio.run(start_server())
