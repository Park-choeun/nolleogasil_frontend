/**
 * 이 파일은 회원 가입을 위한 js 파일입니다.
 * @author 장민정
 * @since 2024-01-05
 */
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

export const handleRegister = async (userInfo, navigate, getUserInfo) => {
    try{
        const response = await axios.post(`${apiUrl}/api/user/register`, userInfo);
        if(response.status === 201){
            //사용자 정보 조회
            await getUserInfo(userInfo.email);
            alert('회원가입이 완료되었습니다.');
            navigate('/');
        }
    }catch(error){
        console.error('Error during registration: ', error);
    }
};

export const getUserInfo = async (userEmail) => {
    try{
        const res = await fetch(`${apiUrl}/api/user/info?email=${userEmail}`, {
            credentials: 'include'
        });
        const data = await res.json();

        //localStorage에 사용자 관련 정보 저장
        localStorage.setItem('login-token', 'emailLoginUser');
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('nickname', data.nickname);
        localStorage.setItem('usersId', data.usersId);
    }catch(error) {
        console.errorO('Error during userInfo: ', error);
    }
};