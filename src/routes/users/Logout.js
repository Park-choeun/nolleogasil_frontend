/**
 * 이 파일은 로그아웃을 위한 js 파일입니다.
 * @author 장민정
 * @since 2024-01-05
 */
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    useEffect(() => {
        async function logoutUser() {
            try{
                const response = await fetch(`${apiUrl}/api/user/logout`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if(response.ok){ //로그아웃 성공 시
                    //localStorage에 저장된 사용자 관련 정보 삭제
                    localStorage.removeItem('login-token');
                    localStorage.removeItem('nickname');
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('usersId');

                    navigate("/");
                    alert('로그아웃되었습니다!');
                }else{
                    console.error('failed logout: ', response.statusText);
                }
            }catch(error){
                console.error('error logout: ', error);
            }
        }
        logoutUser();
    }, []);

    return null;
};
export default Logout;