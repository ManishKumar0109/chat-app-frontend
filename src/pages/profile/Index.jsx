import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { useStore } from "../../../store/index";

import { useEffect, useState } from "react";

import { api } from "@/lib/api-client";

import validator from "validator";

import {
  HOST,
  UPDATE_PROFILE,
  UPDATE_PROFILE_PICTURE,
} from "@/utils/constants";

import { Camera, ArrowLeft, Loader2 } from "lucide-react";

import { useNavigate } from "react-router-dom";

function AvatarComponent({ image, isUploadingImage }) {
  return (
    <div className="relative group">
      <Avatar className="h-36 w-36 border-4 border-gray-700 shadow-2xl">
        <AvatarImage
          src={image}
          alt=""
          className="object-cover transition-all duration-300"
        />

        <AvatarFallback className="text-3xl bg-linear-to-br from-purple-500 to-pink-500 text-white">
          PP
        </AvatarFallback>
      </Avatar>

      {/* OVERLAY */}
      <div
        className="
          absolute inset-0
          rounded-full
          bg-black/50
          opacity-0
          group-hover:opacity-100
          transition-all duration-300
          flex items-center justify-center
          cursor-pointer
        "
      >
        {isUploadingImage ? (
          <Loader2 className="text-white animate-spin" size={28} />
        ) : (
          <Camera className="text-white" size={28} />
        )}
      </div>
    </div>
  );
}

const Profile = () => {
  const { userInfo, setUserInfo } = useStore();

  const navigate = useNavigate();

  const [newUserName, setNewUserName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showError, setShowError] = useState(null);
  const [Email, setEmail] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setNewUserName(userInfo?.username || "");

      setNewImage(
        userInfo?.image ||
          "https://www.pngitem.com/pimgs/m/504-5040528_empty-profile-picture-png-transparent-png.png"
      );

      setEmail(userInfo?.email || "");
    }
  }, [userInfo]);

  const changeImage = async (e) => {
    try {
      setIsUploadingImage(true);

      const file = e.target.files[0];

      if (!file) return;

      if (
        !(
          ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
          file.size < 5 * 1024 * 1024
        )
      ) {
        alert("Choose valid image (max 5MB)");
        return;
      }

      // instant preview
      const preview = URL.createObjectURL(file);
      setNewImage(preview);

      const formData = new FormData();
      formData.append("image", file);

      const res = await api.patch(
        `${HOST}${UPDATE_PROFILE_PICTURE}`,
        formData
      );

      if (res.data.success) {
        setNewImage(res.data.data.image);
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const changeProfile = async () => {
    try {
      const payload = {};

      if (userInfo?.username !== newUserName) {
        if (!validator.isAlphanumeric(newUserName)) {
          setShowError("Invalid username");
          return;
        } else {
          payload.username = newUserName;
        }
      }

      if (newPassword) {
        if (!validator.isStrongPassword(newPassword)) {
          setShowError("Weak password");
          return;
        } else {
          payload.password = newPassword;
        }
      }

      if (Object.keys(payload).length === 0) {
        navigate("/chat");
        return;
      }

      const res = await api.patch(`${HOST}${UPDATE_PROFILE}`, payload);

      if (res.data.success) {
        setUserInfo(res.data.user);
        navigate("/chat");
      }
    } catch (err) {
      setShowError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 text-white">
      <div
        className="
          w-full max-w-md
          bg-[#1e293b]
          border border-gray-700
          rounded-3xl
          shadow-2xl
          p-7
          backdrop-blur-md
        "
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-gray-700 transition-all"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-2xl font-bold tracking-wide">
            Profile
          </h1>

          <div className="w-9" />
        </div>

        {/* AVATAR */}
        <div className="flex justify-center mb-10">
          <label
            htmlFor="profilepicture"
            className={
              isUploadingImage
                ? "pointer-events-none opacity-70"
                : "cursor-pointer"
            }
          >
            <AvatarComponent
              image={newImage}
              isUploadingImage={isUploadingImage}
            />
          </label>

          <input
            type="file"
            id="profilepicture"
            className="hidden"
            onChange={changeImage}
            disabled={isUploadingImage}
          />
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          <Input
            value={Email}
            disabled
            placeholder="Email"
            className="
              h-12
              bg-gray-800
              border-gray-700
              text-gray-400
              rounded-xl
            "
          />

          <Input
            value={newUserName}
            placeholder="Username"
            onChange={(e) => {
              setNewUserName(e.target.value);
              setShowError(null);
            }}
            className="
              h-12
              bg-gray-800
              border-gray-700
              rounded-xl
              focus-visible:ring-2
              focus-visible:ring-purple-500
            "
          />

          <Input
            value={newPassword}
            type="password"
            placeholder="New Password"
            onChange={(e) => {
              setNewPassword(e.target.value);
              setShowError(null);
            }}
            className="
              h-12
              bg-gray-800
              border-gray-700
              rounded-xl
              focus-visible:ring-2
              focus-visible:ring-purple-500
            "
          />
        </div>

        {/* ERROR */}
        {showError && (
          <p className="text-red-400 text-sm text-center mt-4">
            {showError}
          </p>
        )}

        {/* BUTTON */}
        <Button
          disabled={isUploadingImage}
          onClick={changeProfile}
          className="
            w-full
            mt-8
            h-12
            rounded-xl
            text-md
            font-semibold
            bg-linear-to-r
            from-purple-600
            to-pink-600
            hover:opacity-90
            transition-all
            duration-300
            shadow-lg
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {isUploadingImage ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Uploading Image...
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Profile;