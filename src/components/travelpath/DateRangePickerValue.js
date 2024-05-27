import styles from "./DateRangePickerValue.module.css";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import {useState, useEffect} from "react";
import ko from 'date-fns/locale/ko';

function DateRangePickerValue({onRangeChange}){

    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 3),
          key: 'selection',
        }
    ]);

    useEffect(() => {
        onRangeChange(new Date(), addDays(new Date(), 3));
    }, []);

    const handleRangeChange = (ranges) => {
        const startDate = ranges.selection.startDate;
        const endDate = ranges.selection.endDate;

        // 전달된 콜백 함수를 호출하여 선택된 날짜 정보를 부모 컴포넌트로 전달
        onRangeChange(startDate, endDate);

        setState([ranges.selection]);
    };

    return(
        <div className={styles.container}>
            <div className={styles.divLabel}>
                <span className={styles.label}>가는날</span>
                <span className={styles.label}>오는날</span>
            </div>
            <DateRange
              editableDateInputs={true}
              onChange={handleRangeChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={state}
              direction="horizontal"
              dateDisplayFormat={"yyyy/MM/dd"}
              locale={ko}
            />
        </div>
    );
}
export default DateRangePickerValue;