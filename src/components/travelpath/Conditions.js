import styles from "./Conditions.module.css";
import PropTypes from "prop-types";

function Conditions({text}){
    return(
        <div className={styles.conditionTile}>{text}</div>
    );
}
export default Conditions;

Conditions.propTypes = {
    text: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.array.isRequired,
    ]),
}
