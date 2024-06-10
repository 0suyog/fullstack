import { useEffect, useState } from "react";
import socket from "../socket";

function Register({func}) {
  const [username, setUsername] = useState("")

  function handleChange(event) {
    setUsername(event.target.value)
  }
  function handleClick() {
    socket.emit("register", username)
  }
  useEffect(() => {
    socket.on("registered", (id) => {
      func(id)
    })
  },[])

  return (
    <div>
      <p>Register here</p>
      <span>Username</span>
      <input  type    = "text" placeholder = "Username" onChange = {handleChange} />
      <button onClick = {handleClick}>Register</button>

    </div>
  );
}



export default Register;
