import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
      // alert("registration successful");
      navigate("/login");
      return toast.success("registration successful");
      
    } else {
      // alert("registration failed");
      return toast.failure("Registration Failed, Try again");
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1 className="mb-5 text-3xl font-bold leading-none text-gray-900 dark:text-white">
        Register
      </h1>
      <input
        type="text"
        className="mb-5"
        required
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="email"
        placeholder="email@company.com"
        className="mb-5"
        value={email}
        required
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <input
        type="password"
        className="mb-5"
        placeholder="password"
        required
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
