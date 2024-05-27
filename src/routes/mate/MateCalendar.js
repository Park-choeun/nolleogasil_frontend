import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar-custom.css'; // 사용자 정의 스타일

function MateCalendar({handleChange,selectedValue}) {
    const [value, setValue] = useState(new Date());

    const today = new Date();
    const onChange = (newValue) => {
        setValue(newValue);
    };
    const disablePastDates = ({ date, view }) => {
        // view가 'month'일 때만 날짜를 비활성화
        return view === 'month' && date < today;
    };


    return (
        <div>
            <Calendar
                onChange={handleChange}
                value={selectedValue}
                tileDisabled={disablePastDates}
     /*           minDate={new Date(2020, 0, 1)}
                maxDate={new Date(2024, 11, 31)}*/
            />
        </div>
    );
}

export default MateCalendar;