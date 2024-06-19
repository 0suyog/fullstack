import { useEffect, useRef } from "react";
import search from "../assets/search.png"
import styles from "./search_box.module.css"
import socket from "../socket";
function SearchBox() {

    const inputRef=useRef()
    const formRef=useRef()

    useEffect(() => {
        formRef.current.addEventListener("submit", (event) => {
            event.preventDefault()
            if (inputRef.current.value != "") {
                socket.emit("search_user",inputRef.current.value)
            }
        })
    }, [])
    function handleChange(node) {
        socket.emit("search_user",inputRef.current.value)
    }
    

    return (
        <>
            <div className={styles.container}>
                <form ref={formRef}>
                    <input type="text" ref={inputRef} onChange={handleChange}/>
                    <button type="submit" className={styles.submitBtn}><img src={search} alt="search icon" className={styles.image} /></button>
                </form>
            </div>
        </>
    );
}

export default SearchBox;
