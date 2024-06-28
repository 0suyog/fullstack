import Like from "../reactionBtn/like_btn.jsx";
import Dislike from "../reactionBtn/dislike_btn.jsx";
import Comment from "../Comment/Comment.jsx";
import styles from "./post.module.css";
import Uname from "../usernameWithProfile/username_with_pofile.jsx";
import socket from "../socket.js";
import { forwardRef, useContext, useEffect, useState } from "react";
import { commentsContext } from "../App.jsx";
const Post = forwardRef((props, ref) => {
    const [reaction, setReaction] = useState(props.reaction);
    const [prevReaction, setPrevReaction] = useState(props.reaction);
    const [noOfLikes, setNoOfLikes] = useState(props.likes);
    const [noOfDisikes, setNoOfDislikes] = useState(props.dislikes);
    const [twoComments, setTwoComments] = useState(props.comments.slice(0, 2));
    const [comments, setComments] = useState(props.comments);
    const commentSectionFunction = useContext(commentsContext);
    const [showCommentSection, setShowCommentSection] = useState(false);
    useEffect(() => {
        if (showCommentSection) {
            socket.emit("comments_of_post", props.postId);
            console.log(props.postId);
        }
    }, [showCommentSection]);

    useEffect(() => {
        if (commentSectionFunction.showComments == false) {
            setShowCommentSection(false);
        }
    }, [commentSectionFunction.showComments]);
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
            console.log(props.postId, comment.post);
            if (props.postId == comment.post) {
                comment.commentor = {
                    name: localStorage.getItem("name"),
                    id: localStorage.getItem("id"),
                };
                commentSectionFunction.setComments((cmts) => [comment, ...cmts]);
                setComments((comments) => {
                    return [comment, ...comments];
                });
            }
        });
        socket.on("all_comments", (comments, postId) => {
            commentSectionFunction.setComments(comments);
            commentSectionFunction.setPostId(postId);
            commentSectionFunction.setShowComments(true);
        });
        return () => {
            socket.off("comment_added");
            socket.off("all_comments");
        };
    }, []);
    useEffect(() => {
        setTwoComments(comments.slice(0, 2));
    }, [comments]);

    return (
        <div className={styles.postContainer} ref={ref}>
            <Uname uname={props.uploader.name} />
            <p className={styles.description}>{props.description}</p>
            <img
                src={`data:image/png;base64,${props.media}`}
                alt="post img"
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
            <Comment.Comment_button setShowCommentSection={setShowCommentSection} />
            <div className={styles.twoComments}>
                {twoComments.map((comment) => {
                    return comment._id ? (
                        <Comment.Comment_body
                            comment={comment.comment}
                            commentor={comment.commentor.name}
                            commentor_id={comment.commentor.id}
                            key={comment._id}
                        />
                    ) : null;
                })}
            </div>
            {/* <CommentSection comments={props.comments} postId={props.postId} /> */}
        </div>
    );
});

function PostButton({ onclick }) {
    return <button onClick={onclick}>Post here</button>;
}

function PostingArea(props) {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    function handleSubmit(event) {
        event.preventDefault();
        socket.emit("post", props.uploader, description, image);
    }

    function handleChange(event, func) {
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
