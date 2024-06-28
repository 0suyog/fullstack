import { useEffect, useState } from "react";
import socket from "../socket";

function Login(props) {
  const [username, setUsername] = useState("");
  
  function handleClick() {
    socket.emit("login", username, socket.id);
  }
  function handleChange(event) {
    setUsername(event.target.value);
  }
  useEffect(() => {
    socket.on("logged_in", (user) => {
      props.func(user)
  },[])
    socket.on("wrong_cred", () => {
      alert("wrong credentials")
      
    })
    return () => {
      socket.off("wrong_credentials", () => {
      })
      socket.off("logged_id", () => {
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
