import {  useState } from "react";
import UserList, { user } from "./UserList";
import {  useDispatch, useSelector } from "react-redux";
import { chatActions } from "../Context/store";
import axios from "axios";


const CreateGroup = (props:any) =>{

    const [groupName, setGroupName] = useState<string>('');
    const [errorMessage,setErrorMessage] = useState<string>('');
    const {currentGroupList} = useSelector((state:any) => state.chat);
    const [groupCreated, setGroupCreated] = useState<Boolean>(false);
    const {token} = useSelector((state:any) => state.auth);
    const dispatch = useDispatch();
    const createGroupHander = async ()=>{
        
        if(groupName==='') setErrorMessage('Enter group name');
        else if(currentGroupList?.length===0) setErrorMessage('Please add atleast one user');
        else {
            try {
                const res =await axios.post('http://localhost:5000/createGroup',{groupName, userList:currentGroupList},{
                    headers:{'Authorization':token}
                })
                // console.log(res.data);
                // console.log(currentGroupList)
                props.onCreateHandler(res.data);
                setGroupName('');
                setErrorMessage('');
                // dispatch(chatActions.setCurrentGroupList([]));
                setGroupCreated(true);
            } catch (error) {
                
            }
           
        }   
        
    }
    return (
        <div >
            <button type="button" className="btn mt-1 btn-primary " data-bs-toggle="modal" data-bs-target="#new-chat">
                New
            </button>
            <div className="modal fade" id="new-chat" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog ">
                    <div className="modal-content bg-dark">
                        <div className="modal-header bg-danger d-flex flex-column">
                            <div className="d-flex justify-content-start">
                                <label htmlFor="groupname" className="form-label m-1">Group Name:</label>
                                <input type="text"   value={groupName} onChange={(e) => setGroupName(e.target.value)}
                                id="groupname" required/>
                            </div>
                        </div>
                        <div className="text-start p-3">
                            <span>Enter user name to add them to the group</span>
                             <hr/>
                            <UserList removeSelectedUsersList={groupCreated}/>
                            {errorMessage.length>0 && <p className="text-danger">{errorMessage}</p>}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={createGroupHander} type="button" >create</button>
                            <button type="button" id="close" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                   
                    </div>
                               
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CreateGroup;