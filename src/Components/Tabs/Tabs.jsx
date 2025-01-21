import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const styles = {
    container: {
      width: "100%",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      width: "1100px",
      display: "flex",
      borderBottom: "2px solid #ddd",
      justifyContent: "center",
    },
    button: (isActive) => ({
      width: "140px",
      padding: "10px",
      textAlign: "center",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: isActive ? "bold" : "normal",
      color: isActive ? "#007bff" : "#333",
      transition: "border-color 0.3s, color 0.3s",
    }),
    buttonHover: {
      backgroundColor: "#f9f9f9",
    },
    content: {
      padding: "20px",
      width: "100%",
      height: "800px",
      background: "#fff",
    },
  };

  return (
    <>
      {/* Tab Headers */}
      <div style={styles.header}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            style={styles.button(activeTab === index)}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={styles.container}>
        {/* Tab Content */}
        <div style={styles.content}>
          {tabs[activeTab] && <div>{tabs[activeTab].content}</div>}
        </div>
      </div>
    </>
  );
};

export default Tabs;
