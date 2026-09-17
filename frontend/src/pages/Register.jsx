import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.register({
        name,
        email,
        password,
        role,
      });

      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="CANDIDATE">Candidate</option>
          <option value="RECRUITER">Recruiter</option>
        </select>

        <button type="submit">Register</button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Register;