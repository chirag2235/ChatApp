import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (storedData) {
          const data = JSON.parse(storedData);
          setCurrentUserName(data?.username || "User");
          setCurrentUserImage(data?.avatarImage || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Talkify</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                    alt="avatar"
                  />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #121212;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    background-color: #181818;
    padding: 1rem 0;

    img {
      height: 2.5rem;
    }

    h3 {
      color: #1db954;
      text-transform: uppercase;
      font-size: 1.2rem;
      font-weight: 600;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    gap: 0.5rem;
    padding: 1rem;

    &::-webkit-scrollbar {
      width: 0.4rem;

      &-thumb {
        background-color: #1db954;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: #282828;
      min-height: 4rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: background-color 0.3s ease, transform 0.3s ease;

      .avatar {
        img {
          height: 2rem;
          border-radius: 50%;
        }
      }

      .username {
        h3 {
          color: white;
          font-size: 1.1rem;
        }
      }

      &:hover {
        background-color: #1db954;
        transform: scale(1.05);
      }
    }

    .selected {
      background-color: #1ed760;
    }
  }

  .current-user {
    background-color: #181818;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;

    .avatar {
      img {
        height: 3rem;
        border-radius: 50%;
      }
    }

    .username {
      h2 {
        color: white;
        font-size: 1.3rem;
        font-weight: 500;
      }
    }

    @media screen and (max-width: 720px) {
      gap: 1rem;

      .avatar img {
        height: 2.5rem;
      }

      .username h2 {
        font-size: 1rem;
      }
    }
  }
`;
