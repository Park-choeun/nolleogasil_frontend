import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";
import DatePicker from "react-datepicker";



function DatePickerTimeValue() {

    const [startTime, setStartTime] = useState(null);

    const onSelect = (time) => {
        setStartTime(time);
    };

    return (
        <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
        />

    );

}

export default DatePickerTimeValue;