import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const storedData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (storedData) {
        const data = await JSON.parse(storedData);
        setUserName(data?.username || "User");
      }
    };
    fetchUserName();
  }, []);

  return (
    <Container>
      <img src={Robot} alt="Welcome Robot" />
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
