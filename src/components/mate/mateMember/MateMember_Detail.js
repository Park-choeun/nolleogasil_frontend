import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import styles from "./MateMember_Detail.module.css";
import axios from "axios";
import {trimNickName} from "../Mate_Utils";

function MateMember_Detail({ masterUsersId, memberId, memberUsersId, handleClose }) {
    const [member, setMember] = useState({
        nickname: "",
        gender: "",
        mateTemp: 0.0
    });
    //session에 저장된 usersId
    const [sessionUsersId, setSessionUsersId] = useState(0);
    //localStorage에 저장된 usersId
    const loginUsersId = Number(localStorage.getItem("usersId"));
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    //세션 체크(로그인 세션이 유효한지)
    const sessionCheck = () => {
        //로그인 토큰이 있는지 먼저 확인
        const storedAccessToken = localStorage.getItem("login-token");

        //로그인 토큰이 있다면, 로그인 상태로 인지
        if (storedAccessToken) {
            try {
                //세션이 만료되어도 localStorage에 로그인 토큰이 남아있기 때문에 세션체크로 더블 체크
                const response = axios.get(`${apiUrl}/api/session/check`, { withCredentials: true });
                setSessionUsersId(loginUsersId);
            } catch (error) {
                console.log('Error checking session: ', error);
                setSessionUsersId(0);
            }
        } else {
            //비로그인 상태일 경우 (로그인 토큰이 없는 경우)
            setSessionUsersId(0);
        }
    };

    //해당 멤버의 사용자 정보 불러오기
    const getMemberUsersInfo = () => {
        axios.get(`${apiUrl}/api/user/${memberUsersId}/info`, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    setMember(response.data);
                }
            }).catch(error => {
                if (error.response) {
                    console.error(`Error: ${error.response.status} / ${error.response.statusText}`);
                } else {
                    console.error("Error getMemberUsersInfo>> ", error.message);
                }
        });
    };

    useEffect(() => {
        getMemberUsersInfo();
        sessionCheck();
    }, [sessionUsersId]);

    //해당 멤버 삭제
    const deleteMateMember = (memberId) => {
        const result = window.confirm(`${member.nickname}님을 정말로 내보내시겠습니까?`);
        if (result) {
            axios.delete(`${apiUrl}/api/mateMember/${memberId}`, { withCredentials: true })
                .then(response => {
                    if (response.status === 204) {
                        alert("해당 멤버 삭제가 완료되었습니다.");
                        handleClose();
                    }
                }).catch(error => {
                    if (error.response) {
                        console.error(`Error: ${error.response.status} / ${error.response.statusText}`);
                        alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                    } else {
                        console.error("Error deleteMateMember>> ", error.message);
                        alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
                    }
            });
        }
    };

    return (
        <Card className={styles.container}>
            <table className={styles.profile}>
                <tbody>
                <tr>
                    <td className={styles.nickname}>
                        <img src="/images/mate/profile2.png" alt="프로필" className={styles.profileIcon} />
                        &nbsp;
                        {trimNickName(member.nickname)}
                        <span className={styles.gender}>({member.gender})</span>
                    </td>
                    <td className={styles.mateTemp}>
                        {member.mateTemp.toFixed(1)}ºC
                    </td>
                    <td className={styles.deleteBtnBox}>
                        {/*게시자가 로그인한 사용자라면, 삭제버튼 출력 -> 본인 제외*/}
                        {masterUsersId === sessionUsersId ? (
                            masterUsersId !== memberUsersId ? (
                                <button className={styles.deleteBtn} onClick={() => deleteMateMember(memberId)}>삭제</button>
                            ) : (
                                ""
                            )
                        ) : (
                            ""
                        )}
                    </td>
                </tr>
                </tbody>
            </table>
        </Card>
    );
}

export default MateMember_Detail;