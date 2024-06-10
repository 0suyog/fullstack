import like_btn from "../assets/like_btn.png";
import styles from "./reaction.module.css";
import socket from "../socket.js";
import { useEffect, useState } from "react";
// have made so that if you like it will be stored in db but there is no system to unlike or dislike too this will be the work for tomorrow
function Like(props) {
    const [state, setState] = useState(0);
    useEffect(() => {
        if (props.reaction) {
            setState(props.reaction);
        } else {
            setState(0);
        }
        // console.log(state);
    });
    const likeBtn = (
        <button
            className={styles.noReaction}
            onClick={() => {
                setState(1);
                props.setNoOfLikes(props.amount + 1);
                socket.emit("liked", localStorage.getItem("id"), props.postId, props.setReaction);
            }}>
            <img className="like_pic" src={like_btn} alt="Like button" />
            <span>{props.amount}</span>
        </button>
    );
    const pressedLikeBtn = (
        <button
            className={styles.like}
            onClick={() => {
                socket.emit("unreacted", localStorage.getItem("id"), props.postId,state);
                props.setReaction(0);
                setState(0);
                props.setNoOfLikes(props.amount - 1);
                console.log(props.amount);
            }}>
            <img src={like_btn} alt="Like button" />
            <span>{props.amount}</span>
        </button>
    );

    return state == 1 ? pressedLikeBtn : likeBtn;
}

export default Like;
