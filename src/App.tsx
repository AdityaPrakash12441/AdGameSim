import React, { useState } from 'react';
import { Sidebar, PageId } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './pages/Overview';
import { PrisonersDilemmaPage } from './pages/PrisonersDilemma';
import { BertrandCompetitionPage } from './pages/BertrandCompetition';
import { HotellingModelPage } from './pages/HotellingModel';
import { AboutPage } from './pages/About';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview onSelectPage={setCurrentPage} />;
      case 'prisoners':
        return <PrisonersDilemmaPage />;
      case 'bertrand':
        return <BertrandCompetitionPage />;
      case 'hotelling':
        return <HotellingModelPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <Overview onSelectPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Sticky Header */}
        <Header
          currentPage={currentPage}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onSelectPage={setCurrentPage}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-6 px-6 sm:px-8 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-slate-700">AdGameSim</span> — Game Theory Project (V Semester)
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Department of Computer Science & Engineering</span>
              <span>•</span>
              <button
                onClick={() => {
                  setCurrentPage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-700 hover:underline"
              >
                Project Team & Citations
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;

