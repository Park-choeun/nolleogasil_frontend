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
    const loginUsersId = Number(localStorage.getItem("usersId"));

    //해당 멤버의 사용자 정보 불러오기
    useEffect(() => {
        axios.get(`/api/user/getUsersInfo?usersId=${memberUsersId}`)
            .then(response => {
                setMember(response.data);
            }).catch(error => {
            throw error;
        })
    }, []);

    //해당 멤버 삭제
    const deleteMateMember = (memberId) => {
        const result = window.confirm(`${member.nickname}님을 정말로 내보내시겠습니까?`);
        if (result) {
            axios.post(`/mateMember/deleteMateMember?matememberId=${memberId}`)
                .then(response => {
                    if (response.data === "successful") {
                        alert("해당 멤버 삭제가 완료되었습니다.");
                        handleClose();
                    } else {
                        alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                    }
                }) .catch(error => {
                throw error;
            })
        }
    }

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
                        {masterUsersId === loginUsersId ? (
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