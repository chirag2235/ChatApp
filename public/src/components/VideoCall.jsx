import React, { use, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
const VideoCall = ({ socket, from, to, call, callReceiver,failCall }) => {
  const [userAccept, setUserAccept] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const terminateCall = () => {
    call(false);
  };

  const acceptCall = () => {
    setUserAccept(true);
    socket.current.emit("call:accept", { from,to});
    const stream = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("call:accepted", (from) => {
        console.log("Call accepted from", from);
        setUserAccept(true);
      });
    }
    return () => {
      socket.current.off("call:accepted");
    };
  }, [socket]);
  useEffect(() => {
    if (!r) {
      socket.current.emit("call:ringing", { from, to });
      socket.current.on("call:failed", (data) => {
        failCall(true);
        console.log("Call failed", data);
        terminateCall();
      });
    }
    return () => {
      socket.current.off("call:ringing");
    };
  }, [callReceiver, from, socket, to]);

  return (
    <div>
      <h1>Video Call</h1>
      {console.log({ socket, to, from })}
      {
          !userAccept && ((callReceiver) ? 
      <><h3>Incoming Call</h3>
      <button onClick={acceptCall}>Accept</button>
      </>:
      <h2>Calling...</h2>
      )
      }
      
      {userAccept && <>
      <ReactPlayer playing height="300px" width="300px" url={myStream}/>
      </>
    }

      <button onClick={terminateCall}>End Call</button>
    </div>
  );
};

export default VideoCall;
