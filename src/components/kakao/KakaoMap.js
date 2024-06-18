import {useCallback, useEffect, useState} from "react";
import useGeolocation from "./useGeolocation.tsx";
import {createCategoryMarker, currentMarker, drawCircle, createReturnToCurrent} from "./KakaoMap_Utils";
import styles from "./KakaoMap.module.css";
import "./KakaoMap.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function KakaoMap({ category }) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;  //backend api url
    const userInfo = localStorage.getItem("userInfo");

    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const current = useGeolocation();
    const latitude = current.loaded ? current.coordinates.lat : 33.450701;
    const longitude = current.loaded ? current.coordinates.lng : 126.570667;
    const searchRadius = 600;
    let markers = [];
    let currentInfoWindow = null;

    //----지도 생성----
    const initMap = useCallback(() => {
        //지도를 담을 영역의 DOM 레퍼런스
        const container = document.getElementById("kakaoMap");
        if (!container) {
            return;
        }

        //지도를 생성할 때 필요한 기본 옵션
        const options = {
            // center: new window.kakao.maps.LatLng(latitude, longitude), //지도의 중심좌표
            center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표
            level: 5 //지도의 레벨(확대, 축소 정도)
        };

        //지도 생성 및 객체 리턴
        const initializedMap = new window.kakao.maps.Map(container, options);
        setMap(initializedMap);
    }, []);
    // }, [current]);

    // useEffect(() => {
    //     if (current.loaded) {
    //         initMap();
    //         setLoading(false); //로딩 완료 후 상태 변경
    //     }
    // }, [current.loaded, initMap, loading]);

    useEffect(() => {
        initMap();
    }, [initMap]);

    const placesSearchCB = (data, status, pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
            // console.log("data>>> ", data.length);
            // console.log("total>>> ", pagination.totalCount);
            displayPlaces(data);
            if (pagination.totalCount > 15) {
                displayPagination(pagination);
            }
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            if (isSearch) {
                alert("검색결과가 존재하지 않습니다.");
            } else {
                alert(`반경 ${searchRadius}m내에 검색 결과가 존재하지 않습니다.`);
            }
        } else if (status === window.kakao.maps.services.Status.ERROR) {
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const displayPlaces = async (data) => {
        const listEl = document.getElementById("placeList");
        const menuEl = document.getElementById("menu_wrap");
        const fragment = document.createDocumentFragment();
        const allRequest = [];  //병렬처리를 위한 배열

        if (!listEl || !menuEl) {
            return;
        }

        removeAllChildNods(listEl);
        removeMarker();

        for (let i = 0; i < data.length; i++) {
            const placeMarker = displayMarker(data[i], i);
            markers.push(placeMarker);

            //비동기 호출을 변수에 저장
            const request = getListItem(data[i], i, mateBtnClickHandler);
            allRequest.push(request);  //배열에 비동기 호출 추가
        }

        //병렬로 모든 비동기 호출 실행(속도 향상을 위해)
        const itemElements = await Promise.all(allRequest);

        //검색결과 항목들을 검색결과 목록 element에 추가
        itemElements.forEach(itemEl => {
            fragment.appendChild(itemEl);
        });
        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;

        if (data.length > 0 && isSearch) {
            //검색창을 통해 검색을 했고, 검색 결과가 존재한다면 지도의 중심 변경
            const newMarkerPosition = new window.kakao.maps.LatLng(data[0].y, data[0].x);
            map.panTo(newMarkerPosition); // 지도를 새로운 마커의 위치로 이동
        }
    };

    //검색된 장소들의 마커 출력
    const displayMarker = (place, idx) => {
        const imgSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
        const imgSize = new window.kakao.maps.Size(36, 37);  // 마커 이미지의 크기
        const imgOptions = {
            spriteSize: new window.kakao.maps.Size(36, 691), //이미지의 크기
            spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10), //이미지 중 사용할 영역의 좌상단 좌표
            offset: new window.kakao.maps.Point(13, 37) //마커 좌표에 일치시킬 이미지 내에서의 좌표
        };

        const markerImg = new window.kakao.maps.MarkerImage(imgSrc, imgSize, imgOptions);

        const placeMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(place.y, place.x),  //y: 위도, x: 경도
            image: markerImg
        });

        placeMarker.setMap(map);

        //마커를 클릭 -> 장소명 표출
        let infoWindow = new window.kakao.maps.InfoWindow({
            zIndex: 1,
            content: "<div style='padding: 5px;'>" + place.place_name + "</div>"
        });

        window.kakao.maps.event.addListener(placeMarker, 'click', () => {
            //이전에 열려있던 infoWindow 닫기
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }

            infoWindow.open(map, placeMarker);
            currentInfoWindow = infoWindow;
        });

        return placeMarker;
    };

    //wish status 확인(wish에 추가되었는지 여부에 따라 이미지 다르게 출력)
    const checkingWishStatus = async (placeId) => {
        //로그인 상태일때만 backend에 접근
        if (userInfo) {
            try {
                const response = await axios.get(`${apiUrl}/api/wish/checkingWishStatus`, {
                    params: {
                        placeId: placeId
                    }
                });

                //위시에 있으면 true, 없으면 false
                return response.data;
            } catch (error) {
                console.error("Error checking wish>>> ", error);
            }
        } else {
            return false;
        }
    }

    //mate버튼 클릭 이벤트 핸들러
    let navigate = useNavigate();
    const mateBtnClickHandler = (placeData) => {
        //로그인 상태일때만 허용
        if (userInfo) {
            const place = {
                placeId: placeData.id,
                placeName: placeData.place_name,
                placeAddress: placeData.address_name,
                placeRoadAddress: placeData.road_address_name,
                placePhone: placeData.phone,
                placeUrl: placeData.place_url,
                placeLat: placeData.y,
                placeLng: placeData.x,
            };

            navigate(`/eatMate/mateForm?category=${category}`, {state: {place}});
        } else {
            const result = window.confirm("로그인 후, 사용가능한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?");
            if (result) {
                navigate("/users/login");
            }
        }
    }

    //wish버튼 클릭 이벤트 핸들러
    const wishBtnClickHandler = (wishBtn, place) => {
        if (userInfo) {
            const isAddWish = wishBtn.src.includes("addWish.png");
            const action = isAddWish ? "insertWish" : "deleteWish";

            //wish에 추가
            if (action === "insertWish") {
                const placeDto = new FormData();
                placeDto.append("placeId", place.id);
                placeDto.append("placeName", place.place_name);
                placeDto.append("placeAddress", place.address_name);
                placeDto.append("placeRoadAddress", place.road_address_name);
                placeDto.append("placePhone", place.phone);
                placeDto.append("placeUrl", place.place_url);
                placeDto.append("placeLat", place.y);
                placeDto.append("placeLng", place.x);

                axios.post(`${apiUrl}/api/wish/${action}?category=${category}`, placeDto,
                    {
                        headers: {
                            "Content-Type": "application/json" // JSON 형식으로 요청 보냄을 서버에 알림
                        }
                    }).then(response => {
                    if (response.data === "successful") {
                        wishBtn.src = "/images/map/removeWish.png";
                    } else {
                        alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                    }
                }).catch(error => {
                    console.error(`Error ${action}>>> `, error.stack);
                });
            } else {  //action === "deleteWish"(wish에서 삭제)
                axios.post(`${apiUrl}/api/wish/${action}?wishId=0`, {placeId: place.id})
                    .then(response => {
                        if (response.data === "successful") {
                            wishBtn.src = "/images/map/addWish.png";
                        } else {
                            alert("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
                        }
                    }).catch(error => {
                    console.error(`Error ${action}>>> `, error.stack);
                });
            }
        } else {
            const result = window.confirm("로그인 후, 사용가능한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?");
            if (result) {
                navigate("/users/login");
            }
        }
    }

    //placeName 클릭 이벤트 핸들러 -> 해당 장소의 mate공고글 보러가기
    const placeNameClickHandler = (placeId) => {
        window.location.href = `/eatMate?placeId=${placeId}`;
    };

    //검색결과 항목을 element로 반환(출력)
    const getListItem = async (place, idx) => {
        const wishStatus = await checkingWishStatus(place.id);
        const el = document.createElement("div");
        let itemStr = `
            <div class="placeInfo">
                <table class="place">
                    <tbody>
                        <tr>
                            <td style="width: 30px;">
                                <span class="num">${idx + 1}</span>
                            </td>
                            <td colspan="2">
        `;

        if (category === "FD6" || category === "CE7") {
            itemStr += `<span class="placeName1">&nbsp${place.place_name}</span>`;
        } else {
            itemStr += `<span class="placeName2">&nbsp${place.place_name}</span>`;
        }

        if (isSearch === false) {
            itemStr += `<span class="distance">&nbsp${place.distance}m</span>`;
        }

        itemStr += `</td>
                            <td class="btnBox">`;

        //식당이나 카페일 때만, mate버튼 생성
        if (category === "FD6" || category === "CE7") {
            itemStr += `<img src="/images/map/createMate.png" alt="메이트글 작성" class="mateBtn" />`;
        }

        //위시에 있으면 true, 없으면 false
        if (wishStatus) {
            itemStr += `<img src="/images/map/deleteWish.png" alt="찜 해제" class="wishBtn" />`;
        } else {
            itemStr += `<img src="/images/map/addWish.png" alt="찜하기" class="wishBtn" />`;
        }

        itemStr += `  
                            </td>
                        </tr>
                         <tr>
                            <td class="none"></td>
                            <td style="width: 15px; vertical-align: top;">
                                <img src="/images/map/address.png" alt="주소" class="infoIcon" />
                            </td>
                            <td colspan="2">
                                <span class="address">
        `;

        if (place.road_address_name) {
            itemStr += `${place.address_name} (${place.road_address_name})`;
        } else {
            itemStr += `${place.address_name}`;
        }

        itemStr += `            </span>                   
                            </td>
                        </tr>`;

        if (place.phone) {
            itemStr += `
                        <tr>
                            <td class="none"></td>
                            <td colspan="3">
                                <span class="phone">
                                    <img src="/images/map/phone.png" alt="전화번호" class="infoIcon" />    
                                    ${place.phone}
                                </span>                   
                            </td>
                        </tr>  
            `;
        }

        if (place.place_url) {
            itemStr += `
                        <tr>
                            <td class="none"></td>
                            <td colspan="3">
                                <span class="placeWeb">
                                    <img src="/images/map/website.png" alt="웹사이트" class="infoIcon" />
                                    <a href="${place.place_url}">
                                        ${place.place_url}
                                    </a>
                                </span>                   
                            </td>
                        </tr>  
            `;
        }

        itemStr += ` </tbody>
                </table>
            </div>`;

        el.innerHTML = itemStr;
        el.className = "item";

        //placeName 클릭 이벤트 핸들러 -> 해당 mate공고글 보러가기
        const placeName = el.querySelector(".placeName1");
        if (placeName) {
            placeName.addEventListener('click', () => placeNameClickHandler(place.id));
        }

        //mateBtn 클릭 이벤트 핸들러
        const mateBtn = el.querySelector(".mateBtn");
        if (mateBtn) {
            mateBtn.addEventListener('click', () => mateBtnClickHandler(place));
        }

        //wishBtn 클릭 이벤트 핸들러
        const wishBtn = el.querySelector(".wishBtn");
        if (wishBtn) {
            wishBtn.addEventListener('click', () => wishBtnClickHandler(wishBtn, place));
        }

        return el;
    };

    //검색 결과 목록에 추가된 항목들 제거(e: element)
    const removeAllChildNods = (e) => {
        if (e) {
            while (e.hasChildNodes()) {
                e.removeChild(e.lastChild);
            }
        }
    }

    //지도에 표시되고 있는 마커를 제거
    const removeMarker = () => {
        if (markers) {
            for (const m of markers) {
                m.setMap(null);
            }
            markers = [];
        }
    };

    //검색결과 목록 하단에 페이지번호 표시
    const displayPagination = (pagination) => {
        const paginationEl = document.getElementById("pagination");
        const fragment = document.createDocumentFragment();

        if (!pagination) {
            return;
        }

        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild(paginationEl.lastChild);
        }

        for (let i = 1; i <= pagination.last; i++) {
            const el = document.createElement("a");
            el.href = "#mapContainer";
            el.innerHTML = i;


            if (i === pagination.current) {
                el.className = "on";
            } else {
                el.onclick = (function (i) {
                    return function () {
                        pagination.gotoPage(i);
                    }
                })(i);
            }
            fragment.appendChild(el);
        }
        paginationEl.appendChild(fragment);
    };

    useEffect(() => {
        if (map) {
            createCategoryMarker(map, category, searchRadius, placesSearchCB);
            currentMarker(map);
            drawCircle(map, latitude, longitude, searchRadius);
            // createReturnToCurrent(map);
        }
    }, [map, current, category]);

    //----검색 기능----
    const searchPlaces = (search) => {
        //장소 검색 객체 생성
        const ps = new window.kakao.maps.services.Places(map);
        ps.keywordSearch(search, placesSearchCB, {category_group_code: category});
    };

    const onChangeSearch = (input) => {
        setSearch(input.target.value);
        setIsSearch(true);
    };

    const onClickSearch = () => {
        searchPlaces(search);
    };

    return (
        <div>
            {loading ? (
                //로딩 중이면 로딩 표시
                <div className={styles.loadingBox}>
                    <img className={styles.loadingImg} src="/images/common/loading.gif" alt="lodaing"/>
                </div>
            ) : (
                //로딩되면 지도 표시
                <div id="top" className={styles.mapContainer}>
                    <div className={styles.searchBox}>
                        <input className={styles.searchInput} onChange={onChangeSearch} placeholder="Search..."/>
                        <button className={styles.searchBtn} onClick={onClickSearch}>
                            <img className={styles.searchImg} src="/images/map/search.png" alt="검색"/>
                        </button>
                    </div>

                    <div id="kakaoMap" className={styles.kakaoMap}></div>
                    {/*<div id="currentBtnBox" className={styles.currentBtnBox}></div>*/}

                    <div className={styles.listBox}>
                        <div id="menu_wrap">
                            <div className={styles.placeList} id="placeList"></div>
                            <div id="pagination"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default KakaoMap;