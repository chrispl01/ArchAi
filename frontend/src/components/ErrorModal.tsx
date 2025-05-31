import React from "react";

type ErrorModalProps = {
  message: string | null;
  onClose: () => void;
};

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-1">
      <div className="bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full relative">
        <h2 className="text-2xl font-semibold mb-4 text-red-700">Error!</h2>
        <p className="mb-6 text-md">{message}</p>
        <div className="text-right">
                <button
                  onClick={onClose}
                  className="text-sm border-1 border-gray-100 px-2 py-2 rounded-4xl hover:bg-gray-600 duration-100 hover:scale-105 cursor-pointer w-40"
                >
                  Close
                </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
