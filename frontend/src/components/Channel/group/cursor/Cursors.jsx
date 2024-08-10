import {React, useRef, useState, useEffect, useCallback } from "react";
import { Cursor } from "./Cursor";
import { useUsers } from "y-presence";
import { THROTTLE } from "./constants";
import throttle from "lodash.throttle";
import * as Y from "yjs";
import { Stomp } from "@stomp/stompjs";
import { WebsocketProvider } from "y-websocket";


const Cursors = (props) => {
  const channelId = props.channelId;
  const map = props.map;
  const [users, setUsers] = useState({});
  const socketUrl = process.env.REACT_APP_CURSOR_WEBSOCKET_ADDRESS;
  const [isConnected, setIsConnected] = useState(false);
  const [nickName, setNickName] = useState("");
  const stompClient = useRef(null);

  const getUserNickName = () => {
    const userObjectString = localStorage.getItem("userStorage");
    const userObject = JSON.parse(userObjectString);
    setNickName(userObject.state.userInfo.nickName);
  };

  useEffect(() => {

    getUserNickName();

    const socket = new WebSocket(socketUrl);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect(
      { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
      () => {
        setIsConnected(true)
        stompClient.current.subscribe(
          `/sub/cursorroom/${channelId}`,
          (message) => {
            const cursorData = JSON.parse(message.body);
            setUsers(prevUsers => ({
              ...prevUsers,
              [cursorData.nickName]: cursorData
            }));
          });
      },
      (error) => { }
    );

    const handlePointerMove = throttle((e) => {
      if (isConnected && nickName && map) {

        const latlng = map.getProjection().coordsFromPoint(new window.kakao.maps.Point(e.clientX, e.clientY));
        const cursorPosition = { channelId, nickName, x: latlng.getLat(), y: latlng.getLng() };
        stompClient.current.send(
          `/pub/position`,
          { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
          JSON.stringify(cursorPosition));
      }
    }, 100);

    // getUserNickName();

    window.addEventListener('mousemove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      stompClient.current.disconnect();
    };
  }, [nickName, socketUrl, channelId, isConnected, map]);

  const renderCursors = useCallback(() => {
    return Object.keys(users).map((key) => {
      if (key === nickName) return null;
      const { x, y } = users[key];
      const position = new window.kakao.maps.LatLng(x, y);
      const pixelPosition = map.getProjection().pointFromCoords(position);
      return <Cursor key={key} color="blue" point={[pixelPosition.x, pixelPosition.y]} nickName={key} />;
    });
  }, [users, nickName]);

  return (
    <div className="cursors" style={{ position: 'relative', zIndex: 10 }}>
      {renderCursors()}
    </div>
  );
};

export default Cursors;


// export function Cursors() {
//   const socketUrl = process.env.REACT_APP_CURSOR_WEBSOCKET_ADDRESS;
//   const serverUrl = socketUrl.substring(0, 25);
//   const room = socketUrl.substring(25);
  
//   const ydoc = useMemo(() => new Y.Doc(), [])
  
//   const provider = useMemo(
//     () => new WebsocketProvider(serverUrl, room, ydoc),
//     [socketUrl, room, ydoc]
//   );
  
//   const awareness = provider.awareness;
  
//   const users = useUsers(awareness, (state) => state);

//   // When the user moves their pointer, update their presence
//   const handlePointMove = throttle((e) => {
//     awareness.setLocalStateField("point", [e.clientX, e.clientY]);
//   }, THROTTLE);

//   useEffect(() => {
//     // Clean up the provider when the component unmounts
//     return () => {
//       provider.destroy();
//       ydoc.destroy();
//     };
//   }, [provider, ydoc]);

//   return (
//     <div className="cursors" onPointerMove={handlePointMove}>
//       {Array.from(users.entries()).map(([key, value]) => {
//         if (key === awareness.clientID) return null;
//         return <Cursor key={key} color={value.color} point={value.point} />;
//       })}
//     </div>
//   );
// }

