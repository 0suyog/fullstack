import style from "./reaction.module.css";
import dislike_pic from "../assets/dislike_btn.png";
import socket from "../socket.js";
import { useEffect, useState } from "react";
function Dislike({ postId, reaction, amount, setReactionDetails, setNoOfDislikes }) {
    const [state, setState] = useState(0);
    // const [reaction, setReactionDetails] = useState(reaction);
    // const [amount, setNoOfDislikes] = useState(amount);
    useEffect(() => {
        if (reaction) {
            setState(reaction.reaction);
        } else {
            setState(0);
        }
    });
    const dislikeBtn = (
        <button
            className={style.noReaction}
            onClick={() => {
                if (reaction) {
                    socket.emit(
                        "disliked",
                        localStorage.getItem("id"),
                        postId,
                        reaction._id,
                        setReactionDetails
                    );
                } else {
                    socket.emit(
                        "disliked",
                        localStorage.getItem("id"),
                        postId,
                        null,
                        setReactionDetails
                    );
                }
                setState(-1);
                setNoOfDislikes(amount + 1);
            }}>
            <img src={dislike_pic} alt="dislikepic" />
            <span>{amount}</span>
        </button>
    );
    const pressedDislikeBtn = (
        <button
            className={style.dislike}
            onClick={() => {
                socket.emit("unreacted", localStorage.getItem("id"), postId, reaction._id);
                setReactionDetails(null);
                setState(0);
                setNoOfDislikes(amount - 1);
                console.log(state);
            }}>
            <img src={dislike_pic} alt="dislike_pic"></img>
            <span>{amount}</span>
        </button>
    );
    return state == -1 ? pressedDislikeBtn : dislikeBtn;
}

export default Dislike;
