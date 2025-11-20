import { useState } from "react";
import axios from "axios";

export default function LinkForm({ onSuccess }) {
  const [target, setTarget] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const body = { target };
      if (code.trim().length > 0) {
        body.code = code;
      }

      await axios.post("http://localhost:4000/api/links", body);

      setMessage("Link created successfully!");
      setTarget("");
      setCode("");
      onSuccess();
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage(err.response.data.error || "Invalid request");
      } else if (err.response?.status === 409) {
        setMessage("Custom code already exists.");
      } else {
        setMessage("Error creating link.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter long URL"
        required
      />
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Custom code (6-8 chars, optional)"
      />
      <button type="submit">Create Link</button>
      {message && <p className="msg">{message}</p>}
    </form>
  );
}