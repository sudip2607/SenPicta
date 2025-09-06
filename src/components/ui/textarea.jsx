// Simple Textarea component
import React from "react";

export function Textarea({ value, onChange, placeholder = "", className = "", ...props }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 ${className}`}
      {...props}
    />
  );
}
