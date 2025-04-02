import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styled from "styled-components";

const EditorContainer = styled.div`
  width: 80%;
  margin: 20px auto;
  background: #f9f9f9;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
`;

const EditorTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
`;

const SaveButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#cccccc" : "#28a745")};
  color: white;
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  margin-top: 15px;
  display: block;
  width: 100%;
  transition: 0.3s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#cccccc" : "#218838")};
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 0.9rem;
  margin-top: 10px;
  text-align: center;
`;

const Editor = ({ onSave }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (text.trim() === "") {
      setError("Letter cannot be empty!");
      setSuccess(""); // Clear previous success message
      return;
    }

    setIsSaving(true);
    setError(""); // Clear any previous errors
    try {
      await onSave(text);
      setSuccess("Letter saved successfully! ✅");
      setText(""); // Clear editor after save
    } catch (error) {
      setError("Failed to save the letter. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EditorContainer>
      <EditorTitle>Write Your Letter</EditorTitle>
      <ReactQuill value={text} onChange={setText} theme="snow" />
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <SaveButton onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save to Google Drive"}
      </SaveButton>
    </EditorContainer>
  );
};

export default Editor;
