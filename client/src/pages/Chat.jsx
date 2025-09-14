import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import Logout from "../components/Logout";
import VideoCall from "../components/VideoCall";
import { ToastContainer } from "react-toastify";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currVideoCallUser,setVideoCallUser]=useState(false);
  //by default it is caller means false
  const [failCall, setFailCall] = useState(null);
  const [receieveOffer,setReceieveOffer]=useState(null);
  
  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      );
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  const handleIncomingCall=({to,offer})=>{
    setReceieveOffer(offer);
      console.log("Received call from", to,offer); // Debugging line
      setVideoCallUser(to);
  } 
  useEffect(() => {
    if (socket.current) {
      socket.current.on("incoming:call",handleIncomingCall);
      return () => { 
        socket.current.off("incoming:call",handleIncomingCall);
      }
    }
  }, [socket,handleIncomingCall]);
  

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
          setSearchResults(data.data); // Initialize search results with all contacts
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = contacts.filter((contact) =>
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(contacts);
    }
  }, [searchQuery, contacts]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  const handleVideoCall=(chat)=>{
    setVideoCallUser(chat);
    console.log(chat);
  }
  return (
    <>
      <Container>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="logout-container">
          <Logout />
        </div>

        <div className="container">
          <Contacts contacts={searchResults} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} call={handleVideoCall}/>
          )}
          {
            currVideoCallUser && <VideoCall socket={socket} from={currentUser} to={currVideoCallUser} call={handleVideoCall} failCall={setFailCall} receiveOffer={receieveOffer}/>
          }
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
  background-color: #121212; /* Spotify-like dark background */

  .search-container {
    width: 20%;
    margin-left: 2%;
    margin-top: 2%;
    height: 7%;
    padding: 0.5%;
    background-color: #1e1e1e; /* Darker search container */
    display: flex;
    align-items: center;
    border-radius: 8px;

    input {
      width: 100%;
      padding: 8px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      color: white;
      background-color: #2a2a2a; /* Subtle dark background for input */
      outline: none;
      transition: background-color 0.3s ease;

      &:focus {
        background-color: #333333;
        border: 0.1rem solid #1db954; /* Spotify green */
        outline: none;
      }
    }
  }

  .logout-container {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 10;

    button {
      background-color: #1db954; /* Spotify green */
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #1ed760;
      }
    }
  }

  .container {
    height: 100%;
    width: 100%;
    background: linear-gradient(135deg, #181818, #282828); /* Gradient background */
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }

  /* Contacts section */
  .contacts {
    background-color: #242424; /* Dark sidebar */
    color: white;
    overflow-y: auto;

    .contact {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #1db954; /* Spotify green on hover */
        color: black;
      }
    }
  }

  /* ChatContainer */
  .chat-container {
    background-color: #121212;
    color: white;
    overflow-y: auto;
    padding: 20px;
  }
`;
