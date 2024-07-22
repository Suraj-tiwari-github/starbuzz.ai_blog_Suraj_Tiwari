import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import axios from "axios";
import { Button, Label, Textarea, Card } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);

  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [render, setRender] = useState(false);
  const [commentId, setCommentId] = useState("");
  const navigate = useNavigate();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!userInfo || !userInfo.id) {
      return toast.error("You must be signed in to comment.");
    }
    const res = await fetch("http://localhost:4000/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: comment, id, userId: userInfo.id }),
    });
    if (res.ok) {
      const data = await res.json();
      // console.log(data);
      setComment("");
      setRender(!render);
      return toast.success("Comment Added Successfully!");
    } else {
      console.error("Error creating comment");
      return toast.error("Error Creating Comment.");
    }
    // if(res)
  };
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleDeleteComment = async (comment) => {
    let authorId = comment.author._id;
    let id = comment._id;
    if (!userInfo || !userInfo.id) {
      return toast.error("You must be signed in to delete a comment.");
    }
    const res = await fetch(`http://localhost:4000/comments/delete/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ id, commentId }),
    });
    if (res.ok) {
      const data = await res.json();
      toast.success(data.message); 
    } else {
      console.error("Error deleting comment");
      toast.error("Error deleting comment");
    }
  };
  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id, render]);

  if (!postInfo) return "";
  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo && userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
      {!userInfo && (
        <>
          <div className="mb-10 flex gap-3 text-teal-500">
            <p className="">
              You must be signed in to comment/createPost.
              <Link
                to={"/login"}
                className="gap-3 text-xl text-blue-900 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Comments:
        </h5>
      </div>
      {userInfo && (
        <form onSubmit={handleSubmitComment} className="mb-9">
          <Textarea
            placeholder="Add a comment.."
            rows="3"
            value={comment}
            onChange={handleCommentChange}
          />
          <div className="mt-5 flex items-center justify-between">
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      {postInfo.comments.length > 0 && (
        <>
          <div className="rounded-md border border-teal-500 p-3">
            {console.log(postInfo.comments)}
            {postInfo.comments.map((comment) => (
              <div key={comment._id} className="comment">
                {console.log(comment)}
                <Card className="mb-4">
                  <div>
                    <div className="text-sm font-bold">
                      @{comment.author ? comment.author.username : "Unknown"}

                    </div>
                    <p className="mt-1">{comment.body}</p>
                    
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
