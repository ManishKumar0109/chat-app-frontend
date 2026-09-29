
import { useStore } from "../../../../../../store/index";
import { Clock, Users } from "lucide-react";
import dayjs from "dayjs";


const ChannelList = ({ isOpen = true }) => {
  const {
    channels,
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useStore();
  // FETCH CHANNELS


  const handleClick = (channel) => {
    setSelectedChatType("channel");
    setSelectedChatData(channel);
    if (selectedChatData?._id !== channel._id) {
      setSelectedChatMessages([]);
    }
  };

  // TIME FORMATTER
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
      className={`h-full overflow-y-auto transition-all duration-300  
      ${isOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"}`}
    >
      <div className="flex flex-col gap-2 mt-2">
        {channels.length === 0 ? (
          <div className="text-gray-400 text-sm px-2">No channels found</div>
        ) : (
          channels.map((channel) => (
            
              <div
                key={channel._id}
                onClick={() => handleClick(channel)}
                className="flex items-center justify-between px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/60 transition-all duration-200"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  {/* CHANNEL ICON */}
                  <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shadow-md shadow-purple-900/40">
                    <Users size={18} className="text-white" />
                  </div>

                  {/* CHANNEL INFO */}
                  <div className="flex flex-col leading-tight">
                    <span className="text-white text-sm font-medium">
                      {channel.name}
                    </span>

                    <span className="text-gray-400 text-[11px] truncate max-w-30">
                      {channel.members.length} members
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                  <Clock size={12} />
                  <span>{formatTime(channel.updatedAt)}</span>
                </div>
              </div>
            
          ))
        )}
      </div>
    </div>
  );
};

export default ChannelList;
