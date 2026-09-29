const EmptyChatContainer = () => {
  return (
    <div className="flex-1 sm:flex hidden items-center justify-center text-white bg-[#021A54] relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl top-1/4 left-1/3" />
      <div className="absolute w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl bottom-1/4 right-1/4" />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center px-6">

        {/* Pulse Icon */}
        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl mb-7">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <span className="absolute w-10 h-10 rounded-full bg-cyan-400/20 animate-ping" />
            <span className="w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_25px_rgba(103,232,249,0.9)]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="poppins-semibold text-4xl tracking-tight">
          Welcome to <span className="text-cyan-300">Pulse</span>
        </h1>

        {/* Subtitle */}
        <p className="poppins-regular text-white/60 text-base mt-4 max-w-md leading-relaxed">
          Your conversations, connected in one place.
          <br />
          Select a chat and let the conversation begin.
        </p>

        {/* Bottom hint */}
        <div className="mt-8 flex items-center gap-2 text-sm text-white/40">
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
          <span>Ready when you are</span>
        </div>

      </div>
    </div>
  );
};

export default EmptyChatContainer;