import styles from "../maps/maps.module.css"
import Top from "../../components/common/Top";
import MyChatRoomList from "./MyChatRoomList";
import UnderBar from "../../components/common/UnderBar";

function MyChatRoomList_Main () {

    return (
        <div>
            <div className={styles.top}>
                <Top text="채팅방" />
            </div>
            <div className={styles.subBody}>
                <MyChatRoomList />
            </div>
            <div>
                <UnderBar />
            </div>
        </div>
    );

}

export default MyChatRoomList_Main;