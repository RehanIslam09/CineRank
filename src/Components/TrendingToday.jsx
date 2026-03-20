import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight, FiBookmark } from 'react-icons/fi';
import { FaBookmark, FaPlay } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { useWatchlist } from '../context/WatchlistContext';

/* ================= IMAGE FALLBACK ================= */

const ImageOrFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={`${className} relative overflow-hidden bg-[#1a1a2e] flex items-center justify-center`}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 flex flex-wrap"
            style={{
              transform: 'rotate(-35deg) scale(2)',
              transformOrigin: 'center',
            }}
          >
            {Array.from({ length: 80 }).map((_, i) => (
              <span
                key={i}
                className="text-purple-400 text-xs font-mono whitespace-nowrap px-3 py-2"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-purple-400/60 text-sm uppercase tracking-widest">
            Illustration
          </p>
          <p className="text-purple-300/40 text-xs mt-1">Not Available</p>
        </div>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

/* ================= API CONFIG ================= */

const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_W = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  18: 'Drama',
  14: 'Fantasy',
  27: 'Horror',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  36: 'History',
  10751: 'Family',
};

const popularityWidths = [
  'w-full',
  'w-11/12',
  'w-10/12',
  'w-9/12',
  'w-8/12',
  'w-7/12',
  'w-6/12',
  'w-5/12',
  'w-4/12',
  'w-2/5',
];

/* ================= COMPONENT ================= */

const TrendingToday = () => {
  const scrollRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`,
        );
        setMovies(res.data.results.slice(0, 10));
      } catch (e) {
        console.error('TrendingToday fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -340 : 340,
      behavior: 'smooth',
    });
  };

  const toggleWatch = (e, movie) => {
    e.stopPropagation();
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie, 'trending');
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-[#0a0a0f] py-8 px-6">
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[160px] flex-shrink-0">
              <div className="h-[220px] rounded-xl bg-gradient-to-r from-purple-900/10 via-purple-800/20 to-purple-900/10 animate-pulse" />
              <div className="h-3 bg-purple-900/20 mt-2 rounded animate-pulse" />
              <div className="h-2 bg-purple-900/20 mt-1 rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0a0a0f] py-8 px-6">
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <h2 className="text-white text-xl font-bold">Trending Today</h2>
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse ml-1" />
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200">
          See all →
        </button>
      </div>

      {/* ROW WRAPPER */}
      <div className="relative">
        {/* LEFT ARROW */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-[#0a0a0f] to-transparent w-16 h-full flex items-center justify-start pl-1">
          <button
            onClick={() => scroll('left')}
            className="bg-black/60 hover:bg-purple-600/40 border border-purple-500/20 hover:border-purple-500/50 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          >
            <FiChevronLeft size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* RIGHT ARROW */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-[#0a0a0f] to-transparent w-16 h-full flex items-center justify-end pr-1">
          <button
            onClick={() => scroll('right')}
            className="bg-black/60 hover:bg-purple-600/40 border border-purple-500/20 hover:border-purple-500/50 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          >
            <FiChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* SCROLL ROW */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1"
        >
          {movies.map((movie, i) => {
            const genre = GENRE_MAP[movie.genre_ids?.[0]] || 'Movie';
            const year = movie.release_date?.slice(0, 4);
            const isNew =
              new Date(movie.release_date) >
              new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            const isHot = movie.popularity > 200;
            const badge = isNew ? '🆕 New' : isHot ? '🔥 Hot' : null;
            const saved = isInWatchlist(movie.id);

            return (
              <div
                key={movie.id}
                className="relative flex-shrink-0 w-[160px] cursor-pointer group"
                onMouseEnter={() => setHoveredId(movie.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* GHOST RANK */}
                <div className="absolute -left-3 bottom-0 text-[80px] font-black text-white/5 group-hover:text-purple-500/10 leading-none select-none transition-colors duration-300 z-0">
                  {i + 1}
                </div>

                {/* CARD */}
                <div className="relative w-full h-[220px] rounded-xl overflow-hidden z-10 border border-purple-900/30 group-hover:border-purple-500/40 shadow-lg group-hover:shadow-purple-900/50 group-hover:shadow-xl group-hover:scale-[1.03] transition-all duration-300">
                  <ImageOrFallback
                    src={movie.poster_path ? IMG_W + movie.poster_path : ''}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* PLAY OVERLAY */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-purple-600/80 hover:bg-purple-500 border-2 border-white/30 flex items-center justify-center text-white shadow-lg shadow-purple-900/50">
                      <FaPlay size={14} className="ml-0.5" />
                    </div>
                  </div>

                  {/* BADGE */}
                  {badge && (
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border border-purple-500/30 z-10">
                      {badge}
                    </div>
                  )}

                  {/* WATCHLIST BUTTON */}
                  <button
                    onClick={(e) => toggleWatch(e, movie)}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 ${
                      saved
                        ? 'bg-purple-500/30 border-purple-400/50 text-purple-300'
                        : 'bg-black/60 border-white/20 text-white hover:bg-purple-500/40 hover:border-purple-400/50'
                    }`}
                    title={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    {saved ? (
                      <FaBookmark size={10} />
                    ) : (
                      <FiBookmark size={10} />
                    )}
                  </button>

                  {/* RATING */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg z-10">
                    <AiFillStar className="text-yellow-400" size={11} />
                    <span className="text-yellow-400 text-xs font-bold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* TOOLTIP */}
                <div
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-[#1a1a2e] border border-purple-500/30 rounded-xl p-3 w-48 shadow-2xl shadow-purple-900/50 transition-all duration-200 pointer-events-none z-50 ${hoveredId === movie.id ? 'opacity-100' : 'opacity-0'}`}
                >
                  <p className="text-white font-semibold text-sm line-clamp-1">
                    {movie.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <AiFillStar className="text-yellow-400" size={11} />
                    <span className="text-yellow-400 text-xs font-bold">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span className="bg-purple-500/10 text-purple-400 text-[11px] px-2 py-0.5 rounded-full inline-block mt-1 border border-purple-500/15">
                    {genre}
                  </span>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                    {movie.overview}
                  </p>
                </div>

                {/* CARD TEXT */}
                <div className="mt-2 px-1 relative z-10">
                  <p className="text-white text-sm font-semibold truncate group-hover:text-purple-300 transition-colors duration-200">
                    {movie.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-xs">{year}</span>
                    <span className="text-gray-700">·</span>
                    <span className="bg-purple-500/10 text-purple-400 text-[11px] px-2 py-0.5 rounded-full border border-purple-500/10">
                      {genre}
                    </span>
                  </div>
                  <div className="w-full h-0.5 bg-purple-900/30 rounded-full mt-2">
                    <div
                      className={`h-0.5 ${popularityWidths[i]} bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendingToday;
