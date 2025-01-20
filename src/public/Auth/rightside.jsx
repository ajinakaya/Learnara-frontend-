import React from 'react';

const RightSide = () => {
  const ChatBubble = ({ text, color, top, right, left, rotate = 0 }) => (
    <div
      className={`absolute px-4 py-2 rounded-2xl text-sm font-medium ${color} transform`}
      style={{
        top,
        right,
        left,
        transform: `rotate(${rotate}deg)`,
        animation: 'float 3s ease-in-out infinite',
      }}
    >
      {text}
    </div>
  );

  return (
    <div className="w-full md:w-1/2 gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/api/placeholder/400/400')] opacity-10 bg-repeat"></div>
      <div className="relative h-full flex items-center justify-center p-8">
        <div className="text-white z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl font-bold leading-tight">
              WHAT'S
            </div>
            <div className="bg-yellow-400 px-6 py-2 rounded-full text-black font-medium transform rotate-12 shadow-lg whitespace-nowrap">
              Let's Talk!
            </div>
          </div>
          <div className="text-5xl font-bold leading-tight">
            YOUR
            <br />
            LANGUAGE?
          </div>
          <ChatBubble
            text="¡Hola!"
            color="bg-purple-500 text-black"
            top="10%"
            right="20%"
            rotate={-15}
          />
          <ChatBubble
            text="Bonjour!"
            color="bg-red-400 text-black"
            top="20%"
            left="10%"
            rotate={10}
          />
          <ChatBubble
            text="こんにちは"
            color="bg-blue-400 text-white"
            top="70%"
            right="15%"
            rotate={5}
          />
          <ChatBubble
            text="Hello!"
            color="bg-green-400 text-black"
            top="80%"
            left="20%"
            rotate={-5}
          />
        </div>

        <div className="absolute bottom-4 right-4 flex space-x-2">
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="w-2 h-2 bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
