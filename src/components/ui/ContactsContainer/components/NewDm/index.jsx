import { Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { HOST, SEARCH_CONTACTS } from "@/utils/constants";
import { api } from "@/lib/api-client";
import { useStore } from "../../../../../../store/index";

export const NewDm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const {
    setSelectedChatData,
    setSelectedChatMessages,
    setSelectedChatType,
  } = useStore();

  const setChat = (user) => {

    setOpenDialog(false);
    setSelectedChatType("contact");
    setSelectedChatData(user);
    setSelectedChatMessages([]);
    setSearch("");
    setSearchResult([]);

  };

  // SEARCH CONTACTS
  useEffect(() => {
    if (search.trim().length < 2) {
      setSearchResult([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `${HOST}${SEARCH_CONTACTS}?query=${encodeURIComponent(search)}`
        );

        if (res?.data?.success) {
          setSearchResult(res.data.data);
        }
      } catch (error) {
        console.error(
          "Search contacts error:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);

        if (!open) {
          setSearch("");
          setSearchResult([]);
        }
      }}
    >
      <DialogTrigger>
        <button className="bg-transparent p-1 hover:opacity-50">
          <Plus />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-gray-800 w-full max-w-md sm:max-w-lg rounded-lg px-3!">
        <DialogHeader>
          <DialogTitle className="text-white">
            Search new contacts
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* SEARCH INPUT */}
          <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-700">
            <Input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search contacts..."
              className="flex-1 bg-gray-800 border-none text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md"
            />

            {loading && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>

          {/* RESULTS */}
          <ScrollArea className="h-64 sm:h-72 w-full rounded-sm border p-2">
            {search.trim().length < 2 ? (
              <p className="text-gray-400 text-center mt-4">
                Type at least 2 characters
              </p>
            ) : searchResult.length === 0 &&
              !loading ? (
              <p className="text-gray-400 text-center mt-4">
                No users found
              </p>
            ) : (
              searchResult.map((user) => (
                <div
                  onClick={() => {
                    setChat(user);
                  }}
                  key={user._id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-900 rounded-md cursor-pointer transition"
                >
                  {/* PROFILE IMAGE */}
                  <img
                    src={user.image}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  {/* USER INFO */}
                  <div className="flex flex-col">
                    <span className="text-white font-medium">
                      {user.username}
                    </span>

                    <span className="text-gray-400 text-sm">
                      {user.email}
                    </span>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};