import {  useState } from "react";
import UserList, { user } from "./UserList";
import {  useSelector } from "react-redux";


const CreateGroup = (props:any) =>{

    const [groupName, setGroupName] = useState<string>('');
    const [errorMessage,setErrorMessage] = useState<string>('');
    const {currentGroupList} = useSelector((state:any) => state.chat);
    const createGroupHander = ()=>{
        
        if(groupName==='') setErrorMessage('Enter group name');
        else if(currentGroupList.length===0) setErrorMessage('Please add atleast one user');
        else {
            props.onCreateHandler(groupName);
            setGroupName('');
            setErrorMessage('');

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
                            <UserList />
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