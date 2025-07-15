import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:5050");

export default function VideoChat({ myId, otherId, isCalling }) {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }

      // Start the call automatically
      if (isCalling) {
        callUser();
      }
    });

    socket.on("callUser", ({ signal, from }) => {
      setReceivingCall(true);
      setCallerSignal(signal);
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      connectionRef.current?.signal(signal);
    });
  }, []);

  // 🔊 Control mic toggle
  useEffect(() => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !muted;
    }
  }, [muted]);

  // 🎥 Control camera toggle
  useEffect(() => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = cameraOn;
    }
  }, [cameraOn]);

  const callUser = () => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: otherId,
        signalData: data,
        from: myId,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: otherId,
      });
    });

    peer.signal(callerSignal);

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    connectionRef.current = peer;
    setCallAccepted(true);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Local Video Wrapper */}
      <div className="relative w-full max-w-lg">
        <video
          ref={myVideo}
          autoPlay
          muted
          className="w-full rounded-lg shadow-md border"
        />

        {/* Mute Button */}
        <button
          onClick={() => setMuted((prev) => !prev)}
          className="absolute bottom-2 right-3 w-10 h-10 flex items-center justify-center bg-white rounded-full transition"
          title={muted ? "Unmute Mic" : "Mute Mic"}
        >
          <img
            src={muted ? "/mute.png" : "/microphone.png"}
            alt={muted ? "Muted" : "Unmuted"}
            className="w-5 h-5"
          />
        </button>

        {/* Camera Button */}
        <button
          onClick={() => setCameraOn((prev) => !prev)}
          className="absolute bottom-2 right-14 w-10 h-10 flex items-center justify-center bg-white rounded-full transition"
          title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          <img
            src={cameraOn ? "/cam-recorder.png" : "/video.png"}
            alt={cameraOn ? "Camera On" : "Camera Off"}
            className="w-5 h-5"
          />
        </button>
      </div>

      {/* Remote Video */}
      {callAccepted && (
        <video
          ref={userVideo}
          autoPlay
          className="w-full max-w-lg rounded-lg shadow-md border"
        />
      )}

      {/* Answer Call Button */}
      {!callAccepted && receivingCall && (
        <button
          onClick={answerCall}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Answer
        </button>
      )}
    </div>
  );
}
