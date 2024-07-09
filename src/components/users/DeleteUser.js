import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DeleteUser() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url

  const handleDeleteUser = async () => {
    // 사용자에게 확인을 받음
    const confirmDelete = window.confirm("정말로 회원 탈퇴하시겠습니까?");
    if (!confirmDelete) {
      return; // 취소를 선택한 경우 함수 종료
    }

    setLoading(true);
    try {
      const usersId = localStorage.getItem('usersId');

      const response = await fetch(`${apiUrl}/api/user/delete/${usersId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.ok) { //회원 탈퇴 성공 시
        //localStorage에 저장된 사용자 관련 정보 삭제
        localStorage.removeItem('userInfo');
        localStorage.removeItem('usersId');
        localStorage.removeItem('login-token');
        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/");
      } else {
        console.error("회원 탈퇴 요청 실패");
      }
    } catch (error) {
      console.error("회원 탈퇴 요청 실패: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div>
    <Button variant="danger" onClick={handleDeleteUser} disabled={loading}>
      회원탈퇴
    </Button>
  </div>
  );
}

export default DeleteUser;
