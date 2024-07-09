import { useState } from "react";
import { Link , useNavigate} from "react-router-dom";
import Card from "react-bootstrap/Card";
import styles from "./Wish.module.css";
import axios from "axios";
import {changeCategory} from "../mate/Mate_Utils";

function Wish({ wishId, place, onDelete }) {
    const [deleted, setDeleted] = useState(false);
    const category = changeCategory(place.placeCat);
    let navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    //메이트 버튼 클릭 시
    const handleClickMate = (place) => {
        // 필요한 place 데이터를 mateModal 경로로 전달
        navigate(`/eatMate/mateForm?category=${category}`, { state: {place}});
    };

    //위시에서 제거
    const handleDeleteWish = (wishId) => {
        axios.post(`${apiUrl}/api/wish/deleteWish?wishId=${wishId}`, { placeId: place.placeId }, {withCredentials: true})
            .then(response => {
                if (response.data === "failed") {
                    alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                } else {
                    setDeleted(true);
                    onDelete(wishId);
                }
            }).catch(error => {
                console.error("Error deleteWish>>> ", error);
            });
    };

    //deleted가 true일 때는 빈 요소를 반환해 Wish 카드를 제거
    if (deleted) {
        return null;
    }

    //장소 이름 자르기
    const trimName = (name) => {
        if (name.length > 7) {
            return name.substring(0, 6) + '..';
        } else {
            return name;
        }
    };

    return (
        <Card className={styles.container}>
            <Link to={place.placeUrl}>
                <table className={styles.infoTable}>
                    <tbody>
                    <tr>
                        <td className={styles.cardImg} colSpan="2">
                            {place.placeCat === 1 && <img src="/images/main/restaurant.png" alt="식당" className={styles.placeImg} />}
                            {place.placeCat === 2 && <img src="/images/main/cafe.png" alt="카페" className={styles.placeImg} />}
                            {place.placeCat === 3 && <img src="/images/main/lodging.png" alt="숙소" className={styles.placeImg} />}
                            {place.placeCat === 4 && <img src="/images/main/attraction.png" alt="관광지" className={styles.placeImg} />}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <span className={styles.name}>{trimName(place.placeName)}&nbsp;</span>
                            <span className={styles.category}>{category}</span>
                        </td>
                    </tr>
                    <tr className={styles.placeInfo}>
                        <td>
                            <img src="/images/map/address.png" alt="주소" className={styles.infoIcon} />
                        </td>
                        <td>
                            {/*도로명 주소가 존재한다면, 도로명 주소 출력 / 아니면 기존 주소 출력*/}
                            {place.placeRoadAddress ? place.placeRoadAddress : place.placeAddress}
                        </td>
                    </tr>
                    {place.placePhone ? (
                        <tr className={styles.placeInfo}>
                            <td>
                                <img src="/images/map/phone.png" alt="전화번호" className={styles.infoIcon} />
                            </td>
                            <td>{place.placePhone}</td>
                        </tr>
                    ) : (
                        ""
                    )}
                    </tbody>
                </table>
            </Link>
            <div className={styles.btnBox}>
                {place.placeCat === 1 || place.placeCat === 2 ? (
                    <img src="/images/map/createMate.png" alt="메이트글 작성" className={styles.mateBtn} onClick={()=>handleClickMate(place)}/>
                ) : ("")}
                <img src="/images/map/deleteWish.png" alt="찜 해제" className={styles.wishBtn} onClick={() => handleDeleteWish(wishId)}/>
            </div>
        </Card>
    );
}

export default Wish;