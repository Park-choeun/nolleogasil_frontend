import Top from "../../components/common/TopTitle";
import UnderBar from "../../components/common/UnderBar";
import TravelList from "../../components/travelpath/TravelList";
function TravelPath_List() {
    return (
       <div>
           <div>
               <Top text="내 여행 지침서" />
           </div>
           <TravelList />
           <div>
               <UnderBar />
           </div>
       </div>
    );
}

export default TravelPath_List;
