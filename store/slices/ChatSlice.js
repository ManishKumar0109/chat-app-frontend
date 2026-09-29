export const ChatSlice = (set, get) => ({
  selectedChatType: undefined, // contact vs channel
  selectedChatData: undefined, //complete data of user
  selectedChatMessages: [],
  
  contacts: [],
  channels:[],

  setChannels:(channels)=>set({channels:channels}),
  addChannel:(channel)=>{
    const channels=get().channels;
    set({channels:[...channels,channel]})
  }, 

  setSelectedChatType: (value) => set({ selectedChatType: value }),
  setSelectedChatData: (value) => set({ selectedChatData: value }),
  setSelectedChatMessages: (value) => set({ selectedChatMessages: value }),

  closedChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [], // ✅ always array
    }),

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages || [];
    const selectedChatType = get().selectedChatType;

    const exists = selectedChatMessages.some((msg) => msg._id === message._id);
    if (exists) return; // ✅ prevent duplicate
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
setContacts: (contacts) => {
    set({ contacts: contacts });
  },
});
