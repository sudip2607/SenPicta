// Simple Dialog components
import React, { useState } from "react";

export function Dialog({ children }) {
  return <div>{children}</div>;
}

export function DialogTrigger({ children, onClick }) {
  return (
    <button onClick={onClick} className="px-4 py-2 rounded bg-yellow-400 text-gray-950 font-semibold hover:bg-yellow-500 transition-colors duration-200">
      {children}
    </button>
  );
}

export function DialogContent({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-900">&times;</button>
        {children}
      </div>
    </div>
  );
}
