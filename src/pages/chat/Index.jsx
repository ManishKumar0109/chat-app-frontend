import ChatContainer from "@/components/ui/ChatContainer";
import ContactsContainer from "@/components/ui/ContactsContainer";
import EmptyChatContainer from "@/components/ui/EmptyChatContainer";
import { useStore } from "../../../store/index.js";
const Chat = () => {
  const { selectedChatData } = useStore();

  return (
    <div className="flex h-screen w-screen">
      
      {/* Desktop: always visible
          Mobile/tablet: visible only when no chat is selected */}
      <div className={`${selectedChatData ? "hidden md:flex" : "flex"} md:w-87.5`}>
        <ContactsContainer />
      </div>

      {/* Chat */}
      <div className={`${selectedChatData ? "flex" : "hidden md:flex"} flex-1`}>
        {!selectedChatData ? <EmptyChatContainer /> : <ChatContainer />}
      </div>

    </div>
  );
};
export default Chat;
