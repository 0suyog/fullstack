import PostContainer from "./postContainer/post_container.jsx";
import { createContext, useEffect, useRef, useState } from "react";
import socket from "./socket";
import Register from "./Register/register.jsx";
import Login from "./Login/login.jsx";
import Lists from "./Friendlist/friend_list.jsx";
import SearchBox from "./searchBox/search_box.jsx";
import Dropdown from "./dropDown/dropdown.jsx";
import CommentSection from "./commentSection/CommentSection.jsx";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile.jsx"
import { NewsFeed } from "../NewFeed/NewsFeed.jsx";
export const commentsContext = createContext();
function App() {
    const [uid, setUid] = useState(false);
    const postContainerRef = useRef();
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState(null);
    const [showComments, setShowComments] = useState(false);
    //   keep logged in
    //   useEffect(() => {
    //       if (localStorage.getItem("id")!="undefined") {
    //           login({_id:localStorage.id,name:localStorage.name})
    //       }
    //   }, []);

    useEffect(() => {
        if (showComments) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
    }, [showComments]);
    const navigate=useNavigate()

    useEffect(() => {
        console.log(comments);
        console.log(showComments);
    }, [comments]);

    const friend_liststyle = {
        position: "sticky",
        align: "right",
        display: "flex",
    };
    function login(user) {
        setUid(user._id);
        localStorage.setItem("id", user._id);
        localStorage.setItem("name", user.name);
        navigate("/feed")
    }

    return (
        <Routes>
            <Route path="/feed" element={
                <>
                {/* <div style={friend_liststyle}>
                <div>
                    <SearchBox />
                    <Dropdown />
                 </div> */}
                <commentsContext.Provider
                    value={{
                        comments: comments,
                        setComments: setComments,
                        setPostId: setPostId,
                        setShowComments: setShowComments,
                        showComments: showComments,
                    }}>
                    {showComments ? <CommentSection comments={comments} postId={postId} /> : null}
            <NewsFeed/>
                        </commentsContext.Provider>
            </>
                        
            //        <PostContainer uid={uid} ref={postContainerRef} />
            //     <Lists.friendlist uid={uid} />
            //     <Lists.userlist uid={uid} />
            //     <button
            //         onClick={() => {
            //             socket.emit("dummy_post", uid);
            //         }}
            //         style={{
            //             height: "10vh",
            //         }}>
            //         Dummy post
            //     </button>
                // </div>
            }></Route>
            <Route path="/" index={true} element={
                <>
              <Register func={login} />
              <Login func={login} />
          </>  
            }></Route>
            <Route path="/profile/:id" element={<Profile/>}></Route>
            {/* uid ? (
            
            ) : (
            
            ); */}
        </Routes>
    );
}

export default App;
