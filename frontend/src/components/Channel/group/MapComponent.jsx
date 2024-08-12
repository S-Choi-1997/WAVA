import React, { useEffect, useRef, useState, useCallback } from "react";
import Swal from "sweetalert2";
import Cursors from "./cursor/Cursors";
// import { useUsers } from "y-presence";
// import { awareness } from "./cursor/y";
// import { USER_COLORS } from "./cursor/constants";

const MapComponent = (props) => {
  const mapContainer = useRef(null);
  const cursorsRef = useRef(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [places, setPlaces] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [lastSearchBounds, setLastSearchBounds] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [customMarkers, setCustomMarkers] = useState([]);
  const infowindow = useRef(null);
  const { selectedUserNickName, channelId, setSelectedUserNickName } = props;

  // 특정 사용자의 커서 위치로 지도 center를 이동
  // const handleFollowUser = () => {
  //   const cursors = cursorsRef.current.getCursorMarkers();
  //   if (selectedUser && map && cursors[selectedUser]) {
  //     const position = cursors[selectedUser].getPosition();
  //     map.panTo(position); // 선택된 사용자의 위치로 지도 이동
  //   } else {
  //     Swal.fire({
  //       title: "사용자를 선택해주세요",
  //       icon: "warning",
  //     });
  //   }
  // };
  useEffect(() => {
    if (selectedUserNickName && cursorsRef.current) {
      const cursors = cursorsRef.current.getCursorMarkers();
      const selectedCursor = cursors[selectedUserNickName];

      if (selectedCursor && map) {
        const position = selectedCursor.getPosition();
        map.panTo(position); // 선택된 사용자의 커서 위치로 지도 이동
      } else {
        Swal.fire({
          title: "해당 사용자의 커서 위치를 찾을 수 없습니다.",
          icon: "warning",
        });
      }

      setSelectedUserNickName(null);
    }
  }, [selectedUserNickName, map, setSelectedUserNickName]);

  useEffect(() => {
    let isMounted = true;
    const script = document.createElement("script");
    script.async = true;
    const apiKey = process.env.REACT_APP_KAKAO_MAPS_API_KEY;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,drawing&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (isMounted) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const mapOption = {
                  center: new window.kakao.maps.LatLng(lat, lng),
                  level: 3,
                };
                const createdMap = new window.kakao.maps.Map(
                  mapContainer.current,
                  mapOption
                );
                setMap(createdMap);
                initializeDrawingManager(createdMap);
                initializeClickEventListener(createdMap);
              },
              (error) => {
                console.error("Error fetching current location:", error);
                const defaultCenter = new window.kakao.maps.LatLng(
                  37.566826,
                  126.9786567
                );
                const mapOption = {
                  center: defaultCenter,
                  level: 3,
                };
                const createdMap = new window.kakao.maps.Map(
                  mapContainer.current,
                  mapOption
                );
                setMap(createdMap);
                initializeDrawingManager(createdMap);
                initializeClickEventListener(createdMap);
              }
            );
          } else {
            const defaultCenter = new window.kakao.maps.LatLng(
              37.566826,
              126.9786567
            );
            const mapOption = {
              center: defaultCenter,
              level: 3,
            };
            const createdMap = new window.kakao.maps.Map(
              mapContainer.current,
              mapOption
            );
            setMap(createdMap);
            initializeDrawingManager(createdMap);
            initializeClickEventListener(createdMap);
          }

          const initializeDrawingManager = (createdMap) => {
            infowindow.current = new window.kakao.maps.InfoWindow({
              zIndex: 1,
              removable: true,
            });
            const manager = new window.kakao.maps.drawing.DrawingManager({
              map: createdMap,
              drawingMode: [
                window.kakao.maps.drawing.OverlayType.MARKER,
                window.kakao.maps.drawing.OverlayType.POLYLINE,
                window.kakao.maps.drawing.OverlayType.RECTANGLE,
                window.kakao.maps.drawing.OverlayType.CIRCLE,
                window.kakao.maps.drawing.OverlayType.POLYGON,
              ],
              guideTooltip: ["draw", "drag", "edit"],
              markerOptions: {
                draggable: true,
              },
              polylineOptions: {
                draggable: true,
                removable: true,
                editable: true,
              },
              rectangleOptions: {
                draggable: true,
                removable: true,
                editable: true,
              },
              circleOptions: {
                draggable: true,
                removable: true,
                editable: true,
              },
              polygonOptions: {
                draggable: true,
                removable: true,
                editable: true,
              },
            });
            setDrawingManager(manager);

            // 마커 생성 완료 이벤트 리스너
            window.kakao.maps.event.addListener(
              manager,
              "drawend",
              function (data) {
                const overlay = data.target;
                const overlayType = data.overlayType;
                if (
                  overlayType === window.kakao.maps.drawing.OverlayType.MARKER
                ) {
                  handleMarkerCreated(overlay);
                } else {
                  console.log(`Overlay created, but not handled:`, overlayType);
                }
              }
            );
          };
        }

        const initializeClickEventListener = (createdMap) => {
          window.kakao.maps.event.addListener(
            createdMap,
            "click",
            function (mouseEvent) {
              // 클릭한 위도, 경도 정보를 가져옵니다
              var latlng = mouseEvent.latLng;

              var message =
                "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
              message += "경도는 " + latlng.getLng() + " 입니다";

              console.log(message);
            }
          );
        };
      });
    };

    return () => {
      isMounted = false;
      // kakaomap의 script를 제거하는게 비동기적이라서, 해당 함수의 제거가 완료되지 않은 채로
      // map컴포넌트가 사라지면 남아있는 함수의 잔존 동작들이(커서, 마커 등)
      // map을 참조해서 일어나는 에러였던거 같습니다.
      // 그래서 해당 스크립트와 생명주기를 같이하는 flag를 설정해서 의존성을 만들고,
      // flag가 있을 때에만 스크립트가 map을 참조하도록 설정
      document.head.removeChild(script);
    };
  }, [channelId]);

  const handleMarkerCreated = useCallback((marker) => {
    Swal.fire({
      title: "마커 정보 입력",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="제목">' +
        '<input id="swal-input2" class="swal2-input" placeholder="설명">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: document.getElementById("swal-input1").value,
          description: document.getElementById("swal-input2").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newCustomMarker = {
          marker: marker,
          info: result.value,
        };
        setCustomMarkers((prev) => [...prev, newCustomMarker]);

        // 마커 이벤트 리스너 추가
        addMarkerEventListeners(newCustomMarker);
      } else {
        // 사용자가 취소한 경우 마커 제거
        marker.setMap(null);
      }
    });
  }, []);

  const addMarkerEventListeners = useCallback((customMarker) => {
    const { marker } = customMarker;

    window.kakao.maps.event.addListener(marker, "click", () => {
      displayCustomMarkerInfo(customMarker);
    });

    window.kakao.maps.event.addListener(marker, "mouseover", () => {
      displayCustomMarkerInfoWindow(customMarker);
    });

    window.kakao.maps.event.addListener(marker, "mouseout", () => {
      infowindow.current.close();
    });

    window.kakao.maps.event.addListener(marker, "rightclick", () => {
      deleteCustomMarker(customMarker);
    });
  }, []);

  const deleteCustomMarker = useCallback((customMarker) => {
    Swal.fire({
      title: "마커 삭제",
      text: "이 마커를 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        customMarker.marker.setMap(null);
        setCustomMarkers((prev) => prev.filter((cm) => cm !== customMarker));
        Swal.fire("", "마커가 삭제되었습니다.", "success");
      }
    });
  }, []);

  const displayCustomMarkerInfo = useCallback((customMarker) => {
    Swal.fire({
      title: customMarker.info.title,
      text: customMarker.info.description,
      icon: "info",
    });
  }, []);

  const displayCustomMarkerInfoWindow = useCallback(
    (customMarker) => {
      const content = `<div style="padding:5px;font-size:12px;">
        <strong>${customMarker.info.title}</strong><br>
        ${customMarker.info.description}
      </div>`;

      infowindow.current.setContent(content);
      infowindow.current.open(map, customMarker.marker);
    },
    [map]
  );

  const handleDrawingModeChange = useCallback(
    (mode) => {
      if (drawingManager) {
        drawingManager.cancel();
        drawingManager.select(window.kakao.maps.drawing.OverlayType[mode]);
      }
    },
    [drawingManager]
  );

  const searchPlaces = useCallback(() => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();

    if (!keyword.trim()) {
      setPlaces([]);
      return;
    }

    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);

        const bounds = new window.kakao.maps.LatLngBounds();
        const newMarkers = [];

        data.forEach((place, i) => {
          const marker = displayMarker(place);
          newMarkers.push(marker);
          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
        });

        setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
        map.setBounds(bounds);
        setLastSearchBounds(bounds);
      } else {
        setPlaces([]);
        Swal.fire({
          title: "검색 결과가 없습니다.",
          icon: "warning",
        });
      }
    });
  }, [map, keyword]);

  const displayMarker = useCallback(
    (place) => {
      if (!map) return null;

      const marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x),
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        infowindow.current.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            "</div>"
        );
        infowindow.current.open(map, marker);
      });

      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        displayInfowindow(marker, place.place_name);
      });

      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindow.current.close();
      });

      return marker;
    },
    [map]
  );

  const displayInfowindow = (marker, title) => {
    infowindow.current.setContent(
      '<div style="padding:5px;font-size:12px;">' + title + "</div>"
    );
    infowindow.current.open(map, marker);
  };

  useEffect(() => {
    if (map && lastSearchBounds) {
      map.setBounds(lastSearchBounds);
    }
  }, [map, lastSearchBounds]);

  const resetMap = useCallback(() => {
    if (!map) return;

    // 모든 검색 결과 마커 제거
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    // 검색 결과 초기화
    setPlaces([]);
    setKeyword("");

    // 마지막 검색 경계 초기화
    setLastSearchBounds(null);

    // 현재 지도 뷰는 유지
  }, [map, markers]);

  // 검색 결과 목록에 마우스 오버 이벤트 추가
  const handleMouseOverPlaceItem = useCallback(
    (index) => {
      const marker = markers[index];
      if (marker) {
        const position = marker.getPosition();
        map.panTo(position);
        displayInfowindow(marker, places[index].place_name);
      }
    },
    [map, markers, places]
  );

  return (
    <div className="flex flex-col h-full relative ">
      <div className="w-3/4 absolute top-0 left-0 p-4 bg-white bg-opacity-60 z-10">
        <div className="flex space-x-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색할 키워드를 입력하세요"
            className="p-2 border rounded flex-grow focus:bg-opacity-100"
          />
          <button
            onClick={searchPlaces}
            className="p-2 bg-mainBlue text-white rounded hover:bg-blue-600"
          >
            검색
          </button>
          <button
            onClick={resetMap}
            className="p-2 bg-gray-600 text-white rounded hover:bg-red-600"
          >
            초기화
          </button>
        </div>
        <div className="p-2 flex space-x-2 mt-2">
          <button
            onClick={() => handleDrawingModeChange("MARKER")}
            className="p-2 bg-gray-500 text-white rounded hover:bg-toolBtn"
          >
            마커
          </button>
          <button
            onClick={() => handleDrawingModeChange("POLYLINE")}
            className="p-2 bg-gray-500 text-white rounded hover:bg-toolBtn"
          >
            선
          </button>
          <button
            onClick={() => handleDrawingModeChange("RECTANGLE")}
            className="p-2 bg-gray-500 text-white rounded hover:bg-toolBtn"
          >
            사각형
          </button>
          <button
            onClick={() => handleDrawingModeChange("CIRCLE")}
            className="p-2 bg-gray-500 text-white rounded hover:bg-toolBtn"
          >
            원
          </button>
          <button
            onClick={() => handleDrawingModeChange("POLYGON")}
            className="p-2 bg-gray-500 text-white rounded hover:bg-toolBtn"
          >
            다각형
          </button>
        </div>
        {/* <div className="p-2 flex space-x-2 mt-2">
          <input
            type="text"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            placeholder="사용자 닉네임 입력"
            className="p-2 border rounded flex-grow focus:bg-opacity-100"
          />
          <button
            onClick={handleFollowUser}
            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            사용자 따라가기
          </button>
        </div> */}
      </div>
      <div ref={mapContainer} className="flex-grow h-screen">
        {map && <Cursors ref={cursorsRef} channelId={channelId} map={map} />}
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white bg-opacity-60 z-10 max-h-40 overflow-y-auto">
        <ul>
          {places.map((place, index) => (
            <li
              id={`place-item-${index}`}
              key={index}
              className="mb-2"
              onMouseOver={() => handleMouseOverPlaceItem(index)}
              onMouseOut={() => infowindow.current.close()}
            >
              <span className="font-bold">{place.place_name}</span>
              {place.road_address_name && (
                <span className="block text-sm text-gray-600">
                  {place.road_address_name}
                </span>
              )}
              <span className="block text-sm text-gray-600">
                {place.address_name}
              </span>
              <span className="block text-sm text-gray-600">{place.phone}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;
