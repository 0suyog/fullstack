import PostContainer from "./postContainer/post_container.jsx";
import { useEffect, useRef, useState } from "react";
import socket from "./socket";
import Register from "./Register/register.jsx";
import Login from "./Login/login.jsx";
import Lists from "./Friendlist/friend_list.jsx";
function App() {
    const [username, setUsesrname] = useState(false);
    const postContainerRef = useRef();
    // username is used in dependency array cuz once the user is logged then only the post container is renderd
    useEffect(() => {
        console.warn(postContainerRef?.current);
    }, [username]);
    const friend_liststyle = {
        position: "sticky",
        align   : "right",
        display : "flex",
    };
    function login(username) {
        setUsesrname(username._id);
        localStorage.setItem("id", username._id);
        console.log(username._id);
    }

    return username ? (
        <div style = {friend_liststyle}>
            <button
                onClick={() => {
                    socket.emit("dummy_post", username);
                }}>
                Dummy post
            </button>
            <PostContainer    uid = {username} ref = {postContainerRef} />
            <Lists.friendlist uid = {username} />
            <Lists.userlist   uid = {username} />
        </div>
    ) : (
        <>
            <Register func = {login} />
            <Login    func = {login} />
        </>
    );
}

export default App;
