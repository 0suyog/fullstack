import { useParams } from "react-router-dom"
import PostContainer from "../postContainer/post_container"
import UserwProfile from "../usernameWithProfile/username_with_pofile"
function Profile(props)
{
    
    
    return <>
    <UserwProfile uname={uname} id={props.id}/>
    </>
}

export default Profile