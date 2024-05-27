import {Link, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import styles from './ChatRoom.module.css';
import axios from "axios"; // CSS 스타일 임포트



function ChatRoomByList({chatRoom}) {
    const navigate = useNavigate();
    console.log(chatRoom);
    console.log(typeof chatRoom);


    const trimName = (name) => {
        if (name.length > 13) {
            return name.substring(0, 12) + '..';
        } else {
            return name;
        }
    };
    const handleJoinChatClick = (chatroom) => {
        navigate(`/chat/${chatRoom.chatroomId}`,{state: {chatroom}});

    }


    return (
        <div className={styles.chatRoom} key={chatRoom.chatroomId}>
            {/*<Link to="/eatMate/MateDetail" state={{ mate, place }}>*/}
            <div className={styles.chatRoomName}>{trimName(chatRoom.eatPlace.placeName)}</div>
            <div className={styles.chatRoomDetail}>{chatRoom.memberCnt}/{chatRoom.maxNum} 명</div>
            <div className={styles.chatRoomContent}>
                <p><img className={styles.leftQuotes} src={"/images/chat/quotes.png"}/> {chatRoom.roomName}<img
                    className={styles.rightQuotes} src={"/images/chat/quotes.png"}/></p>
                <p>{chatRoom.eatDate}</p>
                <p>{chatRoom.eatTime}</p>
            </div>
            <button onClick={()=> handleJoinChatClick({chatRoom}) }>Join Chat</button>
        </div>
    );

}

export default ChatRoomByList