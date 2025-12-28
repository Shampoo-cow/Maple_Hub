export function Footer() {
  return (
    <footer className="bg-white/90 backdrop-blur border-t-2 border-orange-200 py-6 px-4 mt-8">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-700 mb-2">
          © 2025 샴푸소. All rights reserved.
        </p>
        <p className="text-gray-600 text-sm mb-1">
          본 사이트는 NEXON Korea와 공식적인 관련이 없으며,
        </p>
        <p className="text-gray-600 text-sm mb-3">
          콘텐츠 구성은 100% 주인장 취향입니다.
        </p>
        <p className="text-gray-600 text-sm">
          Contact: <a href="mailto:shampoocau@gmail.com" className="text-orange-600 hover:text-orange-700 underline">shampoocau@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}
