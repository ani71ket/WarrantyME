import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase/authService";
import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #6a11cb, #2575fc);
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  width: 400px;
  border-radius: 12px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => (props.success ? "green" : "red")};
  margin-bottom: 15px;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  padding: 12px 18px;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  color: #333;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #f8f9fa;
    transform: scale(1.03);
  }

  svg {
    margin-right: 10px;
    font-size: 22px;
  }
`;

const GoogleLoginButton = ({ setMessage, message }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  }, [isLoggedIn]); 

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        localStorage.setItem("user", JSON.stringify(result.user));
        setMessage("✅ Login successful! Redirecting...");
        setIsLoggedIn(true);
      }
    } catch (error) {
      setMessage("❌ Login failed. Please try again.");
    }
  };

  return (
    <Container>
      <LoginCard>
        {message && <Message success={message.includes("✅")}>{message}</Message>}
        <Title>Welcome to MyApp</Title>
        <Subtitle>Sign in to continue</Subtitle>
        <GoogleButton onClick={handleLogin}>
          <FcGoogle /> Sign in with Google
        </GoogleButton>
      </LoginCard>
    </Container>
  );
};

export default GoogleLoginButton;
