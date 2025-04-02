import { useEffect, useState } from "react";
import { logout } from "../firebase/authService";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { saveToGoogleDrive, fetchLettersFromDrive, deleteLetterFromDrive } from "../utils/googleDrive.js";
import styled from "styled-components";
import LetterEditor from "../components/LetterEditor";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #f4f4f9;
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #007bff;
  color: white;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`;

const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #a71d2a;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const SavedLetterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 5px solid #007bff;
  padding: 15px;
  margin-bottom: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: ${(props) => (props.$primary ? "#28a745" : "#dc3545")};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  margin-left: 10px;

  &:hover {
    background-color: ${(props) => (props.$primary ? "#218838" : "#a71d2a")};
  }
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [letters, setLetters] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Authenticate user
  useEffect(() => {
    auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const savedLetters = await fetchLettersFromDrive();
          setLetters(savedLetters); // Now letters contain { id, name, content }
        } catch (err) {
          console.error("Error fetching letters:", err);
          setError("Failed to load saved letters.");
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/");
      }
    });
  }, [navigate]);
  
  // Fetch saved letters from Google Drive once user is set
  useEffect(() => {
    if (user) {
      const fetchLetters = async () => {
        try {
          setLoading(true);
          const savedLetters = await fetchLettersFromDrive();
          setLetters(savedLetters);
        } catch (err) {
          console.error("Error fetching letters:", err);
          setError("Failed to load saved letters.");
        } finally {
          setLoading(false);
        }
      };

      fetchLetters();
    }
  }, [user]);

  const handleSaveLetter = async (content) => {
    if (!content.trim()) {
      alert("Cannot save an empty letter!");
      return;
    }
    try {
      await saveToGoogleDrive(content);
      setLetters((prev) => [...prev, content]);
      alert("Letter saved to Google Drive!");
    } catch (error) {
      console.error("Error saving letter:", error);
      alert("Failed to save letter.");
    }
  };

  const handleDeleteLetter = async (index) => {
    try {
      await deleteLetterFromDrive(index);
      setLetters((prev) => prev.filter((_, i) => i !== index));
      alert("Letter deleted from Google Drive!");
    } catch (error) {
      console.error("Error deleting letter:", error);
      alert("Failed to delete letter.");
    }
  };

  const handleSaveDraft = (content) => {
    if (!content.trim()) {
      alert("Draft cannot be empty!");
      return;
    }
    setDrafts([...drafts, content]);
    alert("Draft saved!");
  };

  const handleDeleteDraft = (index) => {
    setDrafts(drafts.filter((_, i) => i !== index));
  };

  const handleUploadDraft = async (index) => {
    await handleSaveLetter(drafts[index]);
    handleDeleteDraft(index);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <Content>
        {user && <h2>Welcome, {user.displayName}!</h2>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <LetterEditor onSave={handleSaveLetter} onSaveDraft={handleSaveDraft} />
        <h3>Saved Letters</h3>
{loading ? (
  <p>Loading letters...</p>
) : letters.length === 0 ? (
  <p>No saved letters.</p>
) : (
  letters.map((letter, index) => (
    <SavedLetterContainer key={letter.id}>
      <div>
        <strong>{letter.name}</strong>
        <p>{letter.content}</p>
      </div>
      <DeleteButton onClick={() => handleDeleteLetter(letter.id)}>
        Delete
      </DeleteButton>
    </SavedLetterContainer>
  ))
)}
        <h3>Drafts</h3>
        {drafts.length === 0 ? (
          <p>No drafts saved yet.</p>
        ) : (
          drafts.map((draft, index) => (
            <SavedLetterContainer key={index}>
              <div>{draft}</div>
              <Button $primary onClick={() => handleUploadDraft(index)}>
                Upload
              </Button>
              <Button onClick={() => handleDeleteDraft(index)}>Delete</Button>
            </SavedLetterContainer>
          ))
        )}
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;
