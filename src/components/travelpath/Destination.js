import { useState, useEffect } from "react";
import React from 'react';
import styles from "../common/Search.module.css";
import dstyles from "./Destination.module.css";
import axios from "axios";
import styled from 'styled-components'

const DropDownBox = styled.ul`
      display: block;
      margin: 0 auto;
      padding: 20px 0 8px 0;
      background-color: white;
      border: 1px solid rgba(173, 205, 253, 0.6);
      border-top: none;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 10px 10px rgb(0, 0, 0, 0.3);
      list-style-type: none;
      z-index: 3;
      position: relative;
      bottom: 15px;
`;

const DropDownItem = styled.li`
      padding: 0 16px;

      &.selected {
        background-color: lightgray;
      }
`;
function Destination(props) {
    const [destination, setDestination] = useState("");

    const wholeTextArray = [
        "서울특별시",
        "부산광역시",
        "대구광역시",
        "인천광역시",
        "광주광역시",
        "대전광역시",
        "울산광역시",
        "세종특별자치시",
        "경기도 가평군", "경기도 고양시", "경기도 과천시", "경기도 광명시", "경기도 광주시", "경기도 구리시", "경기도 군포시",
        "경기도 김포시", "경기도 남양주시", "경기도 동두천시", "경기도 부천시", "경기도 성남시", "경기도 수원시", "경기도 시흥시",
        "경기도 안산시", "경기도 안성시", "경기도 안양시", "경기도 양주시", "경기도 양평군", "경기도 여주시", "경기도 연천군",
        "경기도 오산시", "경기도 용인시", "경기도 의왕시", "경기도 의정부시", "경기도 이천시", "경기도 파주시", "경기도 평택시",
        "경기도 포천시", "경기도 하남시", "경기도 화성시",
        "강원도 강릉시", "강원도 고성군", "강원도 동해시", "강원도 삼척시", "강원도 속초시", "강원도 양구군", "강원도 양양군",
        "강원도 영월군", "강원도 원주시", "강원도 인제군", "강원도 정선군", "강원도 철원군", "강원도 춘천시", "강원도 태백시",
        "강원도 평창군", "강원도 홍천군", "강원도 화천군", "강원도 횡성군",
        "충청북도 괴산군", "충청북도 단양군", "충청북도 보은군", "충청북도 영동군", "충청북도 옥천군", "충청북도 음성군", "충청북도 제천시",
        "충청북도 증평군", "충청북도 진천군", "충청북도 청주시", "충청북도 충주시", "충청남도 계룡시", "충청남도 공주시", "충청남도 금산군",
        "충청남도 논산시", "충청남도 당진시", "충청남도 보령시", "충청남도 부여군", "충청남도 서산시", "충청남도 서천군",  "충청남도 아산시",
        "충청남도 예산군", "충청남도 천안시", "충청남도 청양군", "충청남도 태안군", "충청남도 홍성군",
        "전라북도 고창군", "전라북도 군산시", "전라북도 김제시", "전라북도 남원시", "전라북도 무주군", "전라북도 부안군", "전라북도 순창군",
        "전라북도 완주군", "전라북도 익산시", "전라북도 임실군", "전라북도 장수군", "전라북도 전주시", "전라북도 정읍시", "전라북도 진안군",
        "전라남도 강진군", "전라남도 고흥군", "전라남도 곡성군", "전라남도 광양시", "전라남도 구례군", "전라남도 나주시", "전라남도 담양군",
        "전라남도 목포시", "전라남도 무안군", "전라남도 보성군", "전라남도 순천시", "전라남도 신안군", "전라남도 여수시", "전라남도 영광군",
        "전라남도 영암군", "전라남도 완도군", "전라남도 장성군", "전라남도 장흥군", "전라남도 진도군", "전라남도 함평군", "전라남도 해남군",
        "전라남도 화순군",
        "경상북도 경산시", "경상북도 경주시", "경상북도 고령군", "경상북도 구미시", "경상북도 김천시", "경상북도 문경시", "경상북도 봉화군",
        "경상북도 상주시", "경상북도 성주군", "경상북도 안동시", "경상북도 영덕군", "경상북도 영양군", "경상북도 영주시", "경상북도 영천시",
        "경상북도 예천군", "경상북도 울릉군", "경상북도 울진군", "경상북도 의성군", "경상북도 청도군", "경상북도 청송군", "경상북도 칠곡군",
        "경상북도 포항시",
        "경상남도 거제시", "경상남도 거창군", "경상남도 고성군", "경상남도 김해시", "경상남도 남해군", "경상남도 밀양시", "경상남도 사천시",
        "경상남도 산청군", "경상남도 양산시", "경상남도 의령군", "경상남도 진주시", "경상남도 창녕군", "경상남도 창원시", "경상남도 통영시",
        "경상남도 하동군", "경상남도 함안군", "경상남도 함양군", "경상남도 합천군",
        "제주특별자치도"
        ]

    const [inputValue, setInputValue] = useState('');
    const [haveInputValue, setHaveInputValue] = useState(false);
    const [dropDownList, setDropDownList] = useState(wholeTextArray);
    const [dropDownItemIndex, setDropDownItemIndex] = useState(-1);


    const showDropDownList = () => {
        if (inputValue === '') {
          setHaveInputValue(false);
          setDropDownList([]);
        } else {
          const choosenTextList = wholeTextArray.filter(textItem =>
            textItem.includes(inputValue)
          );
          setDropDownList(choosenTextList);
        }
    }

    const changeInputValue = (event) => {
        setInputValue(event.target.value);
        setHaveInputValue(true);
    }

    const clickDropDownItem = (clickedItem) => {
        setInputValue(clickedItem);
        setHaveInputValue(false);
    }

    //Key Press 작업
    const handleDropDownKey = (event) => {
        if (haveInputValue) {
          if (event.key === 'ArrowDown' && dropDownList.length - 1 > dropDownItemIndex) {
            setDropDownItemIndex(dropDownItemIndex + 1);
          }
          else if (event.key === 'ArrowUp' && dropDownItemIndex >= 0)
            setDropDownItemIndex(dropDownItemIndex - 1);
          else if (event.key === 'Enter' && dropDownItemIndex >= 0) {
            clickDropDownItem(dropDownList[dropDownItemIndex]);
            setDropDownItemIndex(-1);
            onClickIndex();
          }
        }
    }

    useEffect(showDropDownList, [inputValue])

    useEffect(() => {
          props.onVariableChange(destination);
    }, [destination, props]);

    const onClickIndex = (event) => {
        const inputElement = document.getElementById("desInput");
        if (inputElement) {
            setDestination(dropDownList[dropDownItemIndex]);
        }
    };

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    };


    return (
    <div>
        <div className={dstyles.search}>
            <input type="text" id="desInput" value={inputValue} onChange={changeInputValue} onKeyUp={handleDropDownKey} onKeyDown={handleKeyPress} autoComplete="off" className={styles.inputBox} placeholder="ex) 강원도 속초시"/>
            <button type="button" className={styles.searchBtn} onClick={() => {setInputValue(''); setDestination("")}}>
                <img className={dstyles.deleteImg} src="/images/travelPathForm/x.png" alt="삭제" />
            </button>
        </div>
        <div>
            {haveInputValue && (
                <DropDownBox>
                  {dropDownList.length === 0 && (
                    <DropDownItem>해당하는 지역이 없습니다</DropDownItem>
                  )}
                  {dropDownList.map((dropDownItem, dropDownIndex) => {
                    return (
                      <DropDownItem
                        key={dropDownIndex}
                        onClick={(event) => {clickDropDownItem(dropDownItem); onClickIndex(); event.preventDefault();}}
                        onMouseOver={() => setDropDownItemIndex(dropDownIndex)}
                        className={
                          dropDownItemIndex === dropDownIndex ? 'selected' : ''
                        }
                      >
                        {dropDownItem}
                      </DropDownItem>
                    )
                  })}
                </DropDownBox>
            )}
        </div>
        {destination !== "" ? (<div className={dstyles.destination}>여행지가 "{destination}"로 설정되었습니다. </div>) : (null)}
    </div>
    );
}

export default Destination;