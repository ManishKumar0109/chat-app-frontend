import { useRef, useState, useEffect } from "react";

import { Input } from "../../input";

import {
  Paperclip,
  Smile,
  SendHorizontal,
  Send,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

import EmojiPicker from "emoji-picker-react";
import { useStore } from "../../../../../store/index";
import { useSocket } from "@/SocketContext";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { HOST, SEND_FILE } from "@/utils/constants";

const FilePreviewDialog = ({
  isOpen,
  selectedFile,
  previewUrl,
  sendFileMessage,
  onClose,
  isSending,
}) => {
  const isImage = selectedFile?.type.startsWith("image/");
  const isVideo = selectedFile?.type.startsWith("video/");
  const isPdf = selectedFile?.type === "application/pdf";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md overflow-hidden
        bg-linear-to-b from-[#0f172a] to-[#1e1b4b]
        border border-gray-700 shadow-2xl rounded-xl p-5"
      >
        <div className="flex justify-center items-center p-4">
          {/* IMAGE */}
          {isImage && (
            <img
              src={previewUrl}
              alt="preview"
              className="max-h-75 w-full object-contain rounded-lg"
            />
          )}

          {/* VIDEO */}
          {isVideo && (
            <video
              controls
              src={previewUrl}
              className="max-h-75 w-full rounded-lg"
            />
          )}

          {/* PDF */}
          {isPdf && (
            <div className="flex flex-col items-center gap-3 text-white">
              <FileText size={70} />
              <p className="text-sm break-all text-center">
                {selectedFile?.name}
              </p>
            </div>
          )}

          {/* OTHER */}
          {!isImage && !isVideo && !isPdf && (
            <div className="flex flex-col items-center gap-3 text-white">
              <ImageIcon size={70} />
              <p className="text-sm break-all text-center">
                {selectedFile?.name}
              </p>
            </div>
          )}
        </div>

        <DialogFooter
          className="flex flex-col sm:flex-row gap-2 px-4 py-3
          border-t border-gray-700 bg-black/20"
        >
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSending}
            className="w-full sm:w-auto flex items-center
            justify-center gap-2 text-gray-400
            hover:text-white hover:bg-white/10"
          >
            <X size={16} />
            Cancel
          </Button>

          <Button
            disabled={isSending}
            onClick={sendFileMessage}
            className="w-full sm:w-auto flex items-center
            justify-center gap-2 bg-linear-to-r
            from-indigo-600 to-violet-600
            hover:from-indigo-500 hover:to-violet-500
            text-white shadow-lg disabled:opacity-50"
          >
            <Send size={16} />

            {isSending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MessageBar = () => {
  const emojiRef = useRef();
  const { selectedChatType, selectedChatData, userInfo } = useStore();
  const socket = useSocket();
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [emojiDialog, setEmojiDialog] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        emojiDialog &&
        emojiRef.current &&
        !emojiRef.current.contains(e.target)
      ) {
        setEmojiDialog(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiDialog]);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
      });
    }
    if(selectedChatType==='channel'){
      socket.emit('sendChannelMessage',{
        sender:userInfo._id,
        content:message,
        recipient: null,
        messageType:'text',
        channelId: selectedChatData._id,
      })
    }

    setMessage("");
  };

  const sendFileMessage = async () => {
    try {
      if (!selectedFile) return;

      setIsSending(true);
      const formData = new FormData();

      formData.append("file", selectedFile);
      if (selectedChatType==='channel'){
        formData.append("channelId", selectedChatData._id);
        formData.append('members',JSON.stringify(selectedChatData.members));
      }
      else{
        formData.append("recipient", selectedChatData._id);
      }

      formData.append("messageType", "file");
      const result = await api.post(`${HOST}${SEND_FILE}`, formData);
      setSelectedFile(null);
      setPreviewUrl(null);

    } catch (err) {
      console.log(err);

      alert("Couldn't send file");
    } finally {
      setIsSending(false);
    }
  };

  const pickFile = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      // ALLOWED TYPES
      // const validTypes = [
      //   "image/jpeg",
      //   "image/png",
      //   "image/webp",
      //   "image/gif",
      //   "application/pdf",
      //   "video/mp4",
      // ];
      // 5MB LIMIT
      const maxSize = 5 * 1024 * 1024;
      // if (!validTypes.includes(file.type)) {
      //   alert("Only image, gif, pdf and mp4 video allowed");
      //   return;
      // }
      if (file.size > maxSize) {
        alert("File size should be under 5MB");

        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      console.log(err.message);
      alert("Couldn't select file");
    }
  };

  return (
    <>
      <div
        className="h-[12%] border-t-2 border-white mx-2
        flex justify-center items-center relative"
      >
        <label htmlFor="pickfile" className="flex items-center">
          <Paperclip
            className="absolute left-12
            hover:opacity-50 cursor-pointer"
            strokeWidth={2}
          />
        </label>

        <input
          className="hidden"
          type="file"
          id="pickfile"
          accept="
            image/png,
            image/jpeg,
            image/webp,
            image/gif,
            application/pdf,
            video/mp4
          "
          onChange={pickFile}
        />

        <Smile
          className="absolute left-24
          hover:opacity-50 cursor-pointer"
          strokeWidth={2}
          ref={emojiRef}
          onClick={() => setEmojiDialog((prev) => !prev)}
        />

        <SendHorizontal
          className="absolute right-14
          hover:opacity-50 cursor-pointer"
          strokeWidth={2}
          onClick={sendMessage}
        />

        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="bg-gray-800 h-[70%]
          rounded-2xl text-lg! w-[95%]
          pl-32 pr-28"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
      </div>

      {emojiDialog && (
        <div className="absolute bottom-20 right-64" ref={emojiRef}>
          <EmojiPicker
            theme="dark"
            onEmojiClick={(emojiData) =>
              setMessage((prev) => prev + emojiData.emoji)
            }
          />
        </div>
      )}

      <FilePreviewDialog
        isOpen={!!selectedFile}
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        sendFileMessage={sendFileMessage}
        isSending={isSending}
        onClose={() => {
          setSelectedFile(null);

          setPreviewUrl(null);
        }}
      />
    </>
  );
};

export default MessageBar;
