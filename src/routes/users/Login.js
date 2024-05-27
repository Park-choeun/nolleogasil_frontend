import KakaoLogin from 'react-kakao-login';
import Top from "../../components/common/Top";
import UnderBar from "../../components/common/UnderBar";
import styles from "./Login.module.css";

function Login() {
  const rest_api_key = process.env.REACT_APP_REST_API_KEY;
  const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  const handleLogin = () => {
    window.location.href = kakaoURL
  }

  return (
    <div>
      <div className={styles.top}>
          <Top text="로그인 | 회원가입" tmp="login"/>
      </div>
      <p/>
      <div className={styles.container}>
          <div className={styles.headliner}>
            Welcome to
            <p/>놀러가실!
          </div>
          <div className={styles.img}>
            <img src="/images/users/login_eat.png" />
          </div>
          <div className={styles.btn}>
              <img
                src="/images/users/kakao_login_medium_wide.png"
                alt="카카오 로그인"
                onClick={handleLogin}
              />
          </div>
      </div>
      <div>
        <UnderBar />
      </div>
    </div>
  );
}
export default Login;