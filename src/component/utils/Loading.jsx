import React from 'react';

const Loading = () => {
    return (
        <div className="flex items-center  justify-center space-x-2 p-4   h-[70%]">
            <div className="w-10 h-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default Loading;
