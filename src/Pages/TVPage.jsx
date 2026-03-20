import React from 'react';
import TVHeroBanner from '../Components/TVHeroBanner';
import TVTrendingToday from '../Components/TVTrendingToday';
import TVPopularShows from '../Components/TVPopularShows';
import TVPopularCelebrities from '../Components/TVPopularCelebrities';

const TVPage = () => {
  return (
    <div>
      <TVHeroBanner />
      <TVTrendingToday />
      <TVPopularCelebrities />
      <TVPopularShows />
    </div>
  );
};

export default TVPage;
