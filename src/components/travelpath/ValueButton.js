import PropTypes from "prop-types";
import React, { useState } from "react";
import styles from "./ValueButton.module.css"
function ValueButton({ name, text, img, value, onChange, checkedItemHandler}) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = ({target}) => {
        setIsChecked(!isChecked);
        checkedItemHandler(target.name, target.id, target.checked);
        onChange && onChange(name, !isChecked); // 상위 컴포넌트로 체크 여부 전달

      };

    return (
      <div className={styles.tile}>
        <input type="checkbox" name={name} id={value} checked={isChecked} onChange={(e) => handleCheckboxChange(e)} />
        <label htmlFor={value}>
            <img className={styles.icon} src={`/images/travelPathForm/${img}.png`} alt={text} />
            <h6>{text}</h6>
        </label>
      </div>
    );
}

ValueButton.propTypes = {
        name: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        checkedItemHandler: PropTypes.func,
};

export default ValueButton;