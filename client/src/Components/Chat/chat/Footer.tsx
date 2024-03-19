import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

const Footer = (props:any) =>{
    const [message,setMessage] = useState('');
    const {currentGroup} = useSelector((state:any)=>state.chat);
    const {token} = useSelector((state:any)=>state.auth);
    const sendFile = () =>{
        const fileInput = document.getElementById('fileInput') as HTMLInputElement; 
        fileInput.click();
    }
    const sendMessageHandler = (e:any) =>{
        e.preventDefault();

       if(message.trim().length>0) {
        props.onSendMessage(message);
        setMessage('')
       }
    }
    const sendFileHandler = async (e:any) =>{
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        try{
            const formData = new FormData();
            formData.append('file', selectedFile);
            const res = await axios.post('http://localhost:5000/sendFile?groupId='+currentGroup.groupId,formData,{
                headers:{Authorization:token}
            });
            console.log(res);
        }catch(err){
            console.log(err);
        
        }
    }

    return (
        <div className="d-flex">
                <button onClick={sendFile} className="btn btn-secondary ms-1"><i className="bi text-light bi-folder-symlink-fill"></i></button>
                <input type="file" id="fileInput" onChange={sendFileHandler} style={{display:"none"}}/>
                <form className="w-100" onSubmit={sendMessageHandler}>
                    <div className="d-flex">
                        <input type="text" className="form-control text-white" value={message} 
                        onChange={(e) => setMessage(e.target.value)} id="enter-message" placeholder="Send a message"/>
                        
                        <button type="submit" className="btn btn-danger me-1"><i className="bi  bi-arrow-up-right"></i></button>
                    </div>
                </form>
            </div>
    )
}
export default Footer;