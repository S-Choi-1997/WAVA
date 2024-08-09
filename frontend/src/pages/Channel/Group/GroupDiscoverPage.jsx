import { useEffect, useState } from "react";
import FeedSearchBar from "../../../components/Channel/feed/FeedSearchbar";
import { groupChannelAPI } from "../../../api/groupChannelAPI";
import ChannelRoomItem from "../../../components/Channel/group/ChannelRoomItem";
import GroupInfoModal from "../../../components/Channel/group/GroupInfoModal";
import CustomModal from "../../../components/common/customModal";

function GroupDiscoverPage() {
  const [groupList, setGroupList] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const resp = await groupChannelAPI.getAllChannelList();
      if (resp) {
        setGroupList(resp.data);
      }
    };
    getData();
  }, []);
  const searchHandle = async (searchText) => {};

  // 그룹 상세보기 포탈 오픈
  const handleChannelPortalOpen = (id) => {
    setSelectedGroupId(id);
    setDetailOpen(true);
  };

  // 그룹 상세보기 포탈 닫기
  const handleChannelPortalClose = () => {
    setSelectedGroupId(null);
    setDetailOpen(false);
  };
  return (
    <>
      <div className="flex flex-col h-full">
        <FeedSearchBar searchHandle={searchHandle} />

        <div className="flex-grow overflow-y-auto flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
            {groupList.map((g) => (
              <ChannelRoomItem
                onClick={() => handleChannelPortalOpen(g.channelId)}
                key={g.channelId}
                roomInfo={g}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 그룹 상세보기 모달 */}
      <CustomModal
        styles={"backdrop-blur-sm"}
        isOpen={detailOpen}
        onClose={handleChannelPortalClose}
      >
        <GroupInfoModal
          onClose={handleChannelPortalClose}
          groupId={selectedGroupId}
        />
      </CustomModal>
    </>
  );
}

export default GroupDiscoverPage;
