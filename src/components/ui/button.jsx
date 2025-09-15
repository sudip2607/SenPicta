// Simple Button component
import React from "react";

export function Button({ children, onClick, type = "button", className = "", ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-yellow-400 text-gray-950 font-semibold hover:bg-yellow-500 transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
