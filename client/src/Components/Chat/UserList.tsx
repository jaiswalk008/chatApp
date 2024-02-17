import axios from "axios"
import { useEffect, useState } from "react"
import { authActions, chatActions } from "../Context/store";
import { useDispatch,useSelector } from "react-redux";
export type user={
    id: number;
    userName: string;
    email:string
}
const UserList = () =>{
    const dispatch = useDispatch();
    const {usersList} = useSelector((state:any) => state.auth);
    
    const [userList, setUserList] = useState<user[]>([]);
    const [username, setUsername] = useState('');
    const [selectedUsers, setSelectedUser] = useState<user[]>([]);
    const [userNotFound, setUserNotFound] = useState(false);
    const addUserHandler = (e:any) =>{
        if(e.key==='Enter' || e.type==='click'){
            let newUserList:user[]=[];
            let userFound=false;
            userList.forEach((user:user,index:number) =>{
                if(user.userName===username){
                     userFound=true;
                    const updatedUsersList = [...selectedUsers,user];
                    console.log(updatedUsersList);
                    dispatch(chatActions.setCurrentGroupList(updatedUsersList))

                    setSelectedUser(prev => [...updatedUsersList]);
                    
                }
                else newUserList.push(user);
            })

            if(!userFound){
                setUserNotFound(true);
                return;
            }
            const updatedUsersList = userList.filter(user => user.userName !== username);
            
            setUserList(updatedUsersList);
            setUsername('');
            setUserNotFound(false);
        }
    }
    const removeUser = (username:string) =>{
        const newSelectedUserList = selectedUsers.filter((element:user) => element.userName !== username);
        setSelectedUser(prev => [...newSelectedUserList]);
        dispatch(chatActions.setCurrentGroupList(selectedUsers))

        const newUserList = usersList.filter((user:user) => user.userName === username);
        setUserList([...userList,...newUserList]);
    }
    useEffect(()=>{
        const fetchUsers = async () =>{
            const res = await axios.get('http://localhost:5000/getUsers');
            const currentUserName = localStorage.getItem('username');
            const users = res.data.userList.filter((user:user) => user.userName!==currentUserName);
            dispatch(authActions.setUserList(users));
            setUserList(users);
        }   
        fetchUsers();
    },[dispatch])
    return (
       <>
            <span>
                {selectedUsers.length>0 && selectedUsers.map((element:user) => {
                    return <span className="added-user" key={element.userName}>{element.userName} <button className="btn-dark btn btn-sm" 
                    onClick={() => removeUser(element.userName)}>X</button></span> 
                })}
            </span>
            <div className="d-flex">
            <input list="username" className="form-control  mt-2"  value={username} onKeyDown={addUserHandler} 
            onChange={(e) => setUsername(e.target.value)}  placeholder="enter user name"/>
                {username.length>0 && <button onClick={addUserHandler} className="btn mt-2">✅</button>}
            </div>
            
           {userList.length >0 &&  <datalist id="username">
                {userList.map((user:user) => <option  key={user.id} value={user.userName} onClick={addUserHandler}></option>)}
            </datalist>}
            {userNotFound && <p className="text-da">User not found</p>}
       </>
    )
}
export default UserList;