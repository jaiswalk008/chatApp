import ChatHeader from "./ChatHeader";
import { useCallback, useEffect, useState } from "react";
import Footer from "./Footer";
import ChatContainer from "./ChatContainer";
import { useSelector } from "react-redux";
import axios from "axios";
import '../Chat.css'
import useSocket from "./useSocket";

const Chat = (props:any) => {
    const username = localStorage.getItem('username');
    const [messages , setMessages] = useState<any>([]);
    const {currentGroup} = useSelector((state:any) => state.chat);
    const {token} = useSelector((state:any) => state.auth);
    const socket = useSocket();
     
    const sendMessageHandler = useCallback(async (message:any)=>{
        const messageDetails = {message,groupId:currentGroup.groupId}
        try{
            const res = await axios.post('http://localhost:5000/sendMessage',messageDetails,{
                headers:{Authorization:token}
            });
            console.log(res);
            // const updatedMessagesList = [...messages , {...res.data,user:{username}}];
          
            // setMessages(updatedMessagesList);
            socket.emit('send-message',{...res.data,user:{username}})
        }
        catch(err){
            console.log(err);
        }
    },[socket,token,messages,username,currentGroup])

    const displayReceivedMessage = useCallback(((message:any)=>{
        console.log('helo');
        console.log(message);
        if(message.groupId===currentGroup.groupId){
            const updatedMessagesList = [...messages , {...message}];
            // console.log(updatedMessagesList);
            setMessages(updatedMessagesList);
            // console.log(message)
        }
    
    }),[currentGroup, messages])
    useEffect(()=>{
        const fetchMessages = async () =>{
            try {
                const res = await axios.get('http://localhost:5000/getMessages?groupId='+currentGroup?.groupId);
                console.log(res.data);
                setMessages(res.data.messages);
            } catch (error) {
                console.log(error)
            }
        }
        fetchMessages();
    },[currentGroup])

    useEffect(() =>{
        socket.on('connect',() =>{
            console.log(socket.id);
            
            
        })
        socket.on('receive-message',displayReceivedMessage)
        return () =>{
            socket.off('connect',()=> console.log('connected'))
            
            socket.off('receive-message', displayReceivedMessage)
        }
    },[socket,messages,displayReceivedMessage])

    useEffect(() =>{
        socket.emit('join-room',{groupId:currentGroup?.groupId,username});
        
        return ()=>{
            socket.off('join-room', ()=> console.log('joined'));
        }
    },[currentGroup,socket])

    return (
        
          currentGroup ? (
            <div className="container conversation w-75">
              <ChatHeader />
              <ChatContainer messages={messages} />
              <Footer onSendMessage={sendMessageHandler}/>
            </div>
          ) : (
            <h1>You are not a part of any group</h1>
          )
       
      );
      
      
}
export default Chat;