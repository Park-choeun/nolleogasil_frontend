import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePath.module.css";

const ProfilePath = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        nickname: '',
        phone: '',
        gender: '',
    });
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const data = await window.Kakao.API.request({
                url: "/v2/user/me",
            });

            setUserProfile({
                name: data.kakao_account.name,
                email: data.kakao_account.email,
                nickname: data.properties.nickname,
                phone: data.kakao_account.phone_number,
                gender: data.kakao_account.gender,
            });
        } catch (err) {
            console.log('Error fetching Kakao user profile: ', err);
        }
    };

    useEffect(() => {
        if (userProfile.email && userProfile.name) {
            //백엔드로 사용자 정보 전달
            sendProfileToBackend(userProfile);
        }
    }, [userProfile]);

    const sendProfileToBackend = async (profileData) => {
        try {
            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem("login-token"),
                },
                withCredentials: true,
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                // 성공적으로 백엔드로 정보 전달됨
                await getUserInfo(profileData.email); // 가입 완료 후 회원 정보 조회
                setIsLoading(false);
                alert('회원 가입이 완료되었습니다.');
            } else if (response.status === 400) {
                await getUserInfo(profileData.email);
                setIsLoading(false);
                alert('로그인이 완료되었습니다.');
            } else {
                console.log('Failed to send user profile to backend...');
            }
        } catch (error) {
            console.error('Error sending user profile to backend: ', error);
        }
    };

    const getUserInfo = async (userEmail) => {
        try {
            const res = await fetch(`${apiUrl}/api/user/info?email=${userEmail}`, {
                withCredentials: true
            });
            const data = await res.json();

            //localStorage에 사용자 관련 정보 저장
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('nickname', data.nickname);
            localStorage.setItem('usersId', data.usersId);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching userinfo: ', error);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            navigate("/");
        }
    }, [isLoading, navigate]);

    return (
        <div>
            {isLoading ? ( // 로딩 중이면 로딩 화면 표시
                <div className={styles.loadingBox}>
                    <img
                        className={styles.loadingImg}
                        src={`/images/common/loading.gif`}
                        alt="loading"
                    />
                </div>
            ) : null}
        </div>
    );
};

export default ProfilePath;