import like_btn from "../assets/like_btn.png";
import styles from "./reaction.module.css";
import socket from "../socket.js";
import { useEffect, useState } from "react";
// have made so that if you like it will be stored in db but there is no system to unlike or dislike too this will be the work for tomorrow
function Like({ postId, reaction, amount, setReactionDetails, setNoOfLikes }) {
    const [state, setState] = useState(0);
    // const [reaction, setReactionDetails] = useState(reaction);
    // const [amount,setNoOfLikes]=useState(amount)
    useEffect(() => {
        if (reaction) {
            setState(reaction.reaction);
        } else {
            setState(0);
        }
        console.log(state)
    });
    const likeBtn = (
        <button
            className={styles.noReaction}
            onClick={() => {
                setState(1);
                setNoOfLikes(amount + 1);
                if (reaction) {
                    console.log(localStorage.getItem("id"), postId, null);
                    socket.emit(
                        "liked",
                        localStorage.getItem("id"),
                        postId,
                        reaction._id,
                        setReactionDetails
                    );
                } else {
                    socket.emit(
                        "liked",
                        localStorage.getItem("id"),
                        postId,
                        null,
                        setReactionDetails
                    );
                }
            }}>
            <img className="like_pic" src={like_btn} alt="Like button" />
            <span>{amount}</span>
        </button>
    );
    const pressedLikeBtn = (
        <button
            className={styles.like}
            onClick={() => {
                socket.emit("unreacted", localStorage.getItem("id"), postId, reaction._id);
                setReactionDetails(null);
                setState(0);
                setNoOfLikes(amount - 1);
                console.log(state);
            }}>
            <img src={like_btn} alt="Like button" />
            <span>{amount}</span>
        </button>
    );

    return state ? pressedLikeBtn : likeBtn;
}

export default Like;
