import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f7fc;
  margin: 0 auto;
`;

const LoginCard = styled.div`
  background: white;
  padding: 32px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 22px;
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

const Message = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.$success ? "#28a745" : "#d32f2f")};
  margin-bottom: 12px;
`;

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/dashboard");
  }, [navigate]);

  return (
    <Container>
      <LoginCard>
        {message && <Message $success={message.includes("✅")}>{message}</Message>}
        <GoogleLoginButton setMessage={setMessage} message={message} />
      </LoginCard>
    </Container>
  );
};

export default Login;
