import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import styles from "./UnderBar.module.css"

function UnderBar({ left, leftLink, right, rightLink }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [usersId, setUsersId] = useState();

    const checkLoginStatus = async () => {
        const storedAccessToken = localStorage.getItem('login-token');

        if (storedAccessToken) { // 로그인 상태일 경우
            setIsLoggedIn(true);

            const storedUsersId = parseInt(localStorage.getItem('usersId'));
            if (storedUsersId) {
                setUsersId(storedUsersId);
            }
        } else { // 비로그인 상태일 경우
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <div className={styles.under}>

            {
                left == null? (
                    <Link to={"/chat/chatList"}>
                        <span className={styles.leftBtn}>채팅</span>
                    </Link>
                ) : (
                    <Link to={leftLink}>
                        <span className={styles.leftBtn}>{left}</span>
                    </Link>
                )
            }

            <Link to={"/"}>
                <span className={styles.homeBtn}>홈</span>
            </Link>

            {
                right == null? (
                    isLoggedIn ? (
                            <Link to={`/myPage/${usersId}`}>
                                <span className={styles.rightBtn}>마이페이지</span>
                            </Link>
                    ) : (
                            <Link to={`/users/login`}>
                                <span className={styles.rightBtn}>마이페이지</span>
                            </Link>
                    )
                ) : (
                    <Link to={rightLink}>
                        <span className={styles.rightBtn}>{right}</span>
                    </Link>
                )
            }
        </div>
    );
}

export default UnderBar;