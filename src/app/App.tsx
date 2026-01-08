import { useState, useEffect } from "react";
import { MainPage } from "./components/MainPage";
import { GuildMarkPage } from "./components/GuildMarkPage";
import { EventCalendarPage } from "./components/EventCalendarPage";
import faviconImage from "../asset/cb0f5c1c966b5decd0275b09e80838bc724c6eac.png";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'guildmarks' | 'events'>('main');

  // Set favicon
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconImage;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return (
    <>
      {currentPage === 'main' ? (
        <MainPage onNavigate={setCurrentPage} />
      ) : currentPage === 'events' ? (
        <EventCalendarPage onNavigate={setCurrentPage} />
      ) : (
        <GuildMarkPage onNavigate={setCurrentPage} />
      )}
    </>
  );
}