import { useEffect, useState } from "react";
import UserwProfile from "../usernameWithProfile/username_with_pofile.jsx";
import socket from "../socket.js";
import styles from "./friend_list.module.css";
function UserList({ uid }) {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        socket.emit("sendall", uid);
        socket.on("users", (data) => {
            setUsers(data);
        });
    }, []);
    function addFriend(user) {
        socket.emit("add_friend", uid, user);
    }
    return (
        <div className={styles.friend_list}>
            <p>Click in any one of these to add them to friend list</p>
            {users.map((user) => {
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
        </div>
    );
}
function FriendList({ uid }) {
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        socket.emit("friend_list", uid);
        socket.on("friends", (friends) => {
            setFriends(friends);
        });
        socket.on("no_friends", () => {});

        socket.on("friend_added", (uid, name) => {
            let user = {
                _id: uid,
                name: name,
            };
            // alert("friend added");
            // socket.emit("initial_req", localStorage.getItem("id"));
            // alert(friends.find((friend) => friend._id == uid));
            if (friends.find((friend) => friend._id == uid)) {
            }
            else {
                setFriends((friends) => [...friends, user]);
            }
        });
        return () => {
            socket.off("friend added");
        };
    }, []);
    function viewProfile(friend) {
        console.log("we are gonna view profile of ", friend);
    }

    return (
        <div className={styles.friend_list}>
            {friends.length != 0 ? (
                <>
                    <p>this is friendlist</p>
                    {friends.map((friend) => {
                        return (
                            // ! need to add a id and func in userwprofile file too its mext
                            <span key={friend._id} className={styles.user}>
                                <UserwProfile uname={friend.name} id={friend._id} />
                                <button
                                    onClick={() => {
                                        viewProfile;
                                    }}>
                                    View profile
                                </button>
                            </span>
                        );
                    })}
                </>
            ) : (
                <p> {console.log("uname", uid)} You have no friends</p>
            )}
        </div>
    );
}
export default { userlist: UserList, friendlist: FriendList };
