import { useEffect, useState } from "react";
import UserwProfile from "../usernameWithProfile/username_with_pofile.jsx";
import socket from "../socket.js";
import styles from "./friend_list.module.css";
import { useNavigate } from "react-router-dom";
export function UserList({ uid }) {
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
export function FriendList(props) {
    const navigate=useNavigate()
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        // if (localStorage.getItem("id") != null)
        // { socket.emit("friend_list", localStorage.getItem("id")); }
        // else {
        //     navigate("/")
        // }
        // socket.on("friends", (friends) => {
        //     setFriends(friends);
        // });
        // socket.on("no_friends", () => {});


        socket.on("friend_added", (uid, name) => {
            let user = {
                _id: uid,
                name: name,
            };

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
    useEffect(() => {
        let noDuplicates = []
        for (let i of props.friends) {
            if (!(friends.some(friend => friend._id == i._id))) {
                noDuplicates.push(i)
            }
        }
        setFriends([...friends, ...noDuplicates])
        console.log(friends)
    },[props.friends])
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
                <p>  You have no friends</p>
            )}
        </div>
    );
}
export default { userlist: UserList, friendlist: FriendList };
