import Post from "../Post/post.jsx";
import socket from "../socket.js";
import { useState, useEffect } from "react";
import styles from "./post_container.module.css";

function PostContainer({ uid }) {
    const [posts, setPosts] = useState([]);
    const [clicked, setClicked] = useState(0);
    useEffect(() => {
        socket.emit("initial_req", uid);
        console.log("post: ", uid);
    }, []);
    socket.on("initial_post", (data) => {
        // console.log("hellooo");
        setPosts(data);
        console.log("data=", data);
    });

    let posting_area = (
        <div className={styles.hiddenPostingArea}>
            <Post.Posting_area uploader={uid} />
        </div>
    );
    if (clicked)
        posting_area = (
            <div className={styles.hiddenPostingArea}>
                <Post.Posting_area uploader={uid} />
            </div>
        );
    else
        posting_area = (
            <div className={styles.PostingArea}>
                <Post.Posting_area uploader={uid} />
            </div>
        );

    function handleClick() {
        setClicked(!clicked);
    }

    return (
        <div>
            <Post.Post_btn onclick={handleClick} />
            {posting_area}
            {posts.map((post) => {
                console.log(post.description)
                return (
                    <Post.Post
                        uploader={post.uploader}
                        description={post.description}
                        media={post.media}
                        comments={post.comments}
                        postId={post._id}
                        key={post._id}
                        reaction={post.reactions}
                        likes={post.likes}
                        dislikes={post.dislikes}
                    />
                );
            })}
        </div>
    );
}

export default PostContainer;
