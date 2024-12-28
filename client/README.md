
### Client Side of Project

The client is developed with React. It provides separate interfaces for the sender and receiver:

-   **Sender**: Captures the local video stream and shares it via WebRTC. Handles SDP offer creation and ICE candidate exchange.
    
-   **Receiver**: Receives and plays the video stream shared by the sender. Handles SDP answer creation and ICE candidate exchange.
    

The client uses React Router for navigation between the Home, Sender, and Receiver components.