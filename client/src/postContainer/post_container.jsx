import Post from "../Post/post.jsx";
import socket from "../socket.js";
import { useState, useEffect, useRef, forwardRef } from "react";
import styles from "./post_container.module.css";
import post from "../Post/post.jsx";
import { useCallback } from "react";
import LoadMore from "../../../loadMore/loadMore.jsx";
import { useNavigate } from "react-router-dom";
const PostContainer = forwardRef(({ uid }, ref) => {
    const [posts, setPosts] = useState([]);
    const [clicked, setClicked] = useState(0);
    const lastpost = useRef(null);
    const [dates, setDates] = useState({
        first_post_date: undefined,
        last_post_date: undefined,
    });
    const observer = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("id") != "undefined") {
            socket.emit("initial_req", localStorage.getItem("id"));
        }
        else {
            navigate("/")
        }

        socket.on("initial_post", async (data) => {
            setPosts(data);
            console.log(data[0]);
            data[0]
                ? setDates({
                      first_post_date: data[0].time,
                      last_post_date: data[data.length - 1].time,
                  })
                : {};
        });
        socket.on("post_added", (post) => {
            console.log(post);
            setPosts((posts) => {
                return [post, ...posts];
            });
        });
        // ! this needs to be reworked once more because
        // ! this doesnt handle the case of the new_last_post being greater than first post
        // ! and this is a problem because if more than 10 new posts are added then only the top ten will be shown and
        // ! rest will be ignored because last post will be the previous last post
        socket.on("sending_more_posts", (data) => {
            if (data.length) {
                setPosts((posts) => [...posts, ...data]);
                setDates((dates) => {
                    let new_first_date = data[0].time;
                    let new_last_date = data[data.length - 1].time;
                    if (new Date(new_last_date) > new Date(dates.last_post_date)) {
                        new_last_date = dates.last_post_date;
                    }
                    if (new Date(new_first_date) < new Date(dates.first_post_date)) {
                        new_first_date = dates.first_post_date;
                    }
                    return {
                        first_post_date: new_first_date,
                        last_post_date: new_last_date,
                    };
                });
            }
        });
        return () => {
            socket.off("initial_post");
            socket.off("sending_more_posts");
            socket.off("post_added");
        };
    }, []);
    useEffect(() => {
        socket.on("friend_added", () => {
            if (posts.length == 0) {
                socket.emit("initial_req", localStorage.getItem("id"));
            } else {
                if (lastpost.current) {
                    observer.current.disconnect();
                    observer.current.observe(lastpost.current);
                }
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
        <div ref={ref} className={styles.container}>
            <Post.Post_btn onclick={handleClick} />
            {posting_area}
            {posts.map((post, index) => {
                const arrayLength = posts.length;
                return index == arrayLength - 1 ? (
                    <Post.Post
                        ref={lastpost}
                        uploader={post.uploader}
                        description={post.description + post._id + "  " + post.time}
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
                        description={post.description + post._id + "  " + post.time}
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
            <LoadMore dates={dates} />
        </div>
    );
});

export default PostContainer;
