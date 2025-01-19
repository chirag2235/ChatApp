import React from "react";
import styled from "styled-components";

export default function Loader() {
  return (
    <LoaderContainer>
      <div className="spinner"></div>
    </LoaderContainer>
  );
}

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #121212; /* Dark background for consistency */

  .spinner {
    width: 70px; /* Increased size */
    height: 70px; /* Increased size */
    border: 6px solid rgba(255, 255, 255, 0.2); /* Slightly thicker border */
    border-top: 6px solid #1db954; /* Spotify green */
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
