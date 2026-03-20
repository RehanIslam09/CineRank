import { createContext, useContext, useState } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  // source: 'trending' | 'upcoming' | 'popular' | string (genre name)
  // mediaType: 'movie' | 'tv'
  const addToWatchlist = (item, source = 'popular', mediaType = 'movie') => {
    setWatchlist((prev) => {
      if (prev.find((m) => m.id === item.id && m._mediaType === mediaType))
        return prev;
      return [...prev, { ...item, _source: source, _mediaType: mediaType }];
    });
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== id));
  };

  const isInWatchlist = (id) => watchlist.some((m) => m.id === id);

  const movieWatchlist = watchlist.filter((m) => m._mediaType !== 'tv');
  const tvWatchlist = watchlist.filter((m) => m._mediaType === 'tv');

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        movieWatchlist,
        tvWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
