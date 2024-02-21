import ChatHeader from "./ChatHeader";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import ChatContainer from "./ChatContainer";
import { useSelector } from "react-redux";
import axios from "axios";
import '../Chat.css'
const Chat = (props:any) => {
    const username = localStorage.getItem('username');
    const [messages , setMessages] = useState<any>([]);
    const {currentGroup} = useSelector((state:any) => state.chat);
    const {token} = useSelector((state:any) => state.auth);
    const sendMessageHandler = async (message:any)=>{
        const messageDetails = {message,groupId:currentGroup.groupId}
        try{
            const res = await axios.post('http://localhost:5000/sendMessage',messageDetails,{
                headers:{Authorization:token}
            });
            console.log(res);
            const updatedMessagesList = [...messages , {...res.data,username}];
            console.log(updatedMessagesList);
            setMessages(updatedMessagesList);
        }
        catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        const fetchMessages = async () =>{
            try {
                const res = await axios.get('http://localhost:5000/getMessages?groupId='+currentGroup.groupId);
                console.log(res.data);
                setMessages(res.data.messages);
            } catch (error) {
                console.log(error)
            }
        }
        fetchMessages();
    },[currentGroup.groupId])
    return (
        <div className="container conversation w-75">
            <ChatHeader/>
            <ChatContainer messages={messages} />
            <Footer onSendMessage = {sendMessageHandler}/>
        </div>
    )
}
export default Chat;