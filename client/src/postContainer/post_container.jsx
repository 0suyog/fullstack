import Post from "../Post/post.jsx";
import socket from "../socket.js";
import { useState, useEffect, useRef, forwardRef } from "react";
import styles from "./post_container.module.css";
import post from "../Post/post.jsx";
import { useCallback } from "react";

const PostContainer = forwardRef(({ uid }, ref) => {
    const [posts, setPosts] = useState([]);
    const [clicked, setClicked] = useState(0);
    const lastpost = useRef(null);
    // const lastPost              = useRef(null);
    const [dates, setDates] = useState({
        first_post_date: undefined,
        last_post_date: undefined,
    });
    const observer = useRef();

    useEffect(() => {
        socket.emit("initial_req", uid);
        console.log("post: ", posts);

        socket.on("initial_post", async (data) => {
            setPosts(data);
            data[0]
                ? setDates({
                      first_post_date: data[0].time,
                      last_post_date: data[data.length - 1].time,
                  })
                : {};
            console.log("data=", data);
        });
        socket.on("sending_more_posts", (data) => {
            if (data.length) {
                setPosts((posts) => [...posts, ...data]);
                console.log("data=", data);
                setDates((dates) => {
                    let new_first_date = data[0].time;
                    if (new Date(new_first_date) < new Date(dates.first_post_date)) {
                        new_first_date = dates.first_post_date;
                    }
                    return {
                        first_post_date: new_first_date,
                        last_post_date: data[data.length - 1].time,
                    };
                });
            }
        });
        return () => {
            socket.off("initial_post");
            socket.off("sending_more_posts");
        };
    }, []);
    useEffect(() => {
        socket.on("friend_added", () => {
            console.log("meow=", posts);
            if (posts.length == 0) {
                socket.emit("initial_req", localStorage.getItem("id"));
                alert("done");
            } else {
                if (lastpost.current){
                observer.current.disconnect();
                alert("added observer to last emelemt");
                observer.current.observe(lastpost.current);}
            }
        });
        return () => {
            socket.off("friend_added");
        };
    }, [dates]);
    useEffect(() => {
        const options = {
            threshold: 0,
        };

        observer.current = new IntersectionObserver((data) => {
            console.log(data);
            data.forEach((entry) => {
                if (entry.isIntersecting && dates.first_post_date && dates.last_post_date) {
                    socket.emit(
                        "more_posts",
                        localStorage.getItem("id"),
                        dates.first_post_date,
                        dates.last_post_date
                    );
                    observer.current.disconnect();
                }
            });
        }, options);
        if (lastpost.current) {
            console.log(lastpost.current);
            observer.current.observe(lastpost.current);
        }
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [dates]);

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
        <div ref={ref}>
            <Post.Post_btn onclick={handleClick} />
            {posting_area}
            {posts.map((post, index) => {
                const arrayLength = posts.length;
                // console.log(index);
                return index == arrayLength - 1 ? (
                    <Post.Post
                        ref={lastpost}
                        uploader={post.uploader}
                        description={post.description + post._id}
                        media={post.media}
                        comments={post.comments}
                        postId={post._id}
                        key={post._id}
                        reaction={post.reactions}
                        likes={post.likes}
                        dislikes={post.dislikes}
                        time={post.time}
                    />
                ) : (
                    <Post.Post
                        uploader={post.uploader}
                        description={post.description + post._id}
                        media={post.media}
                        comments={post.comments}
                        postId={post._id}
                        key={post._id}
                        reaction={post.reactions}
                        likes={post.likes}
                        dislikes={post.dislikes}
                        time={post.time}
                    />
                );
            })}
        </div>
    );
});

export default PostContainer;
