import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import axios from "axios";
import { Button, Label, Textarea } from "flowbite-react";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [updatedCommentContent, setUpdatedCommentContent] = useState("");
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: comment, id, userId: userInfo.id }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
    } else {
      console.error("Error creating comment");
    }
    // if(res)
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleEditComment = async (e, commentId) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:4000/edit/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: updatedCommentContent }),
    });

    if (res.ok) {
      const data = await res.json();
      // Update the comment in the UI
    } else {
      console.error("Error editing comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const res = await fetch(
      `http://localhost:4000/comment/delete/${commentId}`,
      {
        method: "DELETE",
      },
    );

    if (res.ok) {
    } else {
      console.error("Error deleting comment");
    }
  };

  const handleEditButtonClick = async (commentId) => {
    const res = await fetch(`http://localhost:4000/comment/${commentId}`);
    const data = await res.json();
    if (res.ok) {
      setEditingComment(commentId);
      setUpdatedCommentContent(data.body);
    } else {
      console.error("Error fetching comment data");
    }
  };

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id]);
  if (!postInfo) return "";

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
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
      <div>{postInfo.comment > 1 && <></>}</div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
      {userInfo.id ? (
        <>
          <div>
            <p>
              Signed in as :
              <span className="text-cyan-600 hover:underline">
                @{postInfo.author.username}
              </span>
            </p>
          </div>
          {/* <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Your message" />
            </div>
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              required
              rows={4}
            />
          </div> */}
        </>
      ) : (
        <>
          <div className="flex gap-3 text-teal-500">
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
      {userInfo.id && (
        <form
          onSubmit={handleSubmitComment}
          className="rounded-md border border-teal-500 p-3"
        >
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
    </div>
  );
}
