import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

function Button ({ text, img, link }) {
    return (
        <div className={styles.container}>
            <Link to={link}>
                <img className={styles.icon} src={`/images/main/${img}.png`} alt={text} />
            </Link>
            <br/>
            <span className={styles.text}>{text}</span><p/>
        </div>
    );
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    link: PropTypes.string
}

export default Button;