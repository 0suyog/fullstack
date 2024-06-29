import { useEffect, useState } from "react";
import { FriendList } from "../src/Friendlist/friend_list.jsx";
import Dropdown from "../src/dropDown/dropdown.jsx";
import PostContainer from "../src/postContainer/post_container.jsx";
import SearchBox from "../src/searchBox/search_box.jsx";
import { useNavigate } from "react-router-dom";
import socket from "../src/socket.js";

export function NewsFeed() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [dates, setDates] = useState({
        first_post_date: undefined,
        last_post_date: undefined,
    });
    const [friends,setFriends]=useState([])
    useEffect(() => {
        if (localStorage.getItem("id") != null) {
            socket.emit("friend_list", localStorage.getItem("id"));
            socket.emit("initial_req",localStorage.getItem("id"));
        } else {
            navigate("/");
        }
        socket.on("initial_post", (posts) => {
            setPosts(posts);
            console.log(posts)
        });
        socket.on("post_added", (post) => {
            
            setPosts((posts) => {
                return [post, ...posts];
            });
        });
        socket.on("sending_more_posts", (data) => {
            console.log("new psts=",data)
            if (data.length) {
                setPosts((posts) => [...posts, ...data]);
            }
        });
        socket.on("friends", (friends) => {
            setFriends(friends);
           
        });
        socket.on("friend_added", (uid, name) => {
            let user = {
                _id: uid,
                name: name,
            };

            if (friends.find((friend) => friend._id == uid)) {
            }
            else {
                setFriends((friends) => [...friends, user]);
            }
        });

        return () => {
            socket.off("initial_post");
            socket.off("post_added");
            socket.off("sending_more_posts");
            socket.off("friends")
            socket.off("friend_added")
        };
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>

            <SearchBox />
            <Dropdown/>
            </div>
            <PostContainer posts={posts} />
            <FriendList friends={friends} />
        </div>
    );
}
