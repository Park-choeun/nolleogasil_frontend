import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Top from "../../components/common/Top";
import UnderBar from "../../components/common/UnderBar";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import styles from "./Register.module.css";
import {handleRegister, getUserInfo} from "../../components/users/Register";

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: location.state?.email,
        nickname: '',
        phone: '',
        gender: '',
        mateTemp: 36.5,
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div>
          <div className={styles.top}>
            <Top text="회원가입" tmp="register" />
          </div>
          <p />
          <div className={styles.container}>
            <Container>
              <div className={styles.headliner}>
                회원가입
              </div>
              <Form>
                <Form.Group className={styles.formGroup}>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="이름"
                    value={userInfo.name}
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Control
                    type="email"
                    value={userInfo.email}
                    readOnly
                    className={styles.formControl}
                    placeholder="이메일"
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Control
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={userInfo.nickname}
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="전화번호"
                    value={userInfo.phone}
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </Form.Group>
                <Form.Group className={styles.formGroup}>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={userInfo.gender}
                    onChange={handleChange}
                    className={styles.formControl}
                  >
                    <option value="">성별 선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </Form.Control>
                </Form.Group>
                <div className={styles.buttonGroup}>
                  <Button
                    onClick={() => handleRegister(userInfo, setIsLoading, navigate, getUserInfo)}
                    className={`${styles.registerButton} ${styles.customButtonColor}`}
                    disabled={isLoading}
                  >
                    회원가입
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    취소
                  </Button>
                </div>
              </Form>
              {isLoading && (
                <div className={styles.loadingBox}>
                  <img
                    className={styles.loadingImg}
                    src={`/images/common/loading.gif`}
                    alt="loading"
                  />
                </div>
              )}
            </Container>
          </div>
          <div>
            <UnderBar />
          </div>
        </div>
    );
}
    
export default Register;