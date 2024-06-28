import Comment from "../Comment/Comment.jsx";
import styles from "./CommentSection.module.css";
import { useState, useEffect, useRef, useContext } from "react";
import { commentsContext } from "../App.jsx";
import send from "../assets/send.png";
import socket from "../socket.js";

function CommentSection({ comments, postId }) {
    const [postComment, setPostComment] = useState(comments);
    const [comment, setComment] = useState("");
    const inpRef = useRef();
    const commentSectionFunction = useContext(commentsContext);
    function sendComment() {
        setComment(inpRef.current.value);
        socket.emit("comment", postId, localStorage.getItem("id"), inpRef.current.value);
        console.info(postId);
    }
    useEffect(() => {
        setPostComment(comments);
    }, [comments]);

    return (
        <div
            className={styles.overlay}
            onClick={() => {
                commentSectionFunction.setShowComments(false);
            }}>
            <div
                className={styles.commentSection}
                onClick={(e) => {
                    e.stopPropagation();
                }}>
                <input ref={inpRef} autoFocus={true}></input>
                <button onClick={sendComment}>Comment</button>
                {comments[0]._id != undefined
                    ? postComment.map((comment) => {
                          return (
                              <Comment.Comment_body
                                  comment={comment.comment}
                                  commentor={comment.commentor.name}
                                  commentor_id={comment.commentor.id}
                                  key={comment._id}
                              />
                          );
                      })
                    : null}
            </div>
        </div>
    );
}

export default CommentSection;
