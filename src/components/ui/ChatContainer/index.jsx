import ChatHeader from "./ChatHeader/ChatHeader";
import MessageBar from "./MessageBar/MessageBar";
import MessageBox from "./MessageBox/MessageBox";


const ChatContainer = () => {

  return (
    <div className="flex-1 h-screen poppins-regular overflow-hidden flex flex-col text-2xl text-white bg-[#021A54] ">
      <ChatHeader />
      <MessageBox />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
