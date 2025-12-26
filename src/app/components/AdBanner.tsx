export function AdBanner({ 
  type, 
  className = "" 
}: { 
  type: 'vertical' | 'horizontal' | 'popup'; 
  className?: string 
}) {
  const bannerStyles = {
    vertical: "w-32 h-[600px] bg-gradient-to-b from-orange-400 to-orange-600",
    horizontal: "w-full h-24 bg-gradient-to-r from-blue-400 to-blue-600",
    popup: "w-80 h-60 bg-gradient-to-br from-purple-400 to-pink-600"
  };

  return (
    <div className={`${bannerStyles[type]} ${className} rounded-lg shadow-lg flex items-center justify-center border-2 border-white/20`}>
      <div className="text-white text-center p-4">
        <p className="opacity-60">광고 배너</p>
        <p className="text-xs opacity-40 mt-1">{type === 'vertical' ? '세로형' : type === 'horizontal' ? '가로형' : '팝업형'}</p>
      </div>
    </div>
  );
}