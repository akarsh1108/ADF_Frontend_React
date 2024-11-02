import React from "react";

const Header: React.FC = () => {
  return (
    <header
      className="relative w-full h-full flex justify-center items-center p-4"
      style={{
        background: "rgba(0, 0, 0)",
        border: "1px solid rgba(224, 183, 255, 0.5)",
        boxShadow: "0 4px 10px rgba(224, 183, 255, 0.2)",
        backdropFilter: "blur(10px)",
        animation: "Header 3s infinite",
      }}
    >
      <h1
        className="text-xl font-bold"
        style={{
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          animation: "fadeInText 2s ease-in-out",
        }}
      >
        Azure Data Factory Replica
      </h1>
      <style>
        {`
          @keyframes Header {
            0% { border-color: rgba(255, 255, 255, 0.8); }
            50% { border-color: rgba(255, 255, 255, 1); }
            100% { border-color: rgba(255, 255, 255, 0.8); }
          }
          @keyframes fadeInText {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInIcons {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
