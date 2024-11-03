This repository orchestrates a bidirectional TCP web socket backend with a react JS frontend GUI.


RaspDisplay/
├── backend/
│   ├── __init__.py
│   ├── main.py              # Orchestrates components
│   ├── tcp_handler.py       # Handles TCP messages
│   ├── websocket_handler.py # Manages WebSocket communication with the frontend
│   └── requirements.txt     # Python package dependencies
├── frontend/                # Frontend for GUI (non-React)
│   ├── styles.css           # Styling for the frontend
│   ├── output.html          # Main HTML file for the frontend
│   ├── script.js            # Frontend JavaScript for handling WebSocket
├── README.md
