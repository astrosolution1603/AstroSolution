export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen w-full">
      <div className="w-64 border-r border-white/10 hidden md:flex flex-col p-4 space-y-4 bg-black/20">
        <div className="h-10 bg-white/5 rounded-xl animate-pulse w-full"></div>
        <div className="space-y-2 mt-4">
          {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse w-full"></div>)}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
          <div className="h-4 w-32 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
