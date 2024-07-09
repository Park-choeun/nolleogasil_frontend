import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import styles from "./MateMember_History.module.css";
import axios from "axios";
import {trimNickName} from "../Mate_Utils";

function MateMember_History({ memberId, memberUsersId, updateMemberMateTempList }) {
    const [member, setMember] = useState({
        nickname: "",
        gender: "",
        mateTemp: 0.0
    });
    const [newMateTemp, setNewMateTemp] = useState(0.0);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    //해당 멤버의 사용자 정보 불러오기
    useEffect(() => {
        axios.get(`${apiUrl}/api/user/getUsersInfo?usersId=${memberUsersId}`, {withCredentials: true})
            .then(response => {
                setMember(response.data);
                setNewMateTemp(response.data.mateTemp);
                updateMemberMateTempList(memberId, response.data.mateTemp);
            }).catch(error => {
                throw error;
        })
    }, []);

    const onChangeMateTemp = (input) => {
        setNewMateTemp(input);
        if (input === "") {
            updateMemberMateTempList(memberId, member.mateTemp);
        } else {
            updateMemberMateTempList(memberId, parseFloat(input));
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
                            <img src="/images/mate/temperature.png" alt="온도주기"
                                 className={styles.mateTempIcon} />
                            <input value={newMateTemp.toFixed(1)} className={styles.inputMateTemp}
                                   onChange={(e) => onChangeMateTemp(e.target.value)} />ºC
                        </td>
                        <td className={styles.mateTempBarBox}>
                            <input type="range" min={0} max={100} step={0.1} value={newMateTemp.toFixed(1)} className={styles.mateTempBar}
                                   onChange={(e) => onChangeMateTemp(e.target.value)} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </Card>
    );
}

export default MateMember_History;