
### Server Side of Project

The server is built using Node.js and WebSocket. It acts as a signaling server for establishing a WebRTC connection between the sender and receiver. Key responsibilities include:

-   Managing WebSocket connections for both sender and receiver.
    
-   Relaying SDP offers, answers, and ICE candidates between sender and receiver to facilitate the WebRTC handshake process.