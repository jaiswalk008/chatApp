import { useSelector } from "react-redux";

const ChatHeader = () =>{
    const {currentGroup} = useSelector((state:any) => state.chat);
    console.log(currentGroup);
    return (
        <>
            <div className="container-fluid  text-light chat-name">
            <i className="bi bi-people-fill"></i>
            <span>{currentGroup.groupName}</span>
            </div>
        </>
    )
}
export default ChatHeader;