import { useEffect, useState } from "react";

function PlaceMap({ lat, lng }) {
    const [map, setMap] = useState(null);

    //----지도 생성----
    const initMap = () => {
        //지도를 담을 영역의 DOM 레퍼런스
        const container = document.getElementById("placeMap");
        if (!container) {
            return;
        }

        //지도를 생성할 때 필요한 기본 옵션
        const options = {
            center: new window.kakao.maps.LatLng(lat, lng), //지도의 중심좌표
            level: 4 //지도의 레벨(확대, 축소 정도)
        };

        //지도 생성 및 객체 리턴
        const initializedMap = new window.kakao.maps.Map(container, options);
        setMap(initializedMap);

        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
           position: markerPosition
        });

        marker.setMap(initializedMap);
    };

    useEffect(() => {
        initMap();
    }, [lat, lng]);

    return(
        <div id="placeMap"
             style={{width: "580px", height: "300px", margin: "10px auto", border: "1px solid lightgrey"}}>
        </div>
    );
}

export default PlaceMap;