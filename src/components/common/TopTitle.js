import { useNavigate } from "react-router-dom";
import styles from "./TopTitle.module.css";
import PropTypes from "prop-types";

function TopTitle({ text }) {
    return (
        <div className={styles.top}>
            <table>
                <tbody>
                <tr>
                    <td className={styles.space}>
                    </td>
                    <td>
                        <span className={styles.title}>{text}</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

TopTitle.propTypes = {
    text: PropTypes.string.isRequired
}

export default TopTitle;