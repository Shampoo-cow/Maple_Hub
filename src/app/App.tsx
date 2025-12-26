import { useState } from "react";
import { MainPage } from "./components/MainPage";
import { GuildMarkPage } from "./components/GuildMarkPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'guildmarks'>('main');

  return (
    <>
      {currentPage === 'main' ? (
        <MainPage onNavigate={setCurrentPage} />
      ) : (
        <GuildMarkPage onNavigate={setCurrentPage} />
      )}
    </>
  );
}
