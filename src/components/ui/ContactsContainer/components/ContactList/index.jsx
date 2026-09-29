import { useStore } from "../../../../../../store/index";
import { Clock } from "lucide-react";
import dayjs from "dayjs";

const ContactList = ({ isOpen = true }) => {
  const {
    contacts,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useStore();

  const handleClick = (contact) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);

    if (selectedChatData?._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";

    const now = dayjs();
    const msgTime = dayjs(time);

    if (now.isSame(msgTime, "day")) {
      return msgTime.format("hh:mm A");
    }

    if (now.subtract(1, "day").isSame(msgTime, "day")) {
      return "Yesterday";
    }

    return msgTime.format("DD/MM/YY");
  };

  return (
    <div
      className={`overflow-y-auto h-full  transition-all duration-300 
      ${isOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className="flex flex-col gap-2 mt-2">
        {contacts.length === 0 ? (
          <div className="text-gray-400 text-sm px-2">
            U dont have any contacts
          </div>
        ) : (
          contacts?.map((contact) => (
            
              <div
                key={contact._id}
                onClick={() => handleClick(contact)}
                className="
      flex items-center justify-between
      px-3 py-2
      bg-gray-800/70
      border border-gray-700
      rounded-lg cursor-pointer

      hover:bg-gray-800
      hover:-translate-y-1
      hover:shadow-lg hover:shadow-black/60

      transition-all duration-200
    "
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <img
                    src={contact.image}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <div className="flex flex-col leading-tight">
                    <span className="text-white text-sm font-medium">
                      {contact.username}
                    </span>

                    <span className="text-gray-400 text-[11px] truncate max-w-30">
                      {contact.email}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                  <Clock size={12} />
                  <span>{formatTime(contact.lastMessageTime)}</span>
                </div>
              </div>
            
          ))
        )}
      </div>
    </div>
  );
};

export default ContactList;
