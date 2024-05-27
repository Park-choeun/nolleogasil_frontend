
//placeCat -> string타입의 Category
export const changeCategory = (placeCat) => {
    let category = "";
    switch (placeCat) {
        case 1:
            category = "식당";
            break;
        case 2:
            category = "카페";
            break;
        case 3:
            category = "숙소";
            break;
        case 4:
            category = "관광지";
            break;
    }

    return category;
}

//ninkName이 5글자 이상 넘어가면 자르기
export const trimNickName = (nickName) => {
    if (nickName.length > 6) {
        return nickName.substring(0, 6) + '...';
    } else {
        return nickName;
    }
}

//comments 10글자 이상 넘어가면 자르기
export const trimComments = (comments) => {
    if (comments.length > 10) {
        return comments.substring(0, 10) + '...';
    } else {
        return comments;
    }
}

//*로 저장된 개행문자를 <br/>로 교체
export const replaceComments = (comments) => {
    //*을 기준으로 분리해 배열 생성
    const arrComments = comments.split("*");

    //arrComments를 <br/> 요소와 함께 합쳐서 반환
    return arrComments.join("<br />");
}

//eatDate, eatTime 원하는 형식으로 format
export const formatStrEatDateTime = (eatDate, eatTime) => {
    const date = eatDate.toString();  //2024-04-01
    const formatDate = `${date.substring(2,4)}/${date.substring(5,7)}/${date.substring(8,10)}`;

    const isAM = eatTime.substring(0, 2) === "AM";
    const formatTime = isAM ? eatTime.replace("AM", "오전") : eatTime.replace("PM", "오후");

    return `${formatDate}, ${formatTime}`;
}

//eatTime을 24시간제로 변경
export const formatEatDateTime = (eatDate, eatTime) => {
    const isAM = eatTime.substring(0, 2) === "AM";
    let hour = eatTime.length === 6 ? Number(eatTime.substring(2, 3)) : Number(eatTime.substring(2, 4));
    const minute = eatTime.length === 6 ? Number(eatTime.substring(4, 6)) : Number(eatTime.substring(5, 7));
    if (!isAM) {
        hour += 12;
    }

    const mateDate = new Date(eatDate);
    mateDate.setHours(hour);
    mateDate.setMinutes(minute);
    mateDate.setSeconds(0);

    return mateDate;
}