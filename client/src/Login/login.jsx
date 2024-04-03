import { useEffect, useState } from "react";
import socket from "../socket";

function Login(props) {
  const [username, setUsername] = useState("");
  function handleClick(event) {
    props.func(true);
  }
  
  function handleClick() {
    socket.emit("login", username);
    // console.log("meowww");
  }
  function handleChange(event) {
    setUsername(event.target.value);
  }
  useEffect(() => {
    socket.on("logged_in", (id) => [
      props.func(id)
    ])
    socket.on("wrong_cred", () => {
      alert("wrong credentials")
      
    })
    return () => {
      socket.off("wrong_credentials", () => {
        console.log("unmounted")
      })
      socket.off("logged_id", () => {
        console.log("unmounted_")
      })
    }
  }
    , [])


  return (
    <div>
      <p>Login Here:</p>
      <span>username</span>
      <input type="text" onChange={handleChange} />
      <button onClick={handleClick}>Login</button>
    </div>
  );
}

export default Login;
