import PostContainer from "./postContainer/post_container.jsx";
import { useState } from "react";
import socket from "./socket";
import Register from "./Register/register.jsx";
import Login from "./Login/login.jsx";
import Lists from "./Friendlist/friend_list.jsx";
function App() {
  const [username, setUsesrname] = useState(false);
  const friend_liststyle         = {
    position: "sticky",
    align   : "right",
    display : "flex"

  };
  function login(username) {
    setUsesrname(username._id);
    localStorage.setItem("id", username._id)
    console.log(username._id)
  }

  return username ? (

      <div              style = {friend_liststyle}>
      <PostContainer    uid   = {username} />
      <Lists.friendlist uid   = {username} />
      <Lists.userlist   uid   = {username} />

      </div>

  ) : (
    <>
      <Register func = {login} />
      <Login    func = {login} />
    </>
  );
}

export default App;
