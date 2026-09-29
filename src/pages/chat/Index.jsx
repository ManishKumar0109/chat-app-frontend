import ChatContainer from "@/components/ui/ChatContainer";
import ContactsContainer from "@/components/ui/ContactsContainer";
import EmptyChatContainer from "@/components/ui/EmptyChatContainer";
import { useStore } from "../../../store/index.js";

const Chat = () => {
  const { selectedChatData } = useStore();

  return (
    <div className="flex h-screen w-screen">
      <ContactsContainer />
      {!selectedChatData ? <EmptyChatContainer /> : <ChatContainer />}
    </div>
  );
};

export default Chat;
