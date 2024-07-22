import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Button } from "flowbite-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
        return toast.success("Successfully Logged-In");
      });
    } else {
      return toast.failure("Wrong Credentials Entered");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="login" onSubmit={login}>
      <h1 className="text-3xl font-bold leading-none text-gray-900 dark:text-white mb-5">
        Login
      </h1>
      <input
        type="text"
        placeholder="username"
        className="mb-5"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      {/* <input
        type="email"
        placeholder="email@company.com"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      /> */}
      <input
        type="password"
        placeholder="password"
        value={password}
        className="mb-5"
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
