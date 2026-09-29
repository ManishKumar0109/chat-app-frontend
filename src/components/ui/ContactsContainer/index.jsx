import { NewDm } from "./components/NewDm";

import { LogOut } from "lucide-react";
import { useStore } from "../../../../store/index";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GET_CONTACTS, GET_CHANNELS } from "@/utils/constants";
import { api } from "@/lib/api-client";
import { HOST } from "@/utils/constants";
import ContactList from "./components/ContactList";
import NewChannel from "./components/NewChannel";
import ChannelList from "./components/ChannelList";

const ContactsContainer = () => {
  const { userInfo, setContacts, setChannels, selectedChatData } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const result = await api.get(`${HOST}${GET_CONTACTS}`);
        if (result?.data?.success) {
          setContacts(result.data.data);
        } else {
          console.log("no contacts");
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    const getChannels = async () => {
      try {
        const res = await api.get(`${HOST}${GET_CHANNELS}`);
        if (res?.data?.success) {
          setChannels(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getChannels();
    getContacts();
  }, []);

  const { email, username, image } = userInfo || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div
      className={`${
        selectedChatData ? "hidden md:flex" : "flex"
      } flex-col w-full sm:w-[40%] md:w-[35%] lg:w-[25%] h-full bg-gray-900 shadow-lg px-5 py-4`}
    >
      <div className="flex">
        <Logo />
      </div>
      <div className="flex flex-col gap-4 mt-4  h-full overflow-hidden">
        <div className="flex justify-between items-center  text-gray-400 text-sm sm:text-base font-medium">
          <span>DIRECT MESSAGES</span>
          <NewDm />
        </div>
        <div className="flex-1 overflow-hidden ">
          <ContactList />
        </div>

        <div className="border-t border-gray-700 " />

        <div className="text-gray-400 items-center flex justify-between text-sm sm:text-base font-medium">
          <span>CHANNELS</span>
          <NewChannel />
        </div>
        <div className="flex-1 overflow-hidden">
          <ChannelList />
        </div>
      </div>
      <div className="border-t border-gray-700 my-4"></div>
      <div className="flex-1"></div>
      <Footer
        email={email}
        image={image}
        username={username}
        navigate={navigate}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default ContactsContainer;

const Footer = ({ email, image, username, navigate, handleLogout }) => {
  return (
    <div className="flex items-center justify-between scale-[1.04] bg-gray-800 px-3 py-2 rounded-xl border border-gray-700">
      {/* PROFILE */}
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-3 text-left hover:opacity-80 transition"
      >
        <img
          src={image || "/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-600"
        />

        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-200">
            {username || "User"}
          </span>

          <span className="text-xs text-gray-400">{email}</span>
        </div>
      </button>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="text-gray-400 hover:text-red-400 transition"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
};
const Logo = () => {
  return (
    <div className="group flex items-center gap-3 py-2 select-none">
      {/* LOGO */}
      <div className="relative">
        {/* Glow */}

        <svg
          id="logo-38"
          width="82"
          height="36"
          viewBox="0 0 78 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_0_12px_rgba(168,85,247,0.45)] transition-transform duration-300 group-hover:scale-105"
        >
          <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="#8338ec" />
          <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="#975aed" />
          <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="#b388ff" />
        </svg>
      </div>

      {/* TEXT */}
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-semibold tracking-wide bg-linear-to-r from-purple-300 via-white to-purple-400 bg-clip-text text-transparent">
          Pulse
        </span>

        <span className="text-[10px] uppercase tracking-[0.35em] text-purple-400/70 ml-0.5">
          realtime chat
        </span>
      </div>
    </div>
  );
};
