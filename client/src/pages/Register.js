import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email,setEmail]=useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
  
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, email,password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("registration successful");
      navigate("/login");
    } else {
      alert("registration failed");
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="email"
        placeholder="email@company.com"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
