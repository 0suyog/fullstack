import styles from "./reaction.module.css";
import dislike_pic from "../assets/dislike_btn.png";
import socket from "../socket.js";
import { useEffect, useState } from "react";
function Dislike(props) {
    const [state, setState] = useState(0);
      // const [reaction, setReactionDetails] = useState(reaction);
      // const [amount, setNoOfDislikes] = useState(amount);
    useEffect(() => {
        if (props.reaction) {
            setState(props.reaction);
        } else {
            setState(0);
        }
    });
    const dislikeBtn = (
        <button
            className = {styles.noReaction}
            onClick   = {() => {
                setState(-1);
                socket.emit(
                    "disliked",
                    localStorage.getItem("id"),
                    props.postId,
                    props.setReaction
                );
                props.setNoOfDislikes(props.amount + 1);
            }}>
            <img src = {dislike_pic} alt = "dislikepic" />
            <span>{props.amount}</span>
        </button>
    );
    const pressedDislikeBtn = (
        <button
            className = {styles.dislike}
            onClick   = {() => {
                socket.emit("unreacted", localStorage.getItem("id"), props.postId, state);
                props.setReaction(0);
                setState(0);
                props.setNoOfDislikes(props.amount - 1);
            }}>
            <img src = {dislike_pic} alt = "dislike_pic"></img>
            <span>{props.amount}</span>
        </button>
    );
    return state == -1 ? pressedDislikeBtn : dislikeBtn;
}

export default Dislike;
