import { useEffect, useRef, useState } from "react";

const Sender = () => {
  const [pc, setPC] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [stream, setStream] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socketRef.current = socket;
    socket.onopen = () => socket.send(JSON.stringify({ type: "sender" }));
    return () => socket.close();
  }, []);

  const initiateConnection = async () => {
    const socket = socketRef.current;
    if (!socket) return alert("Socket not connected");

    const peerConnection = new RTCPeerConnection();
    setPC(peerConnection);

    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        socket.send(
          JSON.stringify({ type: "iceCandidate", candidate: e.candidate })
        );
      }
    };

    peerConnection.onnegotiationneeded = async () => {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.send(
        JSON.stringify({
          type: "createOffer",
          sdp: peerConnection.localDescription,
        })
      );
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createAnswer") {
        peerConnection.setRemoteDescription(message.sdp);
      } else if (message.type === "iceCandidate") {
        peerConnection.addIceCandidate(message.candidate);
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    setLocalStream(stream);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    setStream(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold mb-6">Sender</h1>
      <div className="w-full max-w-4xl mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-[600px] object-cover border-4 border-white"
        />
      </div>
      <button
        onClick={initiateConnection}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
      >
        {stream ? "Started" : "Start Streaming"}
      </button>
    </div>
  );
};

export default Sender;
