import styles from "./LoadMore.module.css";
import socket from "../client/src/socket";
function LoadMore(props) {
    function handleClick() {
        socket.emit(
            "more_posts",
            localStorage.getItem("id"),
            props.dates.first_post_date,
            props.dates.last_post_date
        );
    }

    return <button className={styles.btn} onClick={handleClick}>Load More</button>;
}

export default LoadMore;
