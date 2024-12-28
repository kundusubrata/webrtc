import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const sockets = {
  sender: null as WebSocket | null,
  receiver: null as WebSocket | null,
};

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    switch (message.type) {
      case "sender":
        sockets.sender = ws;
        break;

      case "receiver":
        sockets.receiver = ws;
        break;

      case "createOffer":
        if (ws === sockets.sender && sockets.receiver) {
          sockets.receiver.send(
            JSON.stringify({ type: "createOffer", sdp: message.sdp })
          );
        }
        break;

      case "createAnswer":
        if (ws === sockets.receiver && sockets.sender) {
          sockets.sender.send(
            JSON.stringify({ type: "createAnswer", sdp: message.sdp })
          );
        }
        break;

      case "iceCandidate":
        const target =
          ws === sockets.sender ? sockets.receiver : sockets.sender;
        target?.send(
          JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
        );
        break;
    }
  });
});
