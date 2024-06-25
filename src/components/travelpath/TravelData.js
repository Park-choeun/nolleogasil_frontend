import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./TravelData.module.css"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function TravelData({ travelpathId, destination, startDate, endDate, party, place, concept, food, onDelete}){

    const [deleted, setDeleted] = useState(false);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    const displayData = (dataArray) => {
            if (dataArray.length === 1) {
                return dataArray[0];
            } else if (dataArray.length === 2) {
                return dataArray.slice(0, 2).join(', ');
            } else {
                return dataArray.slice(0, 2).join(', ') + ' 등';
            }
        };

    //listbox 클릭시 /showDetail로 요청
    const showContent = (travelpathId) => {

        axios.post(`${apiUrl}/api/travelpath/showDetail`, travelpathId,{
           headers: {
               "Content-Type": "application/json",
           },
       })
        .then(response => {
            const redirectUrl = response.data;
            navigate(redirectUrl);

        })
        .catch(error => {
            window.alert("오류가 발생했습니다. 다시 시도해주세요.");
        });
    }


    //delete버튼을 통해 데이터베이스에서 삭제
    const deleteTravelPath = (event, travelpathId, destination) => {
        event.stopPropagation();
        if(window.confirm(`[${destination}] 여행정보를 삭제하시겠습니까?`)){
             axios.delete(`${apiUrl}/api/travelpath/delete/${travelpathId}`)
                .then(response => {
                    setDeleted(true);
                    onDelete(travelpathId);
                })
                .catch(error => {
                    window.alert("오류가 발생했습니다. 다시 시도해주세요.");
                });
             window.alert("삭제되었습니다.");
        }else{
             window.alert("취소되었습니다.");
        }

    }

    //deleted가 true일 때는 빈 요소를 반환해 TravelData 카드를 제거
    if (deleted) {
        return null;
    }

    return(
          <div>
            <div className={styles.travelListBox}>
                <div className={styles.file}>
                    <div className={styles.wrap}>
                        <div className={styles.index}>
                            <img className={styles.marker} src={`/images/travelPath/marker.png`} alt="마커 아이콘" />
                            <div className={styles.destination}>{destination}</div>
                        </div>
                        <div className={styles.folder}></div>
                    </div>
                </div>
            </div>
            <div className={styles.listBox}  onClick={() => showContent(travelpathId)}>
                <div className={styles.above}>
                    <div className={styles.dateArea}>
                     <img className={styles.calendar} src={`/images/travelPath/calendat_blue.png`} alt="달력 아이콘" />
                     <span className={styles.date}>{startDate} ~ {endDate}</span>
                    </div>
                    <div className={styles.buttonArea}>
                        <button className={styles.button} onClick={(event) => {deleteTravelPath(event, travelpathId, destination)}}><img className={styles.pic} src={`/images/common/trash.png`} alt="휴지통" /></button>
                    </div>
                </div>
                <div>
                    <span className={styles.conditionTile}>#{party}</span>
                    <span className={styles.conditionTile}>#{place}</span>
                </div>
                <div>
                    <span className={styles.conditionTile}>#{displayData(concept)}</span>
                    <span className={styles.conditionTile}>#{displayData(food)}</span>
                </div>
            </div>
        </div>
    );
}
export default TravelData;

TravelData.propTypes = {
        travelpathId: PropTypes.number.isRequired,
        destination: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        party: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string,
        ]),
        place: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string,
        ]),
        concept: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string,
        ]),
        food: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.string,
        ]),
};