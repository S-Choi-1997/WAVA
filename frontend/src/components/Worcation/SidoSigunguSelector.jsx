import { sido_sigungu } from "../../api/dummy";

function SidoSigunguSelector({
  sido,
  sidoChangeHandle,
  sigungu,
  sigunguChangeHandle,
}) {
  return (
    <div className="mb-3">
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn m-1">
          {sido ? sido : "시도 설정"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content select-none menu bg-base-100 rounded-box z-10 w-52 p-2 shadow overflow-y-auto max-h-96 block"
        >
          {Object.keys(sido_sigungu).map((e) => (
            <li key={e}>
              <button type="button" onClick={() => sidoChangeHandle(e)}>
                {e}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="dropdown dropdown-bottom">
        <div tabIndex={0} role="button" className="btn m-1">
          {sigungu ? sigungu : "구군 설정"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow overflow-y-auto max-h-96 block"
        >
          {sido !== ""
            ? sido_sigungu[sido]?.map((e) => (
                <li key={e}>
                  <button type="button" onClick={() => sigunguChangeHandle(e)}>
                    {e}
                  </button>
                </li>
              ))
            : "시도를 설정해 주세요."}
        </ul>
      </div>
    </div>
  );
}

export default SidoSigunguSelector;
