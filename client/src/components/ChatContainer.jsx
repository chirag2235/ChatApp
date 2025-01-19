import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { IoVideocamOutline } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket ,call}) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    fetchMessages();
  }, [currentChat]);
  

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });
  
      const response = await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });
  
      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  const handleVideoCall=()=>{
    call(currentChat);
  }
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
    return ()=>{
      socket.current.off("msg-recieve");
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>

        <IoVideocamOutline className="video-icon" onClick={handleVideoCall} />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  padding:0.5rem;
  background-color: #121212; /* Spotify-like dark background */

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background-color: #181818; /* Slightly darker header background */
    border-bottom: 1px solid #282828;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 2rem;
          border-radius: 50%;
        }
      }

      .username {
        h3 {
          color: #ffffff; /* Bright white for username */
          font-weight: 500;
        }
      }
    }

    .video-icon {
      font-size: 2rem;
      color: #1db954; /* Spotify green */
      cursor: pointer;
      transition: transform 0.3s ease, color 0.3s ease;

      &:hover {
        color: #1ed760; /* Lighter green on hover */
        transform: scale(1.1); /* Slight zoom on hover */
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    background-color: #121212; /* Same dark background as main container */

    &::-webkit-scrollbar {
      width: 0.4rem;

      &-thumb {
        background-color: #1db954; /* Spotify green scrollbar */
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 45%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1rem;
        border-radius: 1rem;
        color: #e0e0e0; /* Light gray for text */
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #1db954; /* Spotify green for sent messages */
        color: #121212; /* Dark text for contrast */
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #282828; /* Neutral gray for received messages */
      }
    }
  }

  .chat-input {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #181818; /* Same as header background */
    border-top: 1px solid #282828;

    input {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 20px;
      font-size: 1rem;
      color: white;
      background-color: #2a2a2a; /* Subtle gray for input field */
      outline: none;
      transition: border 0.3s ease;

      &:focus {
        border: 2px solid #1db954; /* Spotify green border on focus */
      }
    }

    button {
      margin-left: 1rem;
      padding: 0.8rem 1.5rem;
      background-color: #1db954; /* Spotify green */
      color: white;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #1ed760; /* Lighter green on hover */
      }
    }
  }
`;
