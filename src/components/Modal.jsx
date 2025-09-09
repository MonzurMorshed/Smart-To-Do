import React from 'react';

export default function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="glossy modal p-6 rounded-md w-full max-w-md bg-light dark:bg-white"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
