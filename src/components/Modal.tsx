import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white w-full ${maxWidth} rounded-xl shadow-lg p-6 relative transition-all`}>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 pr-8">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;