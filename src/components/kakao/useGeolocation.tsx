import { useState, useEffect } from "react";

interface CurrentType {
    loaded: boolean;
    coordinates?: { lat: number; lng: number };
    error?: { code: number; message: string };
}

function useGeolocation() {
    const [current, setCurrent] = useState<CurrentType>({
        loaded: false
    })

    //성공에 대한 로직
    const onSuccess = (location: { coords: { latitude: number; longitude: number; }; }) => {
        setCurrent({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }
        });
    }

    //실패에 대한 로직
    const onError = (error: { code: number; message: string; }) => {
        setCurrent({
            loaded: false,
            error
        });
    }

    useEffect(() => {
        //navigator 객체 안에 geolocation이 없다면 위치정보가 없는 것임
        if (!("geolocation" in navigator)) {
            onError({
                code: 0,
                message: "Geolocation not supported"
            });
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    }, []);

    return current;
}

export default useGeolocation;