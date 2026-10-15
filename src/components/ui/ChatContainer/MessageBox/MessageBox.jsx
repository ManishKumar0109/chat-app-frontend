import { useEffect, useRef } from "react";
import { useStore } from "../../../../../store";
import dayjs from "dayjs";
import { api } from "@/lib/api-client";
import { GET_MESSAGES, HOST } from "@/utils/constants";

const MessageBox = () => {
  const scrollRef = useRef(null);

  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    userInfo,
  } = useStore();

  // 1. FETCH MESSAGES
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const payload =
          selectedChatType === "contact"
            ? { recipientId: selectedChatData._id }
            : { channelId: selectedChatData._id };

        const result = await api.post(`${HOST}${GET_MESSAGES}`, payload);

        if (result.data.success && result.data.data) {
          setSelectedChatMessages(result.data.data);
        }
      } catch (err) {
        console.error("Can't fetch messages:", err);
      }
    };

    if (
      selectedChatData?._id &&
      (selectedChatType === "contact" || selectedChatType === "channel")
    ) {
      fetchMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  // 2. AUTO-SCROLL TO LATEST MESSAGE
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatMessages]);

  // 3. DETECT FILE TYPE
  const getMessageType = (message) => {
    if (!message.fileUrl) return null;

    if (/\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(message.fileUrl)) {
      return "image";
    }

    if (/\.mp4(\?.*)?$/i.test(message.fileUrl)) {
      return "video";
    }

    return "pdf";
  };

  // 4. RENDER MESSAGE TIME
  const renderTime = (message) => (
    <div className="text-[10px] opacity-60 text-right mt-1">
      {dayjs(message.createdAt).format("hh:mm A")}
    </div>
  );

  // 5. RENDER IMAGE
  const renderImage = (message) => (
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
          rounded-2xl max-w-65 md:max-w-85
          object-cover cursor-pointer
          hover:opacity-95 transition
        "
      />

      <div
        className="
          absolute bottom-2 right-2 text-[10px]
          bg-black/50 backdrop-blur
          px-2 py-1 rounded-full text-white
        "
      >
        {dayjs(message.createdAt).format("hh:mm A")}
      </div>
    </div>
  );

  // 6. RENDER VIDEO
  const renderVideo = (message) => (
    <div className="relative">
      <video
        controls
        preload="metadata"
        className="rounded-2xl max-w-65 md:max-w-85"
      >
        <source src={message.fileUrl} type="video/mp4" />
      </video>

      <div
        className="
          absolute bottom-2 right-2 text-[10px]
          bg-black/50 backdrop-blur
          px-2 py-1 rounded-full text-white
        "
      >
        {dayjs(message.createdAt).format("hh:mm A")}
      </div>
    </div>
  );

  // 7. RENDER PDF
  const renderPdf = (message, isSender) => (
    <a
      href={message.fileUrl}
      target="_blank"
      rel="noreferrer"
      className={`
        flex items-center gap-3 p-3 rounded-2xl
        transition-all max-w-sm
        ${isSender ? "bg-violet-600 text-white" : "bg-zinc-700 text-zinc-100"}
      `}
    >
      <div className="text-2xl">📄</div>

      <div className="overflow-hidden">
        <p className="text-sm truncate">{message.fileName}</p>
        <p className="text-[11px] opacity-70">Open PDF</p>
      </div>
    </a>
  );

  // 8. RENDER TEXT MESSAGE
  const renderTextMessage = (message, isSender) => (
    <div
      className={`
        px-4 py-2.5 rounded-2xl max-w-sm wrap-break-words
        ${
          isSender
            ? "bg-violet-600 text-white rounded-br-md"
            : "bg-zinc-700 text-zinc-100 rounded-bl-md"
        }
      `}
    >
      <p className="text-sm leading-relaxed">{message.content}</p>
      {renderTime(message)}
    </div>
  );

  // 9. RENDER ONE MESSAGE
  const renderMessage = (message) => {
    const currentUserId = userInfo?._id?.toString();

    // FIX: sender can be either an ID or a populated user object.
    const senderId = (message.sender?._id ?? message.sender)?.toString();

    const isSender = Boolean(currentUserId) && senderId === currentUserId;

    const fileType = getMessageType(message);

    return (
      <div
        key={message._id}
        className={`flex mb-5 ${isSender ? "justify-end" : "justify-start"}`}
      >
        {/* RECEIVER AVATAR IN CHANNELS */}
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

        <div className="flex flex-col">
          {/* CHANNEL MEMBER NAME */}
          {selectedChatType === "channel" && !isSender && (
            <span className="text-[11px] text-gray-400 mb-1 ml-1">
              {message.sender?.username}
            </span>
          )}

          {/* TEXT */}
          {message.messageType === "text" &&
            renderTextMessage(message, isSender)}

          {/* IMAGE */}
          {message.messageType === "file" &&
            fileType === "image" &&
            renderImage(message)}

          {/* VIDEO */}
          {message.messageType === "file" &&
            fileType === "video" &&
            renderVideo(message)}

          {/* PDF */}
          {message.messageType === "file" &&
            fileType === "pdf" &&
            renderPdf(message, isSender)}
        </div>
      </div>
    );
  };

  // 10. RENDER MESSAGES WITH DATE DIVIDERS
  const renderMessages = () => {
    if (!selectedChatMessages?.length) {
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
        <div key={message._id || `${messageDate}-${index}`} className="w-full">
          {showDate && (
            <div className="flex justify-center my-4">
              <span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full border border-gray-600">
                {dayjs(message.timeStamp).format("MMM DD, YYYY")}
              </span>
            </div>
          )}

          {renderMessage(message)}
        </div>
      );
    });
  };

  // 11. MAIN UI
  return (
    <div className="w-full flex-1 overflow-y-auto px-6 border-t-8 border-b-4 border-gray-800 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageBox;
