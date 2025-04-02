import { useState, useEffect } from "react";
import styled from "styled-components";
import { saveToGoogleDrive } from "../utils/googleDrive";
import { fetchLettersFromDrive } from "../utils/googleDrive";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f9fa;
  width: 100%;
  max-width: 600px;
  margin: auto;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  transition: background 0.3s;

  &:hover {
    background-color: darkred;
  }
`;

const SavedLettersContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const SaveButton = styled.button`
  background-color: ${(props) => (props.$primary === "true" ? "#007bff" : "#6c757d")};
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  opacity: ${(props) => (props.$disabled ? "0.6" : "1")};

  &:hover {
    background-color: ${(props) => (props.$primary === "true" ? "#0056b3" : "#545b62")};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Message = styled.p`
  font-size: 14px;
  color: ${(props) => (props.$error ? "red" : "green")};
  text-align: center;
`;

const LetterEditor = ({ onSaveDraft }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [savedLetters, setSavedLetters] = useState([]);
  const [savedDriveLetters, setSavedDriveLetters] = useState([]);

  useEffect(() => {
    async function loadLetters() {
        const letters = await fetchLettersFromDrive();
        setSavedDriveLetters(letters);
    }
    loadLetters();
}, []);

  useEffect(() => {
    const fetchSavedLetters = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/letters/all");
        if (!res.ok) throw new Error("Failed to fetch letters");
        const data = await res.json();
        setSavedLetters(Array.isArray(data) ? data : []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching saved letters:", error);
        setSavedLetters([]); // Prevents crashes
      }
    };
    fetchSavedLetters();
  }, []);  

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSaveToDrive = async () => {
    if (!content.trim()) {
      setMessage("❌ Letter cannot be empty!");
      setIsSuccess(false);
      return;
    }
    setLoading(true);
    setMessage("Saving to Google Drive...");
    setIsSuccess(null);
    try {
      const success = await saveToGoogleDrive(content);
      if (success) {
        setMessage("✅ Letter saved to Google Drive successfully!");
        setIsSuccess(true);
        setContent("");
      } else {
        setMessage("❌ Save to Google Drive failed.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Save Error:", error);
      setMessage("❌ Save to Google Drive failed.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToMongoDB = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/letters/save", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ content }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(`⚠️ MongoDB Error: ${data.error || res.statusText}`);
        }

        setMessage("✅ Letter saved to MongoDB successfully!");
        setIsSuccess(true);
        setContent("");
        setSavedLetters([...savedLetters, { content }]);
    } catch (error) {
        console.error("❌ MongoDB Save Error:", error);
        setMessage(error.message);
        setIsSuccess(false);
    } finally {
        setLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    if (!content.trim()) {
      setMessage("❌ Draft cannot be empty!");
      setIsSuccess(false);
      return;
    }
    onSaveDraft(content);
    setContent("");
    setMessage("✅ Draft saved successfully!");
    setIsSuccess(true);
  };

  const handleDeleteLetter = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/letters/delete/${id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Failed to delete letter");
  
      setSavedLetters((prevLetters) => prevLetters.filter((letter) => letter._id !== id));
    } catch (error) {
      console.error("❌ Delete Error:", error);
    }
  };  

  return (
    <EditorContainer>
      <h3>Write Your Letter</h3>
      <TextArea value={content} onChange={handleChange} placeholder="Type here..." />
      {message && <Message error={isSuccess === false}>{message}</Message>}
      <ButtonContainer>
        <SaveButton $primary="true" onClick={handleSaveToDrive} disabled={loading}>
          {loading ? "Saving..." : "Save to Google Drive"}
        </SaveButton>
        <SaveButton $primary="true" onClick={handleSaveToMongoDB} disabled={loading}>
          {loading ? "Saving..." : "Save to MongoDB"}
        </SaveButton>
        <SaveButton $primary="false" onClick={handleSaveAsDraft} disabled={loading}>
          Save as Draft
        </SaveButton>
      </ButtonContainer>

      <SavedLettersContainer>
  <h4>Saved Letters</h4>
  {savedLetters.length === 0 ? (
    <p>No saved letters yet.</p>
  ) : (
    <ul>
{savedDriveLetters.map((letter) => (
                <li key={letter.id}>
                    {letter.content}
                </li>
            ))}
      {savedLetters.map((letter) => (
        <li key={letter._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {letter.content}
          <button 
            style={{
              backgroundColor: "transparent",
              color: "red",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              marginLeft: "10px"
            }} 
            onClick={() => handleDeleteLetter(letter._id)}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  )}
</SavedLettersContainer>
    </EditorContainer>
  );
};

export default LetterEditor;
