import { Link,useNavigate } from "react-router-dom";
import { useContext, useEffect} from "react";
import { UserContext } from "./UserContext";
import toast from "react-hot-toast";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate=useNavigate();
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    navigate('/');
    return toast.success("Logout successfully");
  }

  const username = userInfo?.username;
  return (
    <header>
      <Link to="/" className="logo">
        StarBuzz.ai Blogs
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
