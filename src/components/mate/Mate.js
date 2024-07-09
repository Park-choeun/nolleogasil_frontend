import {useEffect, useState} from "react";
import styles from "./Mate.module.css";
import Card from "react-bootstrap/Card";
import axios from "axios";
import MateInfo from "./MateInfo";
import {useNavigate} from "react-router-dom";

function Mate({ mate, place }) {
    const [isApply, setIsApply] = useState("신청");
    const [memberCount, setMemberCount] = useState(0);
    const usersId = Number(localStorage.getItem("usersId"));
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    //해당 사용자의 신청상태 불러오기
    const checkApplyStatus = () => {
        axios.get(`${apiUrl}/api/apply/checkingApplyStatus?mateId=${mate.mateId}`, {withCredentials: true})
            .then(response => {
                if (!(response.data === "failed")) {
                    setIsApply(response.data);
                }
            }).catch(error => {
            console.error("Error checkingApplyStatus>>> ", error.stack);
        });
    };

    useEffect(() => {
        //로그인한 상태에서만 기존의 신청 상태 출력
        if (usersId) {
            checkApplyStatus();
        }
    }, []);

    //신청 버튼 클릭 시
    const handleInsertApply = (mateId) => {
        if (usersId) {
            if (usersId === mate.usersId) {
                alert("본인이 게시한 맛집메이트 공고 글입니다.");
            } else {
                axios.post(`${apiUrl}/api/apply/insertApply?mateId=${mateId}`, {withCredentials: true})
                    .then(response => {
                        if (response.data === "failed") {
                            alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                        } else {
                            setIsApply("대기");
                            alert("신청이 완료되었습니다.\n취소를 원한다면, 보낸 신청 목록으로 이동하세요.");
                        }
                    }).catch(error => {
                    console.error("Error insertApply>>> ", error.stack);
                    alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                });
            }
        } else {
            const result = window.confirm("로그인 후, 사용가능한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?");
            if (result) {
                navigate("/users/login");
            }
        }
    };

    //MateInfo에서 현재 멤버 수 받아오기
    const setMemberCountValue = (count) => {
        setMemberCount(count);
    }

    return (
        <Card className={styles.container}>
            <MateInfo
                mate={mate}
                place={place}
                setMemberCountValue={setMemberCountValue}
            />

            <div className={styles.btnBox}>
                {isApply === "신청" ? (
                    //인원 수가 마감됐다면, 마감으로 출력
                    mate.count === memberCount ? (
                        <button className={styles.waitBtn} disabled={true}>마감</button>
                    ) : (
                        <button className={styles.applyBtn} onClick={() => handleInsertApply(mate.mateId)}>신청</button>
                    )
                ) : (
                    //수락, 대기, 거절 中 1개 출력
                    <button className={styles.waitBtn} disabled={true}>{isApply}</button>
                )}
            </div>
        </Card>
    );
}

export default Mate;