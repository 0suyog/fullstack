import Comment from "../Comment/Comment.jsx";
import styles from "./CommentSection.module.css";
import { useState, useEffect } from "react";
import send from "../assets/send.png";
import socket from "../socket.js";

function Comment_section({ comments, postId }) {
  const [commentDetails, setCommentDetails] = useState([]);
  const [comment,setComment]=useState("")
  useEffect(() => {
    setCommentDetails(comments);
    console.log(comments)
  }, []);

  function handleChange(event) {
    setComment(event.target.value)
  };
  function sendComment() {
    socket.emit("comment",postId,"65fc529147578c67d391b8e0",comment)
  }

  return (
    <div className={styles.minimized_section}>
      <Comment.Comment_body
        commentor="sunischit"
        comment="this is a sample comment without any vulgarity like fuck and motherfucker"
      />
            <textarea
        type="text"
        name="comment"
        placeholder="Comment here"
        cols={50}
        rows={20} onChange={handleChange}
      />
      <button onClick={sendComment}>
        <img src={send} alt="post comment" />
      </button>
      {commentDetails.map((comment) => (
        <Comment.Comment_body
          key={comment._id}
          commentor={comment._id}
          comment={comment.comment}
          postId={postId}
        />
      ))}


    </div>
  );
}

export default Comment_section;
