import Like from "../reactionBtn/like_btn.jsx";
import Dislike from "../reactionBtn/dislike_btn.jsx";
import Comment from "../Comment/Comment.jsx";
import Comment_section from "../commentSection/CommentSection.jsx";
import styles from "./post.module.css";
import Uname from "../usernameWithProfile/username_with_pofile.jsx";
import socket from "../socket.js";
import { forwardRef, useContext, useEffect, useState } from "react";
import { commentsContext } from "../App.jsx";
const Post = forwardRef((props, ref) => {
    // console.log(props.reaction);
    const [reaction, setReaction] = useState(props.reaction);
    const [prevReaction, setPrevReaction] = useState(props.reaction);
    const [noOfLikes, setNoOfLikes] = useState(props.likes);
    const [noOfDisikes, setNoOfDislikes] = useState(props.dislikes);
    const [twoComments, setTwoComments] = useState(props.comments.slice(0, 2));
    const [comments, setComments] = useState(props.comments);
    const commentSectionFunction = useContext(commentsContext);
    const [showCommentSection,setShowCommentSection]=useState(false)
    useEffect(() => {
        commentSectionFunction.setComments({ comments: comments, postId: props.postId });
    }, [commentSectionFunction.showComments,comments]);
    useEffect(() => {
        if (reaction != prevReaction) {
            if (prevReaction == 1 && reaction == -1) {
                setNoOfLikes(noOfLikes - 1);
            } else if (prevReaction == -1 && reaction == 1) {
                setNoOfDislikes(noOfDisikes - 1);
            }
        }
        setPrevReaction(reaction);
    }, [reaction]);
    useEffect(() => {
        socket.on("comment_added", (comment) => {
            comment.commentor = {
                name: localStorage.getItem("name"),
                id: localStorage.getItem("id"),
            };
            setComments((comments) => {
                return [comment, ...comments];
            });
            alert("add new comt in post");
        });
        return () => {
            socket.off("comment_added");
        };
    }, []);
    useEffect(() => {
        setTwoComments(comments.slice(0, 2));
    }, [comments]);
    // function sendCommentToCommentSection() {
    //     commentSectionFunction.s
    // }
    return (
        <div className={styles.postContainer} ref={ref}>
            <Uname uname={props.uploader.name} />
            <p className={styles.description}>{props.description}</p>
            <img
                src={`data:image/png;base64,${props.media}`}
                alt="post image"
                className={styles.media}
            />
            <hr />
            <Like
                postId={props.postId}
                reaction={reaction}
                amount={noOfLikes}
                setReaction={setReaction}
                setNoOfLikes={setNoOfLikes}
            />
            <Dislike
                postId={props.postId}
                reaction={reaction}
                amount={noOfDisikes}
                setReaction={setReaction}
                setNoOfDislikes={setNoOfDislikes}
            />
            <Comment.Comment_button />
            <div className={styles.twoComments}>
                {twoComments.map((comment) => {
                    return (
                        <Comment.Comment_body
                            comment={comment.comment}
                            commentor={comment.commentor.name}
                            commentor_id={comment.commentor.id}
                            key={comment._id}
                        />
                    );
                })}
            </div>
            {/* <Comment_section comments={props.comments} postId={props.postId} /> */}
        </div>
    );
});

function PostButton({ onclick }) {
    return <button onClick={onclick}>Post here</button>;
}

function PostingArea(props) {
    console.log("props.uploader", props.uploader);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    function handleSubmit(event) {
        event.preventDefault();
        console.log(props.uploader, description, image);
        socket.emit("post", props.uploader, description, image);
    }

    function handleChange(event, func) {
        console.log(event.target.value);
        func(event.target.value);
    }
    function handleImageUpload(event) {
        setImage(event.target.files[0]);
    }

    return (
        <div className={styles.form}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Description"
                    onChange={(event) => {
                        handleChange(event, setDescription);
                    }}
                />
                <input
                    type="file"
                    onChange={(event) => {
                        handleImageUpload(event);
                    }}
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default { Post: Post, Post_btn: PostButton, Posting_area: PostingArea };
