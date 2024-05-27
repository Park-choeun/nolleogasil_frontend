import { useState, useEffect } from "react";
import MateHistory from "../../components/mate/MateHistory";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "./MateHistoryList.module.css";
import {Link} from "react-router-dom";

function MateHistoryList() {
    const [mateHistoryList, setMateHistoryList] = useState([]);
    const [myMateList, setMyMateList] = useState([]);
    const [selected, setSelected] = useState("전체보기");

    //내가 멤버로 참여된 mate 공고 글 조회
    const getMateHistory = () => {
        axios.get("/mateMember/getMateHistory")
            .then(response => {
                setMateHistoryList(response.data);
            }).catch(error => {
            console.error("Error getMateHistory>>> ", error);
        });
    }

    //내가 개설한 mate 공고 글 조회
    const getMyMateList = () => {
        axios.get("/mate/getMateListByUsersId")
            .then(response => {
                setMyMateList(response.data);
                // setMateHistoryList(response.data);
            }).catch(error => {
            console.error("Error getMateListByUsersId>>> ", error);
        });
    }

    useEffect(() => {
        if (selected === "전체보기") {
            getMateHistory();
        } else { //내가 개설한 공고
            getMyMateList();
        }
    }, [selected]);

    //드롭다운 선택 시
    const handleDropdownSelect = (key) => {
        switch (key) {
            case "1":
                setSelected("전체보기");
                break;
            case "2":
                setSelected("내가 개설한 공고");
                break;
        }
    }

    return (
        <div>
            <div className={styles.container}>
                <Dropdown onSelect={handleDropdownSelect}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic"
                                     style={{ fontSize: '14px', padding: '5px 10px', border: '3px solid #ADCDFD', backgroundColor: 'white', color: 'black' }}>
                        {selected}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ fontSize: '14px'}}>
                        <Dropdown.Item eventKey="1">전체보기</Dropdown.Item>
                        <Dropdown.Item eventKey="2">내가 개설한 공고</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/*{mateHistoryList.length === 0 ? (*/}
            {/*    <div className={styles.alertBox}>*/}
            {/*        <img src="/images/common/alert.png" alt="알림" className={styles.alertImg} /><p/>*/}
            {/*        <span className={styles.alertMessage}>맛집메이트 이력이 없습니다.<br/>맛집메이트에 참여해보세요!</span>*/}
            {/*        <p/>*/}
            {/*        <Link to="/eatMate">*/}
            {/*            <button className={styles.goMateBtn}>맛집메이트 둘러보기</button>*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*) : (*/}
            {/*    selected === "전체보기" ? (*/}
            {/*        mateHistoryList.map((mateHistory) =>*/}
            {/*            <MateHistory*/}
            {/*                key={mateHistory.matememberId}*/}
            {/*                mate={mateHistory.mate}*/}
            {/*                place={mateHistory.mate.place}*/}
            {/*            />*/}
            {/*        )*/}
            {/*    ) : (*/}
            {/*        //내가 개설한 공고*/}
            {/*        mateHistoryList.map((mate) =>*/}
            {/*            <MateHistory*/}
            {/*                key={mate.mateId}*/}
            {/*                mate={mate}*/}
            {/*                place={mate.place}*/}
            {/*            />*/}
            {/*        )*/}
            {/*    )*/}
            {/*)}*/}

            {selected === "전체보기" ? (
                mateHistoryList.length === 0 ? (
                    <div className={styles.alertBox}>
                        <img src="/images/common/alert.png" alt="알림" className={styles.alertImg} /><p/>
                        <span className={styles.alertMessage}>맛집메이트 이력이 없습니다.<br/>맛집메이트에 참여해보세요!</span>
                        <p/>
                        <Link to="/eatMate">
                            <button className={styles.goMateBtn}>맛집메이트 둘러보기</button>
                        </Link>
                    </div>
                ) : (
                    mateHistoryList.map((mateHistory) =>
                        <MateHistory
                            key={mateHistory.matememberId}
                            mate={mateHistory.mate}
                            place={mateHistory.mate.place}
                        />
                    )
                )
            ) : (
                //내가 개설한 공고
                myMateList.length === 0 ? (
                    <div className={styles.alertBox}>
                        <img src="/images/common/alert.png" alt="알림" className={styles.alertImg} /><p/>
                        <span className={styles.alertMessage}>개설한 맛집메이트가 없습니다.<br/>맛집메이트를 개설해보세요!</span>
                    </div>
                ) : (
                    myMateList.map((mate) =>
                        <MateHistory
                            key={mate.mateId}
                            mate={mate}
                            place={mate.place}
                        />
                    )
                )
            )}
        </div>
    );
}

export default MateHistoryList;