import React from "react";

export const Gradient = () => {
  const gradientStyle = {
    width: "100%",
    height: "75px",
    background: "linear-gradient(270deg, #4B6CB7 0%, #182848 100%)",
  };
  return (
    <div
      style={{
        ...gradientStyle,
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}
    ></div>
  );
};
