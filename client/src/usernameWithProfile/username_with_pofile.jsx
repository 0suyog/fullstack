import monke from "../assets/monke.jpg";
import styles from "./username_with_profile.module.css";
import socket from "../socket.js";
function UserwProfile({ uname, id }) {
  function handleClick() {
    console.log("viewing profile of ", id);
  }
  return (
    <div>
      <img
        src={`https://robohash.org/${uname}`}
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
