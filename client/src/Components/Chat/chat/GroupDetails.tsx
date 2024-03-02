import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { chatActions } from "../../Context/store";
import { useState } from "react";

const GroupDetails = () =>{
    const [editMode , setEditMode] = useState(false);
    const {currentGroup , currentGroupList} = useSelector((state:any) => state.chat);
    const [groupName , setGroupName] = useState(currentGroup.groupName);
    const currentUserName = localStorage.getItem('username');
    const dispatch = useDispatch();
        
    const makeAdminHandler = async (id:any) =>{
        console.log(id)
        try {
            const res = await axios.patch(`http://localhost:5000/makeAdmin?groupId=${currentGroup.groupId}&userId=${id}`);
            console.log(res);
            dispatch(chatActions.makeAdmin(id));
        } catch (error) {
            console.log(error);
        }
    }
    let isAdmin = false;
    currentGroupList.forEach((element:any) => {
        if(element.userName===currentUserName){
            isAdmin = element.admin;
        }
    })
    const handleEditState =async () => {
        if(editMode){
            setEditMode(prev => !prev)
            dispatch(chatActions.updateGroupName({groupName ,groupId: currentGroup.groupId}));
            await axios.patch('http://localhost:5000/update-groupname?id='+currentGroup.groupId+'&groupName='+groupName);
        }
        setEditMode(prev => !prev)
    }

    return (
        <div className="group-info">
            <i className="bi bi-people-fill"></i>
          {editMode ? 
            (<><input type="text" onChange={(e) => setGroupName(e.target.value)} value={groupName}  className="" ></input>
            <button className="btn btn-sm mb-1 ms-1"  onClick={handleEditState}>✅</button> 
            </>) :
           ( <>
            <span>{currentGroup.groupName}</span>
            <i  onClick={handleEditState} className="bi bi-pen"></i>
            </>)
            }
            <hr style={{color:'white'}}/>
            <div>
                <p  className="group-members text-center mt-2">Group members: {currentGroupList.length}</p>
                {currentGroupList.map((element:any) =>{
                   
                    return <>
                        <li key={element.userName} className="group-members m-3">{element.userName} 
                    {isAdmin && !element.admin ? <button 
                    onClick={() => makeAdminHandler(element.userId)} className="btn btn-danger btn-sm ms-1">make admin</button> : null}
                    </li> 
                    </>
                    
                
                })}

            </div>
        </div>
    )
}
export default GroupDetails;