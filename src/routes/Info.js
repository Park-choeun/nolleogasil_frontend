import {Link} from "react-router-dom";
import UnderBar from "../components/common/UnderBar";
import styles from "./Info.module.css";

function Info () {
    return (
        <div>
            <div className={styles.top}>
                <Link to="/">
                    <span className={styles.logo}>놀러가실?</span>
                </Link>
            </div>

            <div className={styles.subBody}>

            </div>

            <div>
                <UnderBar />
            </div>
        </div>
    );
}

export default Info;