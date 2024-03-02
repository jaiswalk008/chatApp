import Header from "../UI/Header";
import Chat from "./chat/Chat";
import './Chat.css';
import ChatList from "./ChatList";
import GroupDetails from "./chat/GroupDetails";
import { useSelector } from "react-redux";
const Home = (props:any)=>{
    const {currentGroupList} = useSelector((state:any) => state.chat);
    return (
        <>
            <Header />
            <div className="container-fluid h-75 d-flex justify-content-start">
                <ChatList/>
                <Chat/>
                {currentGroupList.length>0 && <GroupDetails/>}
            </div>
        </>
    )
}
export default Home;