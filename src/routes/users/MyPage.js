import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Nav } from 'react-bootstrap';
import styles from './MyPage.module.css';
import Top from '../../components/common/Top';
import ModifyUser from './ModifyUser';
import WishList from './WishList';
import MateHistoryList from '../mate/MateHistoryList';
import TravelList from "../../components/travelpath/TravelList";
import UnderBar from '../../components/common/UnderBar';
function MyPage() {
    const [activeTab, setActiveTab] = useState('userInfo');
    const navigate = useNavigate();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
  
    return (
        <div>
            <div className={styles.top}>
                <Top text="마이 페이지" />
            </div>
            <div className={styles.MyPageContainer}>
                <div className={styles.subBody}>
                    <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link eventKey="userInfo"
                                          style={{
                                              fontWeight: 'bold',
                                              backgroundColor: activeTab === 'userInfo' ? '#8BBDFF' : 'transparent', // 활성화된 탭일 때 파란색 배경
                                              color: activeTab === 'userInfo' ? 'white' : '#333' // 활성화된 탭일 때 흰색 텍스트
                                          }}>회원 정보 수정</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="wishList"
                                          style={{
                                              fontWeight: 'bold',
                                              backgroundColor: activeTab === 'wishList' ? '#8BBDFF' : 'transparent', // 활성화된 탭일 때 파란색 배경
                                              color: activeTab === 'wishList' ? 'white' : '#333' // 활성화된 탭일 때 흰색 텍스트
                                          }}>내 장소</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="travelPathList" style={{
                                    fontWeight: 'bold',
                                    backgroundColor: activeTab === 'travelPathList' ? '#8BBDFF' : 'transparent', // 활성화된 탭일 때 파란색 배경
                                    color: activeTab === 'travelPathList' ? 'white' : '#333' // 활성화된 탭일 때 흰색 텍스트
                                }}>내 여행 지침서</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="mateHistoryList" style={{
                                    fontWeight: 'bold',
                                    backgroundColor: activeTab === 'mateHistoryList' ? '#8BBDFF' : 'transparent', // 활성화된 탭일 때 파란색 배경
                                    color: activeTab === 'mateHistoryList' ? 'white' : '#333' // 활성화된 탭일 때 흰색 텍스트
                                }}>맛집메이트 이력</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="userInfo">
                                <ModifyUser />
                            </Tab.Pane>
                            <Tab.Pane eventKey="wishList">
                                <WishList />
                            </Tab.Pane>
                            <Tab.Pane eventKey="travelPathList">
                                <TravelList />
                            </Tab.Pane>
                            <Tab.Pane eventKey="mateHistoryList">
                                <MateHistoryList />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>
            <div>
                <UnderBar />
            </div>
        </div>
    );
}

export default MyPage;
