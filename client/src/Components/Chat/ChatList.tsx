import { useCallback, useEffect } from "react";
import CreateGroup from "./CreateGroup";
 
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../Context/store";
import { Group } from "../Context/chat";
import axios from "axios";
import useSocket from "./chat/useSocket";
const ChatList= (props:any) =>{
    const dispatch = useDispatch();
    const {groups} = useSelector((state:any) => state.chat);    
    const {currentGroupList , currentGroup} = useSelector((state:any) => state.chat);
    const {token} = useSelector((state:any) => state.auth);
    const socket = useSocket();
    const createGroupHandler = useCallback((groupDetails:{groupName:string, groupId:number}) =>{
      
        dispatch(chatActions.addTogroup({groupName:groupDetails.groupName, groupId:groupDetails.groupId ,currentGroupList}));
        dispatch(chatActions.setCurrentGroupList([]));
        dispatch(chatActions.setCurrentGroup(groupDetails));
        document.getElementById('close')?.click();
    },[dispatch,currentGroupList])

    const showChat = (group:Group) =>{
       
        socket.emit('leave-room',currentGroup.groupId);
        dispatch(chatActions.setCurrentGroup(group));
        dispatch(chatActions.setCurrentGroupList([]));
    }
    useEffect(() =>{
        const fetchGroups = async () =>{
            try{
                const res = await axios.get('http://localhost:5000/getGroups',{
                    headers:{Authorization:token}
                })
                // console.log(res.data);
                dispatch(chatActions.setGroup(res.data.groupDetails.reverse()));
                // dispatch(chatActions.setCurrentGroup({groupName:groups[0].groupName , groupId:groups[0].groupId}))
                // console.log(groups[0])
            }catch(err){
                console.log(err)
            }
        }
        fetchGroups();
    },[token,dispatch])
    return (
        <div className="container group-list d-flex justify-content-start flex-column" >    
            <div className="d-flex ">
                <input type="text" className="form-control m-1" id="search-user"  placeholder="Search"/>
                <CreateGroup onCreateHandler= {createGroupHandler}/>
            </div>
            <div className="d-flex class-list flex-column overflow-auto">
            
                <header className="text-white fw-bold fs-5">Chats</header>
                {groups.length>0 && groups.map((group:Group) =>{
                    return (
                        <div className="group" onClick={() => showChat(group)}  key={group.groupId}>
                            {group.groupName}
                        </div>
                    ) 
                    
                })}
            </div>
        </div>
    )
}
export default ChatList;