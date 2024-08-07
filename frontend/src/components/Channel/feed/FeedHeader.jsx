import React, { useState } from "react";
import { Camera, Edit } from "lucide-react";
import FollowDrawer from "./FollowDrawer";
import useDeviceStore from "../../../store/deviceStore";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const FeedHeader = ({ openCreateDrawer, userId, setUserInfo, userInfo }) => {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isFollowDrawerOpen, setIsFollowDrawerOpen] = useState(false);
  const [followDrawerTab, setFollowDrawerTab] = useState("followers");

  const handleNameChange = (e) =>
    setUserInfo((state) => ({ ...state, nickname: e.target.value }));

  const handleBioChange = (e) =>
    setUserInfo((state) => ({ ...state, description: e.target.value }));

  const handleNameSubmit = () => {
    setIsEditingName(false);
  };

  const handleBioSubmit = () => {
    setIsEditingBio(false);
  };

  const handleProfilePicChange = (e) => {
    console.log("Profile picture change requested", e.target.files[0]);
  };

  const openFollowDrawer = (tab) => {
    setFollowDrawerTab(tab);
    setIsFollowDrawerOpen(true);
  };

  return (
    <div className={isMobile ? "p-4" : "p-6"}>
      <div
        className={`flex ${isMobile ? "flex-col items-center" : "items-start"}`}
      >
        <div className={`relative ${isMobile ? "mb-4" : "mr-6"}`}>
          {!userInfo ? (
            <div
              className="
          rounded-full w-24 h-24 mx-auto bg-gray-200 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
            />
          ) : userInfo?.profileImage ? (
            <img
              src={userInfo?.profileImage}
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover shadow-md"
            />
          ) : (
            <UserCircleIcon className="w-24 h-24 rounded-full shadow-md" />
          )}
          <label
            htmlFor="profile-pic-upload"
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer"
          >
            <Camera size={20} />
          </label>
          <input
            id="profile-pic-upload"
            type="file"
            className="hidden"
            onChange={handleProfilePicChange}
            accept="image/*"
          />
        </div>
        <div className={`flex-1 ${isMobile ? "w-full" : ""}`}>
          <div
            className={`flex ${
              isMobile
                ? "flex-col items-center"
                : "justify-between items-center"
            } mb-2`}
          >
            <div className={`flex items-center ${isMobile ? "mb-2" : ""}`}>
              <h1
                className={`${
                  isMobile ? "text-xl" : "text-2xl"
                } font-bold mr-2`}
              >
                {userInfo?.nickName || " "}
              </h1>
            </div>
            <button
              onClick={openCreateDrawer}
              className={`px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors ${
                isMobile ? "w-full" : ""
              }`}
            >
              글 작성
            </button>
          </div>
          <div className="mb-4">
            {isEditingBio ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={userInfo?.description}
                  onChange={handleBioChange}
                  className="flex-grow mr-2 p-1 border rounded"
                />
                <button
                  onClick={handleBioSubmit}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                >
                  저장
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-gray-700 mr-2">
                  {userInfo?.description || " "}
                </p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit size={16} />
                </button>
              </div>
            )}
          </div>
          <div
            className={`text-sm text-gray-600 flex ${
              isMobile ? "justify-center" : "justify-start"
            }`}
          >
            <button
              onClick={() => openFollowDrawer("following")}
              className="mr-4 hover:underline"
            >
              팔로잉{" "}
              <span className="font-semibold">
                {Number.isInteger(userInfo?.follow) ? userInfo?.follow : "-"}
              </span>
            </button>
            <button
              onClick={() => openFollowDrawer("followers")}
              className="mr-4 hover:underline"
            >
              팔로워{" "}
              <span className="font-semibold">
                {Number.isInteger(userInfo?.follow) ? userInfo?.follow : "-"}
              </span>
            </button>
            <span>
              게시물{" "}
              <span className="font-semibold">
                {Number.isInteger(userInfo?.feedCount)
                  ? userInfo?.feedCount
                  : "-"}
              </span>
            </span>
          </div>
        </div>
      </div>
      <FollowDrawer
        isOpen={isFollowDrawerOpen}
        onClose={() => setIsFollowDrawerOpen(false)}
        userId={userId}
        initialTab={followDrawerTab}
      />
    </div>
  );
};

export default FeedHeader;
