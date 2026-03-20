import React from 'react';
import HeroBanner from '../Components/HeroBanner';
import TrendingToday from '../Components/TrendingToday';
import PopularCelebrities from '../Components/PopularCelebrities';
import PopularMovies from '../Components/PopularMovies';

const MoviesPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <HeroBanner onNavigate={onNavigate} />
      <TrendingToday />
      <PopularCelebrities />
      <PopularMovies />
    </div>
  );
};

export default MoviesPage;
