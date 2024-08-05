// // userId === feedId => 수정버튼과 글 작성 버튼 숨기기
// import React, { useState } from "react";
// import { Camera, Edit } from "lucide-react";

// const FeedHeader = ({
//   openCreateDrawer,
//   initialName = "전지훈",
//   initialBio = "전지훈의 개인 채널입니다.",
// }) => {
//   const [name, setName] = useState(initialName);
//   const [bio, setBio] = useState(initialBio);
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [isEditingBio, setIsEditingBio] = useState(false);

//   const handleNameChange = (e) => setName(e.target.value);
//   const handleBioChange = (e) => setBio(e.target.value);

//   const handleNameSubmit = () => {
//     console.log("Updated name:", name);
//     setIsEditingName(false);
//   };

//   const handleBioSubmit = () => {
//     console.log("Updated bio:", bio);
//     setIsEditingBio(false);
//   };

//   const handleProfilePicChange = (e) => {
//     console.log("Profile picture change requested", e.target.files[0]);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex items-start">
//         <div className="mr-6 relative">
//           <img
//             src="https://fastly.picsum.photos/id/184/250/250.jpg?hmac=6ULGFzE9ycGK0cgb3NB9AJG6Jt0_w_Ez-QWFZpWEFRI"
//             alt="Profile"
//             className="rounded-full w-24 h-24 object-cover shadow-md"
//           />
//           <label
//             htmlFor="profile-pic-upload"
//             className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer"
//           >
//             <Camera size={20} />
//           </label>
//           <input
//             id="profile-pic-upload"
//             type="file"
//             className="hidden"
//             onChange={handleProfilePicChange}
//             accept="image/*"
//           />
//         </div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex items-center">
//               {isEditingName ? (
//                 <div className="flex items-center">
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={handleNameChange}
//                     className="text-2xl font-bold mr-2 p-1 border rounded"
//                   />
//                   <button
//                     onClick={handleNameSubmit}
//                     className="px-2 py-1 bg-green-500 text-white text-xs rounded"
//                   >
//                     저장
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <h1 className="text-2xl font-bold mr-2">{name}</h1>
//                   <button
//                     onClick={() => setIsEditingName(true)}
//                     className="text-gray-500 hover:text-gray-700"
//                   >
//                     <Edit size={16} />
//                   </button>
//                 </>
//               )}
//             </div>
//             <button
//               onClick={openCreateDrawer}
//               className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
//             >
//               글 작성
//             </button>
//           </div>
//           <div className="mb-4">
//             {isEditingBio ? (
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   value={bio}
//                   onChange={handleBioChange}
//                   className="flex-grow mr-2 p-1 border rounded"
//                 />
//                 <button
//                   onClick={handleBioSubmit}
//                   className="px-2 py-1 bg-green-500 text-white text-xs rounded"
//                 >
//                   저장
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center">
//                 <p className="text-gray-700 mr-2">{bio}</p>
//                 <button
//                   onClick={() => setIsEditingBio(true)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <Edit size={16} />
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="text-sm text-gray-600">
//             <span className="mr-4">
//               팔로잉 <span className="font-semibold">128</span>
//             </span>
//             <span className="mr-4">
//               팔로워 <span className="font-semibold">154</span>
//             </span>
//             <span>
//               게시물 <span className="font-semibold">35</span>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeedHeader;
// userId === feedId => 수정버튼과 글 작성 버튼 숨기기

import React, { useState } from "react";
import { Camera, Edit } from "lucide-react";
import FollowDrawer from "./FollowDrawer";
import useDeviceStore from "../../../store/deviceStore";

const FeedHeader = ({
  openCreateDrawer,
  initialName = "전지훈",
  initialBio = "전지훈의 개인 채널입니다.",
  userId,
  setUserInfo,
  userInfo,
}) => {
  const isMobile = useDeviceStore((state) => state.isMobile);
  // const [name, setName] = useState(userInfo?.nickname);
  // const [bio, setBio] = useState(userInfo?.description);
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
          {!userInfo && (
            <div
              className="
          rounded-full w-24 h-24 mx-auto bg-gray-200 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
            />
          )}
          {userInfo?.profileImage && (
            <img
              src={userInfo?.profileImage}
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover shadow-md"
            />
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
              {isEditingName ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={userInfo?.nickname}
                    onChange={handleNameChange}
                    className={`${
                      isMobile ? "text-xl" : "text-2xl"
                    } font-bold mr-2 p-1 border rounded`}
                  />
                  <button
                    onClick={handleNameSubmit}
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                  >
                    저장
                  </button>
                </div>
              ) : (
                <>
                  <h1
                    className={`${
                      isMobile ? "text-xl" : "text-2xl"
                    } font-bold mr-2`}
                  >
                    {userInfo?.nickname || " "}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit size={16} />
                  </button>
                </>
              )}
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
              <span className="font-semibold">{userInfo?.follow || "-"}</span>
            </button>
            <button
              onClick={() => openFollowDrawer("followers")}
              className="mr-4 hover:underline"
            >
              팔로워{" "}
              <span className="font-semibold">{userInfo?.follower || "-"}</span>
            </button>
            <span>
              게시물{" "}
              <span className="font-semibold">
                {userInfo?.feedCount || "-"}
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
