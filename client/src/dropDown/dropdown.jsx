import { useEffect, useState } from "react";
import UserwProfile from "../usernameWithProfile/username_with_pofile";
import styles from "./dropdown.module.css";
import socket from "../socket";
function Dropdown(props) {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        socket.on("searched_users", (users) => {
            setUserList(users);
        });
    }, []);
    useEffect(() => {

    }, [userList]);
    function addFriend(user) {
        socket.emit("add_friend", localStorage.getItem("id"), user);
    }
    return (
        <>
            {userList.map((user) => {
                return (
                    <span key={user._id} className={styles.user}>
                        <UserwProfile uname={user.name} id={user._id} />
                        <button
                            onClick={() => {
                                addFriend(user._id);
                            }}>
                            <b>+</b>
                        </button>
                    </span>
                );
            })}
        </>
    );
}

export default Dropdown;
