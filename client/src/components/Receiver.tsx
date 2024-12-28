import { useEffect, useRef, useState } from "react";

const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    const peerConnection = new RTCPeerConnection();

    socket.onopen = () => socket.send(JSON.stringify({ type: "receiver" }));

    peerConnection.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createOffer") {
        await peerConnection.setRemoteDescription(message.sdp);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "createAnswer", sdp: answer }));
      } else if (message.type === "iceCandidate") {
        peerConnection.addIceCandidate(message.candidate);
      }
    };

    return () => {
      peerConnection.close();
      socket.close();
    };
  }, []);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setVideoReady(true);
        })
        .catch((err) => {
          console.error("Error playing video: ", err);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold mb-6">Receiver</h1>
      <div className="w-full max-w-4xl mb-4">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-[600px] object-cover border-4 border-white"
        />
      </div>
      <p className="text-xl text-gray-300 mt-4">
        {!videoReady ? "Waiting for sender..." : "Connected"}
      </p>
      {!videoReady && (
        <button
          onClick={handlePlayVideo}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
        >
          Play Video
        </button>
      )}
    </div>
  );
};

export default Receiver;
