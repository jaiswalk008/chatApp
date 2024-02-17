import { useCallback } from "react";
import CreateGroup from "./CreateGroup";
import { user } from "./UserList";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../Context/store";
import { Group } from "../Context/chat";

const ChatList= (props:any) =>{
    const dispatch = useDispatch();
    const {groups} = useSelector((state:any) => state.chat);    
    const {currentGroupList} = useSelector((state:any) => state.chat);
    const createGroupHandler = useCallback((groupName:string) =>{
      
        dispatch(chatActions.addTogroup({groupName, currentGroupList}));
        dispatch(chatActions.setCurrentGroupList([]));
        document.getElementById('close')?.click();
    },[dispatch])

    const showChat = () =>{
        
    }

    return (
        <div className="container group-list d-flex justify-content-start flex-column" >    
            <div className="d-flex ">
                <input type="text" className="form-control m-1" id="search-user"  placeholder="Search"/>
                <CreateGroup onCreateHandler= {createGroupHandler}/>
            </div>
            <div className="d-flex class-list flex-column overflow-auto">
            
                <header className="text-white fw-bold fs-5">Chats</header>
                {groups.map((group:Group) =>{
                    return (
                        <div className="group" onClick={showChat}  key={group.groupName}>
                            {group.groupName}
                        </div>
                    ) 
                    
            
                })}
            </div>
        </div>
    )
}
export default ChatList;