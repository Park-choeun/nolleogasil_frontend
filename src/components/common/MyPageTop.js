import { useNavigate } from "react-router-dom";
import styles from "./Top.module.css";
import PropTypes from "prop-types";
import { Tab, Nav } from 'react-bootstrap';

function MyPageTop({ text, activeTab }) {
    const navigate = useNavigate();
    const goBack = () => {
      <Nav.Link eventKey={activeTab}>회원 정보 수정</Nav.Link>
    };

    return (
        <div className={styles.top}>
            <table>
                <tbody>
                <tr>
                    <td>
                        <img
                            onClick={goBack}
                            className={styles.goBackBtn}
                            src="/images/common/goBack.png"
                            alt="이전으로"
                        />
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

MyPageTop.propTypes = {
    text: PropTypes.string.isRequired
}

export default MyPageTop;