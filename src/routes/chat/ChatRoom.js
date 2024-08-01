import React, {useEffect, useRef, useState} from "react";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import {useParams} from "react-router-dom";
import styles from "./ChatRoom.module.css"
import Top from "../../components/common/Top";
import UnderBar from "../../components/common/UnderBar";

const accessToken = localStorage.getItem('login-token');


axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
function ChatRoom () {

    const usersId = Number(localStorage.getItem("usersId"));
    const userNickname = localStorage.getItem("nickname");
    console.log(usersId);

    // 입력한 채팅값
    const [newMessage, setNewMessage] = useState("");
    const [enterMessages, setEnterMessages] = useState([]);
    const [leaveMessages, setLeaveMessages] = useState([]);
    //채팅 목록들
    const [messages,setMessages] = useState([]);
    const [fetchMessage, setFetchMessage] = useState([]);
    const [groupedMessages, setGroupedMessages] = useState({});
    const client = useRef({});
    let enter = useRef(false);
    const { chatroomId } = useParams();
    const [chatRoom,setChatRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // 로딩 상태
    const [renderMessages, setRenderMessages] = useState(true); // 렌더링 여부 상태 추가
    const [composition, setComposition] = useState(false); // 입력 완성 여부를 추적하기 위한 상태
    const [isOpen,setIsOpen] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url
    const reconnectTimeout = useRef(null);
    console.log(chatroomId);

    const connect = () => {
        // 소켓 연결
        const stompClient = Stomp.over(() =>
            new SockJS(`${apiUrl}/ws`)
        );

        client.current = stompClient;

        client.current.connect({}, onConnected, onError);

    };


    const onConnected = () => {
        console.log("구독중");
        console.log(enter.current);

        client.current.subscribe(`/sub/chat.exchange/room.` + chatroomId, function (message){
            // 구독중인 채널에서 메세지가 왔을 때
            if(message.body) {
                const receivedMessage = JSON.parse(message.body);
                console.log(receivedMessage);

                setMessages(prevMessages => [...prevMessages, receivedMessage]);

            }
        });

        client.current.heartbeat.outgoing = 20000; // 20초마다 클라이언트에서 서버로 ping
        client.current.heartbeat.incoming = 20000; // 20초마다 서버에서 클라이언트로 pong

        client.current.activate();
        console.log(client.current.connected);

        checkMateMember()
            .then((isFirstEnter) => {
                console.log(isFirstEnter);

                if(isFirstEnter) {
                    joinRoom();
                }
            })
            .catch((error) => {
                console.error('Error while checking mate member status:', error);
            });


    };

    const onError = (error) => {
        console.error("WebSocket connection error:", error);
        alert("WebSocket connection error. Please refresh the page to try again.");
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
        }
        reconnectTimeout.current = setTimeout(() => {
            connect();
        }, 5000); // 5초 후 재연결 시도
    };


    const checkMateMember = () => {
        console.log(enter.current);
        return axios.get(`${apiUrl}/api/mateMember/checkedMember`, {
            params: {
                chatroomId: chatroomId,
            }, 
            withCredentials: true
            })
            .then((response) => {
                console.log(response.data);
                if (response.data === "firstEnter") {
                    return true;
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.error('Error while fetching mate member status:', error);
                return false;
            });

    }

    const joinRoom = () => {
        console.log(enter.current);
        const sendDate = new Date().toISOString();
        const messageType = "enter";
        const message = userNickname + "님이 입장하셨습니다.";
        console.log(sendDate);

        const newMsg = {
            chatroomId: chatroomId,
            message: message,
            nickname: userNickname,
            usersId: usersId,
            messageType: messageType, // 가정: 메시지 타입 설정
            sendDate: sendDate,
        };


        //처음 입장 했을 때만
        client.current?.send(
            `/pub/chat.enter`, {
                headers: {'Authorization': `Bearer ${accessToken}`,}
            },
            JSON.stringify({
                chatroomId: chatroomId,
                usersId: usersId,
                nickname: userNickname,
                sendDate: sendDate,
                messageType: messageType,
                message: message,
            })

        );

        setMessages((prev) => [...prev, newMsg]);
    }


    const disconnected =()=>{

        if (client.current.connected) {
            client.current?.send(
                "/pub/chat.send.leave",
                {},
                usersId
            );
            setNewMessage("");
        }

        client.current.deactivate();

    };


    const send = ({chatroomId}) => {

        console.log("메세지보내는 중...");
        console.log(enter.current);
        console.log(client.current.connected);

        // 유저의 정보 가져오기.
        const offset = 1000 * 60 * 60 * 9
        const koreaNow = new Date((new Date()).getTime() + offset);
        const sendDate = koreaNow.toISOString().split('.')[0];

        const messageType = "talk";

        console.log(sendDate);

        const newMsg = {
            chatroomId: chatroomId,
            message: newMessage,
            nickname: userNickname,
            usersId: usersId,
            messageType: messageType, // 가정: 메시지 타입 설정
            sendDate: sendDate,
        };


        //클라이언트가 존재하고 웹소켓에 연결되어있으면..
        if (client.current && client.current.connected) {
            client.current?.send(
                "/pub/chat.send", {
                    headers: {'Authorization': `Bearer ${accessToken}`}
                },
                JSON.stringify({
                    chatroomId: chatroomId,
                    newMessage: newMessage,
                    usersId: usersId,
                    messageType: messageType,
                    nickname: userNickname,
                    sendDate: sendDate,
                })
            );
            setMessages(prevMessages => [...prevMessages, newMsg]);
            setNewMessage("");

        } else {
            connect();
        }
    }


    const fetchMessages  = (chatroomId) => {
        axios.get(`${apiUrl}/api/chat/messages/${chatroomId}`,{
                withCredentials: true
            })
            .then((response) => {
                console.log("메시지 목록", response.data);
                setMessages(response.data);
            })
            .catch((error) => console.error("Failed to fetch chat messages.", error));
    }

    const groupingMessageByDate = (messages) => {

        console.log("Grouping messages", messages);

        const messageGroups = {};
        messages.forEach((message) => {
            // ISO 8601 형식의 날짜에서 날짜 부분만 추출 ('2024-01-01')
            const date = message.sendDate.split('T')[0];
            // 해당 날짜에 대한 메시지 배열이 없으면 초기화
            if (!messageGroups[date]) {
                messageGroups[date] = [];
            }
            // 해당 날짜의 메시지 배열에 현재 메시지 추가
            messageGroups[date].push(message);
        });
        return messageGroups;


    }

    const getChatRoom = (chatroomId) => {
        axios.get(`${apiUrl}/api/chatRoom/${chatroomId}`,{
                withCredentials: true
            })
            .then(res => {
                setChatRoom(res.data);
                setIsLoading(false);  // 로딩 상태 비활성화
                console.log(res.data.usersId);

            })
            .catch(error => {
                console.error("Failed to fetch chat Room.", error)
                setIsLoading(false);  // 에러 발생시 로딩 상태 비활성화
            })

    }

    const handleComposition = (e) => {
        if (e.type === 'compositionend') {
            setComposition(false); // 입력 완성
        } else {
            setComposition(true); // 입력 중
        }
    };



    useEffect(() => {
        // 최초 렌더링 시 , 웹소켓에 연결
        // 우리는 사용자가 방에 입장하자마자 연결 시켜주어야 하기 때문에,,
        getChatRoom(chatroomId);
        connect();
        fetchMessages(chatroomId);
        console.log(messages);
        return () => disconnected();
    }, [chatroomId]);


    useEffect(() => {

        console.log(messages);

        // 메시지 목록을 그룹화
        const updatedGroupedMessages = groupingMessageByDate(messages);
        // 그룹화된 메시지 상태 업데이트
        setGroupedMessages(updatedGroupedMessages);

    }, [messages]); // 메시지 목록이 변경될 때마다 재실행




    const isCurrentUser = (sender)=>  {

        if(Number(sender) == usersId) {
            return true;
        }
        else return false;

    }

    const handleKeyDown = (e) => {

        if (e.key === 'Enter' && !composition) {
            e.preventDefault(); // 기본 이벤트를 취소
            send({chatroomId});
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const toggleSide = ()=> {
        setIsOpen(true);
    };


    if (isLoading) {
        return (<div className={styles.loadingBox}>
            <img className={styles.loadingImg} src="/images/common/loading.gif" alt="lodaing"/>
        </div>);
    }

    return (


        <div>
            <div>
                <Top text="채팅방"/>
            </div>
            <div className={styles.container}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerTitle}>
                        {chatRoom.eatPlace.placeName}
                    </div>
                    <img className={styles.menubarImg} src={'/images/chat/menubar.png'} onClick={toggleSide}/>
                </div>
                {/* 생략: 채팅방 제목 등의 렌더링 코드 */}
                <div style={{
                    maxHeight: '55vh',
                    overflowY: 'scroll',
                    display: 'flex',
                    flexDirection: 'column-reverse'
                }}>
                    {/* 날짜별 메시지 렌더링 */}
                    {Object.keys(groupedMessages).sort().reverse().map((date) => (
                        <div key={date}>
                            <div style={{
                                backgroundColor: '#abaaaa',
                                textAlign: 'center',
                                marginBottom: '10px',
                                fontSize: '1.2em',
                                borderRadius: '8px',
                                opacity: '0.7'
                            }}>
                                {date}
                            </div>
                            {groupedMessages[date].map((message,idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: message.messageType === 'enter' || message.messageType === 'leave' ? 'center' : isCurrentUser(message.usersId) ? 'flex-end' : 'flex-start',
                                    marginBottom: '10px'
                                }}>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        maxWidth: '90%',
                                        alignItems: isCurrentUser(message.usersId) ? 'flex-end' : 'flex-start',
                                    }}>
                                        {/* 메시지 내용 렌더링 */}
                                        {message.messageType !== 'enter' && message.messageType !== 'leave' && (
                                            <div style={{
                                                fontWeight: 'bold',
                                                marginBottom: '5px',
                                                color: isCurrentUser(message.usersId) ? '#007bff' : '#000'
                                            }}>{message.nickname}</div>)}
                                        <div key={message.chatId} style={{
                                            display: 'flex', // 이 컨테이너는 flex 박스로 설정
                                            alignItems: 'center', // 아이템들을 세로 중앙에 위치
                                            marginBottom: '10px'
                                        }}>
                                            {/* 시간 정보를 담는 컨테이너 */}
                                            {isCurrentUser(message.usersId) &&
                                                (message.messageType !== 'enter' && message.messageType !== 'leave') && (
                                                    <div style={{
                                                        color: '#aaa',
                                                        fontSize: '0.8em',
                                                        marginBottom: '-20px',
                                                        marginRight: '5px',
                                                        flexShrink: 0, // 이 요소의 크기가 flex 컨테이너 내에서 축소되지 않도록 설정
                                                    }}>
                                                        {new Date(message.sendDate).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                )}
                                            <div style={{
                                                backgroundColor: message.messageType === 'enter' || message.messageType === 'leave' ? '#abaaaa' : isCurrentUser(message.usersId) ? '#cce5ff' : '#f0f0f0',
                                                padding: '8px',
                                                borderRadius: '8px',
                                                position: 'relative', // 날짜 텍스트를 메시지 상자 내에 위치시키기 위해 relative 설정
                                            }}>
                                                {message.message}
                                                {/* 메시지 타입이 'enter'나 'leave'가 아니고, 사용자가 현재 사용자일 때 날짜 표시 */}
                                            </div>
                                            {!isCurrentUser(message.usersId) &&
                                                (message.messageType !== 'enter' && message.messageType !== 'leave') && (
                                                    <div style={{
                                                        color: '#aaa',
                                                        fontSize: '0.8em',
                                                        marginBottom: '-20px',
                                                        marginLeft: '5px',
                                                        flexShrink: 0, // 이 요소의 크기가 flex 컨테이너 내에서 축소되지 않도록 설정
                                                    }}>
                                                        {new Date(message.sendDate).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleComposition}
                        onCompositionUpdate={handleComposition}
                        onCompositionEnd={handleComposition}
                        placeholder="메시지 입력..."
                        style={{
                            flex: '1',
                            padding: '10px',
                            borderRadius: '5px 0 0 5px',
                            border: '1px solid #ccc',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0
                        }}
                    />
                    <button onClick={() => send({chatroomId})} style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        borderRadius: '0 5px 5px 0',
                        border: 'none',
                        cursor: 'pointer'
                    }}>전송
                    </button>
                </div>
            </div>
            <div>
                <UnderBar/>
            </div>
        </div>
    );
}


export default ChatRoom;




