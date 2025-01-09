import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import Logout from "./Logout";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  return (
    <Container>
    {/* <div className="log"><Logout/></div> */}
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #191414; /* Spotify dark background */
  color: #b3b3b3; /* Muted gray text */
  height: 100vh;
  text-align: center;

  img {
    height: 15rem; /* Adjusted for better responsiveness */
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #ffffff; /* Bright white for main heading */
    margin-bottom: 0.5rem;

    span {
      color: #1db954; /* Spotify green for username */
    }
  }

  h3 {
    font-size: 1.2rem;
    color: #b3b3b3; /* Muted text for the subheading */
  }

  .log {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;
