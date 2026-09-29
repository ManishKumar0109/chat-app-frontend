import { useStore } from "../store/index";
import { HOST } from "./utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useStore();

  useEffect(() => {
    if (userInfo && userInfo !== "undefined") {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo._id },
      });

      socket.current.on("connect", () => {
        console.log("connected to socket server");
      });

      socket.current.on("receiveMessage", (msg) => {

        const { selectedChatData, selectedChatType, addMessage } =
          useStore.getState();
        
        if (
          selectedChatType &&
          selectedChatData &&
          (selectedChatData._id === msg.sender._id ||
            selectedChatData._id === msg.recipient._id)
        ) {
          addMessage(msg);
        }
      });

      socket.current.on("receiveChannelMessage", (msg) => {

        const { selectedChatData, selectedChatType, addMessage } = useStore.getState();
        
        if (
          selectedChatType &&
          selectedChatData._id===msg.channelId
        ) {
          addMessage(msg);
        }
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
