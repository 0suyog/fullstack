// import monke from "../assets/monke.jpg";
import Like from "../reactionBtn/like_btn.jsx";
import Dislike from "../reactionBtn/dislike_btn.jsx";
import Comment from "../Comment/Comment.jsx";
import Comment_section from "../commentSection/CommentSection.jsx";
import styles from "./post.module.css";
import Uname from "../usernameWithProfile/username_with_pofile.jsx";
import socket from "../socket.js";
import { useEffect, useState } from "react";
function Post({ uploader, description, media, comments, postId, reaction, likes, dislikes }) {
    console.log(reaction);
    const [reactionDetails, setReactionDetails] = useState(reaction);
    const[noOfLikes,setNoOfLikes]=useState(likes)
    const[noOfDisikes,setNoOfDislikes]=useState(dislikes)
    return (
        <div className={styles.postContainer}>
            <Uname uname={uploader.name} />
            <p className={styles.description}>{description}</p>
            <img src={`data:image/png;base64,${media}`} alt="post image" className={styles.media} />
            <hr />
            <Like
                postId={postId}
                reaction={reactionDetails}
                amount={noOfLikes}
                setReactionDetails={setReactionDetails}
                setNoOfLikes={setNoOfLikes}
            />
            <Dislike
                postId={postId}
                reaction={reactionDetails}
                amount={noOfDisikes}
                setReactionDetails={setReactionDetails}
                setNoOfDislikes={setNoOfDislikes}
            />
            <Comment.Comment_button />
            <Comment_section comments={comments} postId={postId} />
        </div>
    );
}

function PostButton({ onclick }) {
    return <button onClick={onclick}>Post here</button>;
}

function PostingArea({ uploader }) {
    console.log("uploader", uploader);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    function handleSubmit(event) {
        event.preventDefault();
        console.log(uploader, description, image);
        socket.emit("post", uploader, description, image);
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
