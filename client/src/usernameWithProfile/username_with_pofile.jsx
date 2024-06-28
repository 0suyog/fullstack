
import styles from "./username_with_profile.module.css";
import socket from "../socket.js";
import { useNavigate } from "react-router-dom";
function UserwProfile({ uname, id }) {
  const navigate=useNavigate()
  function handleClick() {
    socket.emit("profile", id);
    navigate(`/profile/${uname}`)
  }
  return (
    <div>
      <img
        src={`https://robohash.org/set_set1/bgset_bg1/${uname}`}
        alt="Profile Picture"
        className={styles.profile}
      />
      <span className={styles.username} onClick={handleClick}>
        <b>{uname}</b>
      </span>
    </div>
  );
}

export default UserwProfile;
