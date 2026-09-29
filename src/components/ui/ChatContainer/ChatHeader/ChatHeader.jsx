import {
  ArrowLeft,
  EllipsisVertical,
  Users,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { useStore } from "../../../../../store/index.js";

function AvatarComponent({ image, isGroup }) {
  return (
    <Avatar className="h-12 w-12 border border-gray-600 shadow-md">
      <AvatarImage
        src={image}
        alt=""
        className="object-cover"
      />

      <AvatarFallback className="bg-linear-to-br from-purple-500 to-pink-500 text-white font-semibold">
        {isGroup ? <Users size={18} /> : "PP"}
      </AvatarFallback>
    </Avatar>
  );
}

const ChatHeader = () => {
  const {
    selectedChatData,
    closedChat,
    selectedChatType,
  } = useStore();

  const {
    email,
    username,
    image,
    name,
    members,
  } = selectedChatData;

  const avatarImage =
    image ||
    "https://i.pinimg.com/736x/d3/42/ad/d342ad4decad6420d326f67cf1897144.jpg";

  return (
    <div
      className="
        h-18
        w-full
        flex
        items-center
        justify-between
        px-5
        bg-[#1f2937]/95
        backdrop-blur-md
        border-b
        border-gray-700
        text-white
        shadow-md
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        
        <button
          onClick={closedChat}
          className="
            p-2 rounded-full
            hover:bg-gray-700/80
            transition-all duration-200
            active:scale-95
          "
        >
          <ArrowLeft size={22} />
        </button>

        <div className="cursor-pointer">
          <AvatarComponent
            image={selectedChatType === "contact" ? avatarImage : image}
            isGroup={selectedChatType !== "contact"}
          />
        </div>

        {/* TEXT */}
        <div className="flex flex-col leading-tight">
          
          <span className="text-[16px] font-semibold tracking-wide">
            {username || name}
          </span>

          <span className="text-xs text-gray-400 mt-1">
            {email || `${members?.length || 0} members`}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <button
        className="
          p-2 rounded-full
          hover:bg-gray-700/80
          transition-all duration-200
          active:scale-95
        "
      >
        <EllipsisVertical size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;
