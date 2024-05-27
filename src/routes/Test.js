import styles from "./Main.module.css";
import { useState } from "react";
import axios from "axios";

function Test() {
    const [id, setId] = useState(0);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const fetchData = () => {
        axios.get('/test', {
            params: {
                id: id,
                title: title
            }
        }).then(response => {
            setMessage(response.data);
        }).catch(function () {
            console.log('실패함');
        });
    };

    return (
        <div>
            <h2>test 화면(react, controller 데이터 주고받기)</h2>
            <input onChange={(e) => {
                setId(e.target.value);
            }} />
            <input onChange={(e) => {
                setTitle(e.target.value);
            }} />
            <button onClick={fetchData}>전송</button>
            <h1>{message}</h1>
        </div>
    );
}

export default Test;
