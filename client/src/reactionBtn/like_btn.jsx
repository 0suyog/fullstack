import like_btn from "../assets/like_btn.png";
import styles from "./reaction.module.css"
import { useState } from "react";

function Like() {
  const [state, setState] = useState(0);
  const likeBtn = (
    <button
      className={styles.noReaction}
      onClick={() => {
        setState(1);
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
