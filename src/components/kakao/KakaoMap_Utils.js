//----현재위치 마커 생성----
export const currentMarker = (map) => {
    //커스텀 마커 이미지
    const custom = new window.kakao.maps.MarkerImage(
        "/images/map/current.png",
        new window.kakao.maps.Size(22,22), //마커 이미지 크기
        {
            //마커 이미지 옵션 설정
            offset: new window.kakao.maps.Point(25,50), //마커 이미지를 중앙으로 정렬하기 위한 옵션
            alt: "현재위치" //대체 텍스트
        }
    );

    let marker = new window.kakao.maps.Marker({
        position: map.getCenter(),
        image: custom
    });

    marker.setMap(map);
};

//----카테고리별 장소 검색----
export const createCategoryMarker = (map, category, searchRadius, placesSearchCB) => {
    //장소 검색 객체 생성
    const ps = new window.kakao.maps.services.Places(map);
    //category code로 장소 검색
    ps.categorySearch(category, placesSearchCB, { useMapCenter: true, radius: searchRadius });
};

//----원 그리기----
export const drawCircle = (map, latitude, longitude, searchRadius) => {
    const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(latitude, longitude),
        radius: searchRadius,  //반지름(미터단위)
        strokeColor: "#ADCDFD",  //선의 색
        strokeOpacity: 0.1,  //선의 불투명도(0-1, 0에 가까울수록 투명)
        fillColor: "#ADCDFD",  //채우기 색
        fillOpacity: 0.4
    });

    circle.setMap(map);
};

//---지도 내에 현재위치로 돌아오기 버튼 생성---
export const createReturnToCurrent = (map) => {
    const mapContainer = document.getElementById("top");
    if (!mapContainer) {
        return;
    }

    const currentBtnWrapper = document.createElement("div");
    currentBtnWrapper.innerHTML = "<div style='width: 34px; height: 34px; background-color: white; border-radius: 50%; position: relative;'>" +
        "<img src='/images/map/currentBtn.png' alt='현재위치로' style='width: 26px; height: 26px; cursor: pointer; position: absolute; top: 3px; left: 3px;' />" +
        "</div>";

    const currentBtn = new window.kakao.maps.CustomOverlay({
        content: currentBtnWrapper,
        position: null,
        zIndex: 2
    });

    //customOverlay 클릭 이벤트 핸들러
    window.kakao.maps.event.addListener(currentBtn, "click", () => {
        //현재 위치로 지도 중심 이동
        map.panTo(map.getCenter());
    });

    //currentBtn을 mapContainer에 추가
    mapContainer.appendChild(currentBtn.getContent());
}
