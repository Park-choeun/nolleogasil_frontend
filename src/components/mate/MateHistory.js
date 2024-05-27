import {useState, useEffect} from "react";
import Card from "react-bootstrap/Card";
import Modal from 'react-bootstrap/Modal';
import styles from "./MateHistory.module.css";
import MateInfo from "./MateInfo";
import MateMember_History from "./mateMember/MateMember_History";
import axios from "axios";
import { formatEatDateTime } from "./Mate_Utils";

function MateHistory({ mate, place }) {
    const [loginUsersMemberInfo, setLoginUsersMemberInfo] = useState({
        isGiven: -1
    })
    const [mateMemberList, setMateMemberList] = useState([]);
    const [memberMateTempMap, setMemberMateTempMap] = useState({});
    const [timeOver, setTimeOver] = useState(false); //메이트 기간 마감여부 -> timeOver되면 true로 변경
    const [show, setShow] = useState(false);

    //로그인한 사용자 본인을 제외한 해당 메이트의 멤버목록 조회
    const getMateMemberList = () => {
        axios.get(`/mateMember/getMateMemberListWithoutMe?mateId=${mate.mateId}`)
            .then(response => {
                setMateMemberList(response.data);
            }).catch(error => {
            console.error("Error getMateMemberListWithoutMe>>> ", error);
        })
    }

    //로그인한 사용자의 온도 부여 여부 불러오기(isGiven) -> 0이면 이미 온도를 부여한 것(1번만 부여 가능)
    const getLoginUsersMemberInfo = () => {
        axios.get(`/mateMember/getMateMemberByUsersIdAndMateId?mateId=${mate.mateId}`)
            .then(response => {
                setLoginUsersMemberInfo(response.data);
            }).catch(error => {
            console.error("Error getMateMemberByUsersIdAndMateId>>> ", error);
        })
    }

    //메이트 기간이 지났는지 확인
    const checkingMateDateTime = () => {
        let now = new Date();
        const mateDate = formatEatDateTime(mate.eatDate, mate.eatTime);

        if (now > mateDate) {
            setTimeOver(true);
        }
    };

    useEffect(() => {
        getMateMemberList();
        getLoginUsersMemberInfo();
        checkingMateDateTime();
    }, [mate.mateId]);

    //모달 열고, 닫기
    const readMoreBtnClickHandler = () => setShow(true);
    const handleClose = () => setShow(false);

    //온도주기 버튼 클릭 시
    const handleSetMateTemp = (memberMateTempMap) => {
        const result = window.confirm("설정한 값으로 멤버들의 온도를 부여하시겠습니까?\n(값이 비어있다면 기본값으로 부여됩니다.)");
        if (result) {
            axios.post(`/mateMember/setMemberMateTemp?mateId=${mate.mateId}`, memberMateTempMap)
                .then(response => {
                    if (response.data === "successful") {
                        alert("성공적으로 온도를 부여했습니다.");
                        setShow(false);
                        getLoginUsersMemberInfo(); //isGiven다시 불러오기
                    } else {
                        alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                    }
                }).catch(error => {
                throw error;
            })
        }
    }

    //MateMember_History에서 변경되는 온도 값을 가져와 memberMateTempMap의 값 setting
    const updateMemberMateTempList = (memberId, newMateTemp) => {
        setMemberMateTempMap(prevMap => ({
            ...prevMap,
            [memberId]: newMateTemp
        }))
    }

    return (
        <div>
            <Card className={styles.container}>
                <MateInfo
                    mate={mate}
                    place={place}
                />

                {/*해당 mate의 날짜 및 시간이 지나면 온도주기 버튼 출력*/}
                {timeOver ? (
                    //사용자가 이미 온도를 부여한 상태라면, 온도 주기 완료버튼 출력
                    loginUsersMemberInfo.isGiven === 0 ? (
                        <div className={styles.btnBox}>
                            <button className={styles.completeBtn} disabled={true}>온도 주기 완료</button>
                        </div>
                    ) : (
                        <div className={styles.btnBox}>
                            <button className={styles.readMoreBtn} onClick={readMoreBtnClickHandler}>온도 주기</button>
                        </div>
                    )
                ) : ("")}
            </Card>

            <Modal show={show} onHide={handleClose} className={styles.modal}>
                <Modal.Header closeButton>
                    <Modal.Title className={styles.title}>"{place.placeName}"의 맛집메이트 멤버</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.memberInfo}>
                    <span className={styles.text}>함께 식사를 했던 맛집메이트 멤버에게 온도를 부여해주세요!</span>
                    {mateMemberList.map((member) =>
                        <MateMember_History
                            key={member.usersId}
                            memberId={member.matememberId}
                            memberUsersId={member.usersId}
                            updateMemberMateTempList={updateMemberMateTempList}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className={styles.setMateTempBtn} onClick={() => handleSetMateTemp(memberMateTempMap)}>온도 주기</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MateHistory;