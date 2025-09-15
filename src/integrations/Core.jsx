// Simple SendEmail React component
import React from "react";

export function SendEmail({ to, subject, body, onSend }) {
  const handleSend = () => {
    if (onSend) {
      onSend({ to, subject, body });
    }
    alert("Email sent (simulated)");
  };

  return (
    <button
      type="button"
      className="px-4 py-2 rounded bg-yellow-400 text-gray-950 font-semibold hover:bg-yellow-500 transition-colors duration-200"
      onClick={handleSend}
    >
      Send Email
    </button>
  );
}
