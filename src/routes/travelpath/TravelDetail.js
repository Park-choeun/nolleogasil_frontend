import {useState, useEffect} from "react";
import React from 'react';
import {useNavigate} from "react-router-dom";
import Top from "../../components/common/Top";
import UnderBar from "../../components/common/UnderBar";
import Conditions from "../../components/travelpath/Conditions";
import styles from "./TravelDetail.module.css";
import axios from 'axios';

function TravelDetail(){
    const [travelPath, setTravelPath] = useState(null);  //하나의 travelPath
    const [recommendationId, setRecommendationId] = useState(null); //DB에서 가져온 recommendationId를 담을 변수
    const [dates, setDates] = useState(null);           //DB에서 가져온 dates를 담을 변수
    const [infos, setInfos] = useState(null);           //DB에서 가져온 infos를 담을 변수
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    //선택된 travelPath 정보 가져오는 함수
    useEffect(() => {
        const travelDetailDto = JSON.parse(localStorage.getItem('travelDetailDto'));
        const id = localStorage.getItem('recommendationId');
        setTravelPath(travelDetailDto);
        setRecommendationId(id);
        setDates(travelDetailDto.resultDto.dates);
        setInfos(travelDetailDto.resultDto.infos);
    }, []);

    //내용 수정 시 반영하는 함수
    const contentChanged = (e, index) => {
        const newInfos = [...infos];
        newInfos[index] = e.currentTarget.innerHTML;
        setInfos(newInfos);
    }

    //저장하기 Button Handler
    const save = () => {
            if(infos !== null){
                const data = {
                    dates: dates,
                    infos: infos
                }
                axios.put(`${apiUrl}/api/travelpath/${recommendationId}`, data, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then(response => {
                    navigate(-1);
                })
                .catch(error => {
                    window.alert("오류가 발생했습니다. 다시 시도해주세요.");
                });
            }
        }
    return(
        <div>
            <div>
                <Top text="추천 여행 일정표" />
            </div>
            <div className={styles.commentArea}>
                <span className={styles.comment}> 로더가 추천해준 여행일정을 확인해보세요! </span>
                <button className={styles.saveBtn} onClick={save}>저장</button>
            </div>
             {travelPath == null ? (
                <div className={styles.conditionArea}>
                    <div className={styles.loadingBox}>
                        <img className={styles.loadingImg} src={`/images/common/loading.gif`} alt="loading" />
                    </div>
                </div>
             ) : (
                <div>
                    <div className={styles.conditionArea}>
                            <div><Conditions text={`#${travelPath.startDate} - ${travelPath.endDate}`}/></div>
                            <Conditions text={`#${travelPath.destination}`}/>
                            <Conditions text={`#${travelPath.partyItems}`}/>
                            <Conditions text={`#${travelPath.placeItems}`}/>
                            <Conditions text={`#${travelPath.conceptItems}`}/>
                            <Conditions text={`#${travelPath.foodItems}`}/>
                    </div>
                    <div className={styles.resultArea}>
                      {travelPath.resultDto.dates.map((date, index) => (
                         <div key={index} className={styles.listBox}>
                           <div className={styles.date}>
                                <img src={`/images/travelPath/calendar_deepGreen.png`} alt="날짜: " className={styles.calendar}/>
                                <span className={styles.highlight}>{date}</span>
                           </div>
                           <div className={styles.divider}>------------------------------------------</div>
                           <div className={styles.content} contentEditable="true" suppressContentEditableWarning={true} onInput={e => contentChanged(e, index)}>
                               {travelPath.resultDto.infos[index].split('\n').map((line, idx) => (
                                   <React.Fragment key={idx}>
                                       <div dangerouslySetInnerHTML={{ __html: line }} />
                                   </React.Fragment>
                                ))}
                           </div>
                         </div>
                     ))}
                    </div>
                </div>
              )}
            <div>
                <UnderBar />
            </div>
        </div>
    );
}
export default TravelDetail;