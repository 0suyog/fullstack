import Post from "../Post/post.jsx";
import socket from "../socket.js";
import { useState, useEffect, useRef, forwardRef } from "react";
import styles from "./post_container.module.css";
import post from "../Post/post.jsx";
import { useCallback } from "react";
import LoadMore from "../../../loadMore/loadMore.jsx";
import { useNavigate } from "react-router-dom";
const PostContainer = forwardRef((props, ref) => {
    const [receivedPosts, setReceivedPosts] = [props.posts];
    const [posts, setPosts] = useState([]);
    const [clicked, setClicked] = useState(0);
    const lastpost = useRef(null);
    const [dates, setDates] = useState({
        first_post_date: undefined,
        last_post_date: undefined,
    });
    const observer = useRef();
    // const navigate = useNavigate();

    // * New code starts here
    useEffect(() => {
        let nonDuplicatePosts = [];
        let exists = false;
        console.log(posts);
        for (let i of receivedPosts) {
            let exists = posts.some((post) => {
                return post._id == i._id;
            });
            if (!exists) {
                nonDuplicatePosts.push(i);
            }
        }

        setPosts((posts) => [...posts, ...nonDuplicatePosts]);
        nonDuplicatePosts = [];
        if (dates["first_post_date"] == undefined) {
            if (posts.length && props.posts.length) {
                setDates({
                    first_post_date: props.posts[0].time,
                    last_post_date: props.posts[props.posts.length - 1].time,
                });
            }
        } else {
            setDates((dates) => {
                let new_first_date = props.posts[0].time;
                let new_last_date = props.posts[props.posts.length - 1].time;
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
        return () => {};
    }, [receivedPosts]);
    useEffect(() => {
        if (receivedPosts != props.posts) {
            setReceivedPosts(props.posts);
        }
    }, [props.posts]);

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
                    alert(JSON.stringify(dates));
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
            <Post.Posting_area uploader={localStorage.getItem("id")} />
        </div>
    );
    if (clicked)
        posting_area = (
            <div className={styles.hiddenPostingArea}>
                <Post.Posting_area uploader={localStorage.getItem("id")} />
            </div>
        );
    else
        posting_area = (
            <div className={styles.PostingArea}>
                <Post.Posting_area uploader={localStorage.getItem("id")} />
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
