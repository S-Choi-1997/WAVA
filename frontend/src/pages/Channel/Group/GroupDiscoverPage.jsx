import { useEffect, useState } from "react";
import FeedSearchBar from "../../../components/Channel/feed/FeedSearchbar";
import { groupChannelAPI } from "../../../api/groupChannelAPI";
import ChannelRoomItem from "../../../components/Channel/group/ChannelRoomItem";

function GroupDiscoverPage() {
  const [groupList, setGroupList] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const resp = await groupChannelAPI.getAllChannelList();
      console.log(resp);
      if (resp) {
        setGroupList(resp.data);
      }
    };
    getData();
  }, []);
  const searchHandle = async (searchText) => {};
  return (
    <div className="flex flex-col h-full">
      <FeedSearchBar searchHandle={searchHandle} />

      <div className="flex-grow overflow-y-auto flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
          {groupList.map((g) => (
            <ChannelRoomItem key={g.channelId} roomInfo={g} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GroupDiscoverPage;
