import { useState, useEffect } from "react";
import Top from "../../../components/common/Top";
import UnderBar from "../../../components/common/UnderBar";
import styles from "./ApplyList.module.css";
import axios from "axios";
import Apply from "../../../components/mate/apply/Apply";

function SendApply() {
    const [sendApplyList, setSendApplyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    //삭제버튼 클릭 시, 해당 apply 삭제 후, applyList에서도 제거
    const onDelete = (applyId) => {
        setSendApplyList(prevApplyList => prevApplyList.filter(apply => apply.applyId !== applyId));
    }

    //보낸 신청 목록 조회
    useEffect(() => {
        axios.get(`${apiUrl}/api/apply/getSendApply`, { withCredentials: true })
            .then(response => {
                setSendApplyList(response.data);
                setLoading(false);
            }).catch(error => {
            throw error;
        });
    }, []);

    return (
        <div>
            <div className={styles.top}>
                <Top text="보낸 메이트신청" />
            </div>

            <div className={styles.subBody}>
                {loading ? (
                    <div className={styles.loadingBox}>
                        <img className={styles.loadingImg} src="/images/common/loading.gif" alt="lodaing"/>
                    </div>
                ) : (
                    sendApplyList.length === 0 ? (
                        <div className={styles.alertBox}>
                            <img src="/images/common/alert.png" alt="알림" className={styles.alertImg} /><p/>
                            <span className={styles.alertMessage}>보낸 신청이 없습니다.<br/>맞집메이트에 신청해보세요!</span>
                        </div>
                    ) : (
                        sendApplyList.map((apply) =>
                            <Apply
                                key={apply.applyId}
                                apply={apply}
                                applyTmp="send"
                                onDelete={onDelete}
                            />
                        )
                    )
                )}
            </div>

            <div>
                <UnderBar
                    left="전체보기"
                    leftLink="/eatMate"
                    right="받은 신청"
                    rightLink="/eatMate/receiveApply"
                />
            </div>
        </div>
    );
}

export default SendApply;