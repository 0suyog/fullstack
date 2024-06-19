import Comment from "../Comment/Comment.jsx";
import styles from "./CommentSection.module.css";
import { useState, useEffect, useRef, useContext } from "react";
import { commentsContext } from "../App.jsx";
import send from "../assets/send.png";
import socket from "../socket.js";

function Comment_section({ comments, postId }) {
    const [postComment, setPostComment] = useState(comments);
    // const [comment, setComment]         = useState("");
    const inpRef                        = useRef();
    const commentSectionFunction        = useContext(commentsContext);
    alert(commentSectionFunction)
    console.log("comments=", postComment);
    function sendComment() {
        // setComment(inpRef.current.value);
        socket.emit("comment", postId, localStorage.getItem("id"), inpRef.current.value);
    }
    // useEffect(() => {
    //     socket.on("comment_added", (comment) => {
    //         comment.commentor = {
    //             name: localStorage.getItem("name"),
    //             id  : localStorage.getItem("id"),
    //         };
    //         setPostComment((postComments) => {
    //             return [comment, ...postComments];
    //         });
    //     });
    //     return () => {
    //         socket.off("comment_added");
    //     };
    // }, []);

    return (
        <div    className = {styles.overlay} onClick = {()=>{commentSectionFunction.setShowComments(false)}} >
            <div className={styles.commentSection} onClick={(e) => {
            e.stopPropagation()
        }}>
        <input  ref       = {inpRef}></input>
        <button onClick   = {sendComment}>Comment</button>
                {postComment[0]._id != undefined
                    ? postComment.map((comment) => {
                          return (
                              <Comment.Comment_body
                                  comment      = {comment.comment}
                                  commentor    = {comment.commentor.name}
                                  commentor_id = {comment.commentor.id}
                                  key          = {comment._id}
                              />
                          );
                      })
                    : null}
            </div>
        </div>
    );
}

export default Comment_section;
