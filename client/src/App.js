import { DarkThemeToggle,Button } from "flowbite-react";
import "./index.css";
import Post from "./Post.js"
import Header from "./Header.js"
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.js"
import IndexPage from "./pages/IndexPage";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.js";
import { UserContextProvider } from "./UserContext.js"
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import { Toaster } from "react-hot-toast";

function App() {
  return (

      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/edit/:id" element={<EditPost />} />
          </Route>
        </Routes>
        <Toaster/>
      </UserContextProvider>
    
  );
}

export default App;
