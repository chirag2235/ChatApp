import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from '/src/assets/logo.png';  // Correct path for Vite
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";


export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Talkify</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #121212; /* Spotify dark background */

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: #1db954; /* Spotify green */
      text-transform: uppercase;
      font-size: 2rem;
      font-weight: bold;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #181818; /* Slightly darker card background */
    border-radius: 1rem;
    padding: 4rem 3rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);

    input {
      background-color: #282828; /* Neutral input background */
      padding: 1rem;
      border: 0.1rem solid #1db954; /* Spotify green border */
      border-radius: 0.5rem;
      color: white;
      font-size: 1rem;

      &:focus {
        border-color: #1ed760; /* Lighter green focus border */
        outline: none;
        background-color: #333333; /* Slightly darker background on focus */
      }
    }

    button {
      background-color: #1db954; /* Spotify green button */
      color: #ffffff;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.5rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #1ed760; /* Lighter green on hover */
      }
    }

    span {
      color: #ffffff;
      text-transform: uppercase;
      font-size: 0.9rem;

      a {
        color: #1db954;
        text-decoration: none;
        font-weight: bold;

        &:hover {
          color: #1ed760; /* Lighter green on hover */
        }
      }
    }
  }
`;
