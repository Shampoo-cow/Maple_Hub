import { useEffect } from "react";
import { GuildMarkPage } from "./components/GuildMarkPage";
import faviconImage from "figma:asset/cb0f5c1c966b5decd0275b09e80838bc724c6eac.png";

export default function App() {
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconImage;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return <GuildMarkPage />;
}