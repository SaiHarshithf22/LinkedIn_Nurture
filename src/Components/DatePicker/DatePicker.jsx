import { useRef } from "react";
import { CalendarTodayOutlined } from "@mui/icons-material";

export const DatePicker = ({ selectedDate, setSelectedDate }) => {
  const dateInputRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const handleWrapperClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const wrapperStyle = {
    position: "relative",
    width: "100%",
  };

  const inputStyle = {
    width: "100%",
    padding: "9px",
    fontSize: "14px",
    border: "1px solid #0000003d",
    borderRadius: "6px",
    outline: "none",
    backgroundColor: "white",
    color: "black",
    height: "56px",
  };

  const iconStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  };

  return (
    <div style={wrapperStyle} onClick={handleWrapperClick}>
      <CalendarTodayOutlined style={iconStyle} />
      <input
        placeholder="Select"
        ref={dateInputRef}
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        max={today}
        style={inputStyle}
        onFocus={(e) => {
          e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
};

export const FilterDatePicker = ({
  label,
  fromSelectedDate,
  setFromSelectedDate,
  toSelectedDate,
  setToSelectedDate,
}) => {
  const labelStyling = {
    fontWeight: "500",
    marginBottom: "4px",
    color: "#00000099",
  };

  const dateWrapperStyle = {
    display: "flex",
    width: "100%",
    gap: "4px",
    alignItems: "center",
  };

  return (
    <div>
      <p style={labelStyling}>{label}</p>
      <div style={dateWrapperStyle}>
        <DatePicker
          selectedDate={fromSelectedDate}
          setSelectedDate={setFromSelectedDate}
        />
        -
        <DatePicker
          selectedDate={toSelectedDate}
          setSelectedDate={setToSelectedDate}
        />
      </div>
    </div>
  );
};
