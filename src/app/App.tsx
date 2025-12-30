import { useState } from "react";
import { MainPage } from "./components/MainPage";
import { GuildMarkPage } from "./components/GuildMarkPage";
import { EventCalendarPage } from "./components/EventCalendarPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'guildmarks' | 'events'>('main');

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