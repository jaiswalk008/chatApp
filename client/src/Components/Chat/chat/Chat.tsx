import ChatHeader from "./ChatHeader";
import Footer from "./Footer";
import ChatContainer from "./ChatContainer";
import '../Chat.css'
const Chat = (props:any) => {
    return (
        <div className="container conversation w-75">
            <ChatHeader/>
            <ChatContainer />
            <Footer/>
        </div>
    )
}
export default Chat;