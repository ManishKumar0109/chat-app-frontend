import { useEffect, useRef } from "react";
import { useStore } from "../../../../../store";
import dayjs from "dayjs";
import { api } from "@/lib/api-client";
import { GET_MESSAGES, HOST } from "@/utils/constants";

const MessageBox = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    userInfo,
  } = useStore();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await api.post(`${HOST}${GET_MESSAGES}`, {
          recipientId: selectedChatData._id,
        });

        if (result.data.success && result.data.data) {
          setSelectedChatMessages(result.data.data);
        }
      } catch (err) {
        console.log("cant fetch messages");
      }
    };
    const fetchChannelMessages = async () => {
      try {
        const result = await api.post(`${HOST}${GET_MESSAGES}`, {
          channelId: selectedChatData._id,
        });

        if (result.data.success && result.data.data) {
          setSelectedChatMessages(result.data.data);
        }
      } catch (err) {
        console.log("cant fetch messages");
      }
    };

    if (selectedChatData?._id && selectedChatType === "contact") {
      fetchMessages();
    } else if (selectedChatData?._id && selectedChatType === "channel") {
      fetchChannelMessages();
    }
  }, [selectedChatData, selectedChatType]); // ✅ removed selectedChatMessages

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }

  }, [selectedChatMessages]);

  const renderMessages = () => {
    if (!selectedChatMessages || selectedChatMessages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          No messages yet
        </div>
      );
    }

    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = dayjs(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={messageDate + index} className="w-full">
          {/* Date Divider */}
          {showDate && (
            <div className="flex justify-center my-4">
              <span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full border border-gray-600">
                {dayjs(message.timeStamp).format("MMM DD, YYYY")}
              </span>
            </div>
          )}

          {/* Message */}
          {selectedChatType === "contact" && renderMessage(message)}
          {selectedChatType === "channel" && renderMessage(message)}
        </div>
      );
    });
  };

  const renderMessage = (message) => {
    const currentUserId = userInfo._id;

    // FIXES PRIVATE CHAT SOCKET BUG
    const senderId =message.sender;

    //after refresh
    // object
    // id 
    // fail

    //when sync msg 
    // id id true


    const isSender = senderId === currentUserId;

    const isImage =
      message.fileUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(message.fileUrl);

    const isVideo = message.fileUrl && /\.mp4$/i.test(message.fileUrl);

    const isPdf = message.fileUrl && !isImage && !isVideo;

    return (
      <div
        className={`
        flex mb-5
        ${isSender ? "justify-end" : "justify-start"}
      `}
      >
        {/* RECEIVER AVATAR */}
        {!isSender && selectedChatType === "channel" && (
          <img
            src={message.sender?.image || "/default-avatar.png"}
            alt="avatar"
            className="
              w-8 h-8 rounded-full
              object-cover mr-2 mt-auto
            "
          />
        )}

        {/* MESSAGE CONTENT */}
        <div className="flex flex-col">
          {/* USERNAME */}
          {selectedChatType === "channel" && !isSender && (
            <span
              className="
                text-[11px]
                text-gray-400
                mb-1 ml-1
              "
            >
              {message.sender?.username}
            </span>
          )}

          {/* TEXT MESSAGE */}
          {message.messageType === "text" && (
            <div
              className={`
              px-4 py-2.5 rounded-2xl
              max-w-sm wrap-break-words
              ${
                isSender
                  ? "bg-violet-600 text-white rounded-br-md"
                  : "bg-zinc-700 text-zinc-100 rounded-bl-md"
              }
            `}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>

              <div
                className="
                text-[10px]
                opacity-60
                text-right mt-1
              "
              >
                {dayjs(message.createdAt).format("hh:mm A")}
              </div>
            </div>
          )}

          {/* IMAGE */}
          {message.messageType === "file" && isImage && (
            <div className="relative group">
              <img
                src={message.fileUrl.replace(
                  "/upload/",
                  "/upload/q_auto,f_auto,w_600/",
                )}
                alt="shared"
                loading="lazy"
                onClick={() => window.open(message.fileUrl, "_blank")}
                className="
                  rounded-2xl
                 max-w-65
                  md:max-w-85
                  object-cover
                  cursor-pointer
                  hover:opacity-95
                  transition
                "
              />

              <div
                className="
                  absolute bottom-2 right-2
                  text-[10px]
                  bg-black/50 backdrop-blur
                  px-2 py-1 rounded-full
                  text-white
                "
              >
                {dayjs(message.createdAt).format("hh:mm A")}
              </div>
            </div>
          )}

          {/* VIDEO */}
          {message.messageType === "file" && isVideo && (
            <div className="relative">
              <video
                controls
                preload="metadata"
                className="
                  rounded-2xl
                  max-w-65
                  md:max-w-85
                "
              >
                <source src={message.fileUrl} type="video/mp4" />
              </video>

              <div
                className="
                  absolute bottom-2 right-2
                  text-[10px]
                  bg-black/50 backdrop-blur
                  px-2 py-1 rounded-full
                  text-white
                "
              >
                {dayjs(message.createdAt).format("hh:mm A")}
              </div>
            </div>
          )}

          {/* PDF */}
          {message.messageType === "file" && isPdf && (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noreferrer"
              className={`
                flex items-center gap-3
                p-3 rounded-2xl
                transition-all max-w-sm
                ${
                  isSender
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-700 text-zinc-100"
                }
              `}
            >
              <div className="text-2xl">📄</div>

              <div className="overflow-hidden">
                <p className="text-sm truncate">{message.fileName}</p>

                <p className="text-[11px] opacity-70">Open PDF</p>
              </div>
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex-1 overflow-y-auto px-6  border-t-8 border-b-4 border-gray-800 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageBox;
