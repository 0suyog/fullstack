import PostContainer from "./postContainer/post_container.jsx";
import { createContext, useEffect, useRef, useState } from "react";
import socket from "./socket";
import Register from "./Register/register.jsx";
import Login from "./Login/login.jsx";
import Lists from "./Friendlist/friend_list.jsx";
import SearchBox from "./searchBox/search_box.jsx";
import Dropdown from "./dropDown/dropdown.jsx";
import Comment_section from "./commentSection/CommentSection.jsx";
export const commentsContext = createContext();
function App() {
    const [uid, setUid]                   = useState(false);
    const postContainerRef                = useRef();
    const [comments, setComments]         = useState();
    const [showComments, setShowComments] = useState(false);
      //   uid is used in dependency array cuz once the user is logged then only the post container is renderd
      // useEffect(() => {
      //     if (localStorage.getItem("id") != undefined) {
      //         setUid(localStorage.getItem.id);
      //     }

      // }, []);
    useEffect(() => {
        if (showComments) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow="scroll"
        }
    }, [showComments]);

    const friend_liststyle = {
        position: "sticky",
        align   : "right",
        display : "flex",
    };
    function login(user) {
        setUid(user._id);
        localStorage.setItem("id", user._id);
        localStorage.setItem("name", user.name);
    }

    return uid ? (
        <div style = {friend_liststyle}>
            <div>
                <SearchBox />
                <Dropdown />
            </div>
            <commentsContext.Provider
                value={{
                    setComments    : setComments,
                    setShowComments: setShowComments,
                    showComments   : showComments,
                }}>
                    {showComments ? (
                        <Comment_section comments = {comments.comments} postId = {comments.postId} />
                    ) : null}
                <PostContainer uid = {uid} ref = {postContainerRef} />
            </commentsContext.Provider>
            <Lists.friendlist uid = {uid} />
            <Lists.userlist   uid = {uid} />
            <button
                onClick={() => {
                    socket.emit("dummy_post", uid);
                }}
                style={{
                    height: "10vh",
                }}>
                Dummy post
            </button>
        </div>
    ) : (
        <>
            <Register func = {login} />
            <Login    func = {login} />
        </>
    );
}

export default App;
