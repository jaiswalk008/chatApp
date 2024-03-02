import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../Context/store";

const ChatHeader = () =>{
    const {currentGroup} = useSelector((state:any) => state.chat);
    console.log(currentGroup);
    const dispatch = useDispatch();
    const showGroupDescription = async (groupId:number) =>{
        try {
            const res =await axios.get('http://localhost:5000/getMembers?groupId='+groupId);
            // console.log(res.data);
            const groupDetails = res.data.userIds.map((element:any,index:number) =>{
                return {...element , userName:res.data.userNames[index]}
            })
            dispatch(chatActions.setCurrentGroupList(groupDetails));
            console.log(groupDetails);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className="container-fluid  text-light chat-name"
             onClick={() => showGroupDescription(currentGroup.groupId)}>
            <i className="bi bi-people-fill"></i>
            <span>{currentGroup.groupName}</span>
            </div>
        </>
    )
}
export default ChatHeader;