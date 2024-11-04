This repository orchestrates a bidirectional TCP web socket backend with a react JS frontend GUI.


RaspDisplay/ <br />
├── backend/ <br />
│   ├── __init__.py <br />
│   ├── main.py              # Orchestrates components <br />
│   ├── tcp_handler.py       # Handles TCP messages <br />
│   ├── websocket_handler.py # Manages WebSocket communication with the frontend <br />
│   └── requirements.txt     # Python package dependencies <br />
├── frontend/                # Frontend for GUI (non-React) <br />
│   ├── styles.css           # Styling for the frontend <br />
│   ├── output.html          # Main HTML file for the frontend <br />
│   ├── script.js            # Frontend JavaScript for handling WebSocket <br />
├── README.md
