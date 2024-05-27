import React from "react";
import {useRecoilState} from "recoil";
import {placeState} from "../../recoil/atom";


function MateBtn({place,placeInfo,setPlaceInfo}) {

    console.log(setPlaceInfo);

    const handleClick = () => {

        console.log("hi");

        const newPlaceData = {
            placeId: place.id,
            placeName: place.place_name,
            placeAddress: place.address_name,
            placeRoadAddress: place.road_address_name,
            placePhone: place.phone,
            placeUrl: place.place_url,
            placeLat: place.y,
            placeLng: place.x,
        }


            setPlaceInfo(newPlaceData); // Recoil 상태를 설정
            window.location.href = `/eatMate/mateForm?placeId=${place.id}&placeName=${place.place_name}`;


    }

    return (
        <img src="/images/map/createMate.png" alt="메이트글 작성" className="mateBtn" onClick={handleClick} />
    );


}


export default MateBtn;