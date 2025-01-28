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
      display: "flex",
      justifyContent: "center",
      gap: "4px",
    },
    button: (isActive) => ({
      padding: "10px 20px 10px 10px",
      textAlign: "start",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: isActive ? "bold" : "normal",
      borderBottom: isActive ? "2px solid #007bff" : "",
      color: isActive ? "#1976D2" : "#00000080",
      transition: "border-color 0.3s, color 0.3s",
      borderRadius: "0",
    }),
    buttonHover: {
      backgroundColor: "#f9f9f9",
    },
    content: {
      padding: "32px 12px",
      width: "100%",
      background: "#fff",
      height: "max-content",
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
