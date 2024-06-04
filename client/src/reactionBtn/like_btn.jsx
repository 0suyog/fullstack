import like_btn from "../assets/like_btn.png";
import styles from "./reaction.module.css"
import socket from "../socket.js";
import { useEffect, useState } from "react";
// have made so that if you like it will be stored in db but there is no system to onlike or dislike too this will be the work for tomorrow
function Like({postId,reaction}) {
  const [state, setState] = useState(0);
  useEffect(() => {
    if (reaction) {
      setState(reaction)
    }
  })
  const likeBtn = (
    <button
      className={styles.noReaction}
      onClick={() => {
        setState(1);
        console.log(localStorage.getItem("id"),postId,null)
        socket.emit("liked",localStorage.getItem("id"),postId,null)
      }}>
      <img className="like_pic" src={like_btn} alt="Like button" />
    </button>
  );
  const pressedLikeBtn = (
    <button  className={styles.like}
      onClick={() => {
        setState(0);
      }}>
      <img src={like_btn} alt="Like button" />
    </button>
  );

  return state ? pressedLikeBtn : likeBtn;
}

export default Like;
