import React, { useState } from 'react';
import { FiFilm, FiTv } from 'react-icons/fi';
import TopRatedHero from '../Components/TopRatedHero';
import TopRatedPodium from '../Components/TopRatedPodium';
import TopRatedList from '../Components/TopRatedList';
import TopRatedGenres from '../Components/TopRatedGenres';

const TopRatedPage = () => {
  const [mediaType, setMediaType] = useState('movie');

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* HERO — #1 spotlight */}
      <TopRatedHero mediaType={mediaType} />

      {/* TAB SWITCHER — sits between hero and rest of content */}
      <div className="sticky top-16 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-purple-900/20 px-10 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* DECORATIVE LABEL */}
          <span className="text-gray-600 text-sm hidden md:block">
            Viewing:
          </span>
          <div className="flex gap-1 bg-purple-900/20 border border-purple-900/30 rounded-xl p-1">
            <button
              onClick={() => setMediaType('movie')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mediaType === 'movie' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-400 hover:text-white'}`}
            >
              <FiFilm size={14} /> Movies
            </button>
            <button
              onClick={() => setMediaType('tv')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mediaType === 'tv' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-900/40' : 'text-gray-400 hover:text-white'}`}
            >
              <FiTv size={14} /> TV Shows
            </button>
          </div>
        </div>

        {/* PAGE LABEL */}
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-sm">🏆</span>
          <span className="text-gray-500 text-sm font-medium">
            {mediaType === 'tv' ? 'Top Rated TV Shows' : 'Top Rated Movies'} —
            All Time
          </span>
        </div>
      </div>

      {/* PODIUM — top 3 */}
      <TopRatedPodium mediaType={mediaType} />

      {/* DIVIDER */}
      <div className="px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-800/40 to-transparent" />
      </div>

      {/* GENRE ROWS */}
      <TopRatedGenres mediaType={mediaType} />

      {/* DIVIDER */}
      <div className="px-10">
        <div className="h-px bg-gradient-to-r from-transparent via-purple-800/40 to-transparent" />
      </div>

      {/* FULL RANKED LIST */}
      <TopRatedList mediaType={mediaType} />
    </div>
  );
};

export default TopRatedPage;
