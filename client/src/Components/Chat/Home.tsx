import Header from "../UI/Header";
import Chat from "./chat/Chat";
import './Chat.css';
import ChatList from "./ChatList";
const Home = (props:any)=>{
    return (
        <>
            <Header />
            <div className="container-fluid h-75 d-flex justify-content-start">
                <ChatList/>
                <Chat/>
            </div>
        </>
    )
}
export default Home;