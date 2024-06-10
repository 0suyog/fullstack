import Comment from "../Comment/Comment.jsx";
import styles from "./CommentSection.module.css";
import { useState, useEffect } from "react";
import send from "../assets/send.png";
import socket from "../socket.js";

function Comment_section({ comments, postId }) {
    const [postComment, setPostComment] = useState([comments]);
    const [comment, setComment] = useState("");
    // useEffect(() => {
    //     console.log("comment=");
    //     console.log(postComment[0][0])
    // }, []);

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
            {postComment[0][0]._id != undefined
                ? postComment[0].map((comment) => {
                      console.log("comment=");
                      console.log(comment.commentor);
                      return (
                          <Comment.Comment_body
                              comment={comment.comment}
                              commentor={comment.commentor.name}
                              commentor_id={comment.commentor.id}
                          />
                      );
                  })
                : null}
        </>
    );
}

export default Comment_section;
