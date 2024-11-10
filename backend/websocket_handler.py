import asyncio
import websockets

connected_clients = set()

async def handler(websocket, path):
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            await asyncio.wait([ws.send(message) for ws in connected_clients if ws != websocket])
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()  # Run forever

asyncio.run(main())