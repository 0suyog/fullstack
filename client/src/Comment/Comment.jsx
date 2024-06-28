import styles from "./Comment.module.css";
import Comment_pic from "../assets/comment.png";
import UserwProfile from "../usernameWithProfile/username_with_pofile";

function Comment_body({ comment, commentor, commentor_id }) {
    return (
        <div className={styles.commentContainer}>
            <UserwProfile uname={commentor} id={commentor_id} />
            <p className={styles.comment}>{comment}</p>
        </div>
    );
}
function Comment_button(props) {
    return (
        <button
            className={styles.comment_btn}
            onClick={() => {
                props.setShowCommentSection(true);
            }}>
            <img src={Comment_pic} alt="comment icon" />
        </button>
    );
}

export default { Comment_body: Comment_body, Comment_button: Comment_button };
