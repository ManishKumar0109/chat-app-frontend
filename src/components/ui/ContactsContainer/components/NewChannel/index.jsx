import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search, Users, X, Plus } from "lucide-react";
import { HOST, SEARCH_CONTACTS ,CREATE_CHANNEL } from "@/utils/constants";
import { api } from "@/lib/api-client";
import { useStore } from "../../../../../../store/index";

export default function NewChannel() {
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const {addChannel}=useStore()



  const [channelName, setChannelName] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // SEARCH USERS
  useEffect(() => {
    if (search.trim().length < 2) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `${HOST}${SEARCH_CONTACTS}?query=${encodeURIComponent(search)}`,
        );

        if (res?.data?.success) {
          setUsers(res.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const toggleUser = (user) => {
    const exists = selectedUsers.find((u) => u._id === user._id);

    if (exists) {
      setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const removeUser = (id) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const isSelected = (id) => {
    return selectedUsers.find((u) => u._id === id);
  };

  const createGroup = async () => {
    try {
      const members = selectedUsers.map((user) => user._id);

      const res = await api.post(`${HOST}${CREATE_CHANNEL}`, {
        name: channelName,
        members,
      });

      if (res?.data?.success) {
        addChannel(res.data.data)
        console.log(res.data.data)
        setIsShow(false);
        setChannelName("");
        setSelectedUsers([]);
        setSearch("");
        setUsers([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={isShow}
      onOpenChange={(open) => {
        setIsShow(open);

        if (!open) {
          setChannelName("");

          setSearch("");

          setUsers([]);

          setSelectedUsers([]);
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
          <DialogTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Create Group
          </DialogTitle>
        </DialogHeader>

        {/* SEARCH */}
        <div className="flex flex-col gap-4 mt-2">
          {/* CHANNEL NAME */}
          <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-700">
            <Input
              placeholder="Channel name..."
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="flex-1 bg-gray-800 border-none text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md"
            />
          </div>

          {/* SEARCH USERS */}
          <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg border border-gray-700">
            <Search className="h-4 w-4 text-gray-400" />

            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-gray-800 border-none text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md"
            />

            {loading && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>

          {/* SELECTED USERS */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
                >
                  {user.username}

                  <button onClick={() => removeUser(user._id)}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* USERS LIST */}
          <div className="h-64 sm:h-72 w-full rounded-sm border p-2 overflow-y-auto">
            {search.trim().length < 2 ? (
              <p className="text-gray-400 text-center mt-4">
                Type at least 2 characters
              </p>
            ) : loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user)}
                  className={`flex items-center justify-between gap-3 p-2 rounded-md cursor-pointer transition hover:bg-gray-900
                    ${isSelected(user._id) ? "bg-gray-900" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* PROFILE IMAGE */}
                    <Avatar>
                      <AvatarImage src={user.image} />

                      <AvatarFallback>
                        {user.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

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

                  {isSelected(user._id) && (
                    <span className="text-sm text-purple-400">Selected</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center mt-4">No users found</p>
            )}
          </div>

          {/* CREATE BUTTON */}
          <Button
            disabled={selectedUsers.length < 2 || !channelName.trim()}
            onClick={createGroup}
            className="w-full"
          >
            Create Group ({selectedUsers.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
