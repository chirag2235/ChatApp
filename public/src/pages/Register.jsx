import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 4) {
      toast.error(
        "Password should be equal or greater than 4 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
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
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
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
      letter-spacing: 0.1rem;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #181818; /* Slightly darker form background */
    border-radius: 1rem;
    padding: 4rem 3rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);

    input {
      background-color: #282828; /* Neutral input background */
      padding: 1rem;
      border: 0.1rem solid transparent;
      border-radius: 0.5rem;
      color: white;
      font-size: 1rem;
      transition: background-color 0.3s ease, border-color 0.3s ease;

      &:focus {
        background-color: #333333; /* Slightly darker on focus */
        border-color: #1db954; /* Spotify green border */
        outline: none;
      }

      &::placeholder {
        color: #b3b3b3; /* Spotify placeholder color */
      }
    }

    button {
      background-color: #1db954; /* Spotify green */
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
      text-align: center;

      a {
        color: #1db954; /* Spotify green */
        text-decoration: none;
        font-weight: bold;

        &:hover {
          color: #1ed760; /* Lighter green on hover */
        }
      }
    }
  }

  @media (max-width: 768px) {
    form {
      padding: 3rem 2rem;

      input {
        font-size: 0.9rem;
      }

      button {
        font-size: 0.9rem;
        padding: 0.8rem 1.5rem;
      }

      span {
        font-size: 0.8rem;
      }
    }

    .brand h1 {
      font-size: 1.5rem;
    }
  }
`;
