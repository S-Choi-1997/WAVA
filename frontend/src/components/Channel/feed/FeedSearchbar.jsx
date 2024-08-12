import { useState } from "react";

function FeedSearchBar({ searchHandle, searchBarRef }) {
  const [searchText, setsearchText] = useState("");

  const submitHandle = (e) => {
    e.preventDefault();
    searchHandle(searchText);
  };
  return (
    <>
      <form onSubmit={submitHandle} className="my-5 sm:w-full max-w-md mx-auto">
        <label className="input input-bordered flex items-center gap-2">
          <input
            ref={searchBarRef}
            required
            value={searchText}
            onChange={(e) => setsearchText(e.target.value)}
            type="text"
            className="grow"
            placeholder="Search"
          />
          <svg
            onClick={submitHandle}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </form>
    </>
  );
}

export default FeedSearchBar;
