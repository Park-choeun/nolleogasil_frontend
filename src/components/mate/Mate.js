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

    //세션 체크(로그인 세션이 유효한지)
    const sessionCheck = async () => {
        //로그인 토큰이 있는지 먼저 확인
        const storedAccessToken = localStorage.getItem("login-token");

        //로그인 토큰이 있다면, 로그인 상태로 인지
        if (storedAccessToken) {
            try {
                //세션이 만료되어도 localStorage에 로그인 토큰이 남아있기 때문에 세션체크로 더블 체크
                const response = await axios.get(`${apiUrl}/api/session/check`);
                return response.status === 200;
            } catch (error) {
                console.log('Error checking session: ', error);
                return false;
            }
        } else {
            //비로그인 상태일 경우 (로그인 토큰이 없는 경우)
            return false;
        }
    };

    //로그인한 사용자의 신청 상태(isApply) 불러오기
    const getApplyStatus = async () => {
        const sessionValid = await sessionCheck();

        //로그인 세션이 존재할 때만 로그인한 사용자의 신청 상태 조회
        if (sessionValid) {
            axios.get(`${apiUrl}/api/apply/${mate.mateId}/status`)
                .then(response => {
                    if (response.status === 200) {
                        setIsApply(response.data);
                    }
                }).catch(error => {
                if (error.response) {
                    console.error(`Error: ${error.response.status} / ${error.response.statusText}`);
                } else {
                    console.error("Error checkApplyStatus>> ", error.message);
                }
            });
        }
    };

    useEffect( () => {
        getApplyStatus();
    }, []);

    //신청 버튼 클릭 시
    const handleInsertApply = async (mateId) => {
        const sessionValid = await sessionCheck();

        //로그인 세션이 존재할 경우
        if (sessionValid) {
            if (usersId === mate.usersId) {
                alert("본인이 게시한 맛집메이트 공고 글입니다.");
            } else {
                axios.post(`${apiUrl}/api/apply/${mateId}`)
                    .then(response => {
                        if (response.status === 201) {
                            setIsApply("대기");
                            alert("신청이 완료되었습니다.\n취소를 원한다면, 보낸 신청 목록으로 이동하세요.");
                        }
                    }).catch(error => {
                    if (error.response) {
                        console.error(`Error: ${error.response.status} / ${error.response.statusText}`);
                        alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                    } else {
                        console.error("Error handleInsertApply>> ", error.message);
                        alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
                    }
                });
            }
        } else {
            //비로그인 상태 or 로그인 세션이 없을 경우
            const result = window.confirm("로그인 후, 이용가능한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?");
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