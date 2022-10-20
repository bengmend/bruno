import React from "react";

const NetworkError = ({ onClose }) => {
  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex bg-red-100">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800">Network Error</p>
            <p className="mt-2 text-xs text-gray-500">
              Please note that if you are using Bruno on the web, then the api you are connecting to must allow CORS. If not, please use the chrome extension or the desktop app
            </p>
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={onClose}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NetworkError;
