import React, {useEffect} from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import KakaoLogin from "../../routes/users/Login";

const User = () => {
    const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
    const navigate = useNavigate();

    //인가코드 받아옴
    const code = new URL(window.location.href).searchParams.get("code");

    const getToken = async () => {
        const payload = qs.stringify({
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code: code,
        });

        try{
            //get access token
            const response = await axios.post(
                "https://kauth.kakao.com/oauth/token",
                payload,
            );
    
            //kakao javascript sdk 초기화
            window.Kakao.init(REST_API_KEY);

            //access token 세팅
            window.Kakao.Auth.setAccessToken(response.data.access_token);

            if(response.data.access_token){ //access token을 성공적으로 가져왔다면
                //localStorage에 access token 저장
                localStorage.setItem('login-token', response.data.access_token);
            }
            //사용자 정보 받아오기
            navigate("/profilePath");

            console.log(localStorage.getItem('login-token'));
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        getToken();
    }, []);

    return(
        <div>
        </div>
    );
};
export default User;