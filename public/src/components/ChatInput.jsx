import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 10% 90%;
  background-color: #191414;
  padding: 1rem 2rem;
  border-top: 1px solid #282828;

  @media screen and (max-width: 720px) {
    grid-template-columns: 15% 85%;
    padding: 0.5rem 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: #b3b3b3;
    .emoji {
      position: relative;

      svg {
        font-size: 1.8rem;
        color: #1db954;
        cursor: pointer;
        transition: color 0.3s ease, transform 0.3s ease;

        &:hover {
          color: #1ed760;
          transform: scale(1.2);
        }
      }
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #282828;
    padding: 0.5rem 1rem;
    border-radius: 2rem;

    input {
      flex: 1;
      background-color: transparent;
      color: #ffffff;
      border: none;
      font-size: 1rem;
      padding-left: 1rem;

      &::selection {
        background-color: #1db954;
        color: #000;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 2rem;
      background-color: #1db954;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;

      svg {
        color: #fff;
        font-size: 1.5rem;
      }

      &:hover {
        background-color: #1ed760;
        transform: scale(1.1);
      }

      &:active {
        background-color: #14833b;
      }
    }
  }
`;
