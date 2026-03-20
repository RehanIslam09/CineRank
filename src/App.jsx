import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import MoviesPage from './Pages/MoviesPage';
import TVPage from './Pages/TVPage';
import TopRatedPage from './Pages/TopRatedPage';
import ComingSoonPage from './Pages/ComingSoonPage';
import CelebritiesPage from './Pages/CelebritiesPage';
import AwardsPage from './Pages/AwardsPage';
import CommunityPage from './Pages/CommunityPage';
import ForYouPage from './Pages/ForYouPage';
import WatchList from './Pages/WatchList';

export default function App() {
  const [currentPage, setCurrentPage] = useState('movies');

  const renderPage = () => {
    switch (currentPage) {
      case 'watchlist':
        return <WatchList />;
      case 'movies':
        return <MoviesPage onNavigate={setCurrentPage} />;
      case 'tv':
        return <TVPage />;
      case 'topRated':
        return <TopRatedPage />;
      case 'comingSoon':
        return <ComingSoonPage onNavigate={setCurrentPage} />;
      case 'celebrities':
        return <CelebritiesPage />;
      case 'awards':
        return <AwardsPage />;
      case 'community':
        return <CommunityPage />;
      case 'forYou':
        return <ForYouPage />;
      default:
        return <MoviesPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}
