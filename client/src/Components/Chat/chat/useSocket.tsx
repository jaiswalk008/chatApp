import { io } from "socket.io-client";
import { useMemo } from "react";

const useSocket = () =>{
    const socket = useMemo(()=> io('localhost:5000'),[]);
    return socket;
}

export default useSocket;