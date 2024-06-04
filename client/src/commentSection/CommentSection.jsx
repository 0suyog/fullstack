import Comment from "../Comment/Comment.jsx";
import styles from "./CommentSection.module.css";
import { useState, useEffect } from "react";
import send from "../assets/send.png";
import socket from "../socket.js";

function Comment_section({ comments, postId }) {
    const [postComment, setPostComment] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
        setPostComment(comments);
    }, []);

    function handleChange(event) {
        setComment(event.target.value);
    }
    function sendComment() {
        socket.emit("comment", postId, localStorage.getItem("id"), comment);
    }

    return (
        <>
            <input onChange={handleChange}></input>
            <button onClick={sendComment}></button>
        {postComment.map((comment) => {
              // console.log(comment.comment)
              // console.log(comment.commentor)
              // console.log(comment.commentor._id)
                return (
                    <Comment.Comment_body
                        comment={comment.comment}
                        commentor={comment.commentor.name}
                        commentor_id={comment.commentor._id}
                    />
                );
            })}
        </>
    );
}

export default Comment_section;
