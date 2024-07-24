function ImportantRadio({ selected, setSelected }) {
  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const options = [
    { label: "상", value: "상", color: "bg-green-500" },
    { label: "중", value: "중", color: "bg-yellow-500" },
    { label: "하", value: "하", color: "bg-purple-500" },
  ];
  return (
    <>
      {/* <!-- VALUE 라디오 그룹 --> */}
      <div className="flex flex-col items-center">
        <span className="label-text mb-2">우선순위</span>
        <div className="flex">
          {options.map((option) => (
            <div key={option.value} className="form-control mr-4">
              <label className="label cursor-pointer flex flex-col items-center">
                <span className="label-text mb-2">{option.label}</span>
                <input
                  type="radio"
                  name="value"
                  value={option.value}
                  className={`radio checked:${option.color}`}
                  checked={selected === option.value}
                  onChange={handleChange}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ImportantRadio;
