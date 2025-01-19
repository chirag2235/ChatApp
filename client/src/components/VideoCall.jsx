import React, { use, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import peer from '../services/peer';


const VideoCall = ({ socket, from, to, call,failCall ,receiveOffer}) => {
  const [userAccept, setUserAccept] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [offer,setoffer]=useState(null);
  const terminateCall = () => {
    call(false);
  };

  const acceptCall = useCallback(async () => {
    setUserAccept(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    setoffer(receiveOffer);
    console.log("receive offer  ",receiveOffer);
    const answer = await peer.getAnswer(receiveOffer);
    console.log("call accept   ",answer);
    socket.current.emit("call:accept", { from,to,ans:answer});
  },[]);
  const calling=useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    console.log("stream : ",stream);
    const tempoffer = await peer.getOffer();
    setoffer(tempoffer);
    console.log("offer:  ",tempoffer);
    socket.current.emit("call:ringing", { from, to ,offer:tempoffer});
  },[]);

  const handleNegoIncoming=useCallback(async({off})=>{
    const ans=await peer.getAnswer(off);
    socket.current.emit("peer:nego:done",{from,to,ans});
  },[socket]);

  const handleNegoNeeded=useCallback(async()=>{
    const off=await peer.getOffer();
    socket.current.emit("peer:nego:needed", { from, to ,off});
  },[]);

  const handleNegoFinal=useCallback(async({ans})=>{
    await peer.setLocalDescription(ans);
  },[]);


  const handleCallFail=useCallback((data)=>{
    failCall(true);
        console.log("Call failed", data);
        terminateCall();
  },[]);

  const sendStream=useCallback(async()=>{
    for(const track of myStream.getTracks()){
      peer.peer.addTrack(track,myStream);
    }
  },[myStream]);

  const handleCallAccepted=useCallback(async({ans})=>{
    await peer.setLocalDescription(ans);
        console.log("Call accepted from offer", from,ans);
        setUserAccept(true);
        sendStream();
        const offer = await peer.peer.createOffer();
        await peer.peer.setLocalDescription(offer);
        socket.current.emit("peer:nego:needed", { from, to, off: offer });
      },[myStream]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("call:accepted",handleCallAccepted);
      socket.current.on("call:failed",handleCallFail);
      socket.current.on("peer:nego:need",handleNegoIncoming);
      socket.current.on("peer:nego:final",handleNegoFinal);
    }
    return () => {
      socket.current.off("call:accepted");
    };
  }, [socket,handleCallAccepted]);
  useEffect(() => {
    if (!receiveOffer){
      calling();
      console.log("offer:  ",offer);
    }
  }, []);
  const handleTrackEvent = async (event) => {
    const remote=event.streams;
    console.log('handle track event');
    setRemoteStream(remote[0]);
  };
  useEffect(() => {
    peer.peer.addEventListener('track', handleTrackEvent);
  }, [peer]);
  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
      
    };
  }, [peer,handleNegoNeeded]);
  return (
    <div>
      <h1>Video Call</h1>
      {/* {console.log({ socket, to, from })} */}
      {
          !userAccept && ((receiveOffer) ? 
      <><h3>Incoming Call</h3>
      <button onClick={acceptCall}>Accept</button>
      </>:
      <h2>Calling...</h2>
      )
      }  
      
      {myStream && <>
      <ReactPlayer playing muted height="300px" width="300px" url={myStream}/>
      </>
    }
    <button onClick={sendStream}>Negotiate</button>
    {
      remoteStream && <>
      remote
      <ReactPlayer playing muted height="300px" width="300px" url={remoteStream}/>
      </>
    }

      <button onClick={terminateCall}>End Call</button>
    </div>
  );
};

export default VideoCall;
