import styled, {css} from "styled-components";
import styles from "../../routes/mate/MateModal.module.css";
import React from "react";


function TimeButton({time, selected, onClick}) {

    console.log(time.key);

    //const time_value = timeKey? timeKey.split('_')[1] : '';


    return (
        <Tile>
            <TimeVal selected={selected} onClick={onClick}>
                <p>{time.value}</p></TimeVal>
        </Tile>
    );

}

function TimeButtons({timeSection,timeRange,selectedTime,onClick}) {

    let timeId = 1;

    let minute = 0;
    let time = "";
    let i =  timeRange.startHour;
    const times = [];


    while (i < timeRange.endHour) {

        const hour =  i > 12 ? i - 12 : i;

        if (minute === 30) {
            time = hour + ":" + minute;
            minute = 0;
            i++;
        } else {

            time = hour + ":00";
            minute += 30;
        }

        const key = timeSection === "amTime" ? `AM${time}` : `PM${time}`;

        //console.log(time, timeId);
        times.push({key:key, value: time});
        timeId += 1;

    }

    return (
        <div className={styles.timeList}>
            {times.map((time) =>
                <TimeButton key={time.key}
                            time={time}
                            selected={selectedTime === time.key}
                            onClick={()=>onClick(time.key)}/>
            )}
        </div>
    );


}


export default TimeButtons;

const TimeList = styled.div`
    display: flex;
    gap: 10px; /* 시간 버튼 사이의 간격 설정 */
`;


const Tile = styled.div`
    width: 135px;
    height: 70px;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 1px;
`;

const TimeVal = styled.div`
    color: rgba(0, 93, 171, 0.8);
    width: 135px;
    height: 30px;
    display: flex;
    justify-content: center;
    border-radius: 10px;
    cursor: pointer;
    border: 3px blue;
    outline: none;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, color 0.3s;
    ${(props) =>
    props.selected &&
    css`
        background-color: rgba(0, 93, 171, 0.8); /* 선택된 상태일 때 배경색 변경 */
        color: white; /* 텍스트 색상 변경 */
        border-color: #007bff; /* 테두리 색상 변경 */
    `}
 
    
`;
