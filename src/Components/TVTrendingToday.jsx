import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiChevronLeft,
  FiChevronRight,
  FiBookmark,
  FiTv,
} from 'react-icons/fi';
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

const TV_GENRE_MAP = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
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

const TVTrendingToday = () => {
  const scrollRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/trending/tv/day?api_key=${API_KEY}&language=en-US`,
        );
        setShows(res.data.results.slice(0, 10));
      } catch (e) {
        console.error('TVTrendingToday fetch error', e);
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

  const toggleWatch = (e, show) => {
    e.stopPropagation();
    isInWatchlist(show.id)
      ? removeFromWatchlist(show.id)
      : addToWatchlist(show, 'tv_trending', 'tv');
  };

  if (loading) {
    return (
      <div className="w-full bg-[#0a0a0f] py-8 px-6">
        <div className="flex gap-4 overflow-hidden pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[160px] flex-shrink-0">
              <div className="h-[220px] rounded-xl bg-gradient-to-r from-violet-900/10 via-violet-800/20 to-violet-900/10 animate-pulse" />
              <div className="h-3 bg-violet-900/20 mt-2 rounded animate-pulse" />
              <div className="h-2 bg-violet-900/20 mt-1 rounded w-2/3 animate-pulse" />
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
          <FiTv size={20} className="text-violet-400" />
          <h2 className="text-white text-xl font-bold">Trending TV Today</h2>
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse ml-1" />
        </div>
        <button className="text-violet-400 hover:text-violet-300 text-sm transition-colors duration-200">
          See all →
        </button>
      </div>

      <div className="relative">
        {/* LEFT ARROW */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-[#0a0a0f] to-transparent w-16 h-full flex items-center justify-start pl-1">
          <button
            onClick={() => scroll('left')}
            className="bg-black/60 hover:bg-violet-600/40 border border-violet-500/20 hover:border-violet-500/50 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          >
            <FiChevronLeft size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* RIGHT ARROW */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-[#0a0a0f] to-transparent w-16 h-full flex items-center justify-end pr-1">
          <button
            onClick={() => scroll('right')}
            className="bg-black/60 hover:bg-violet-600/40 border border-violet-500/20 hover:border-violet-500/50 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          >
            <FiChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* SCROLL ROW */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1"
        >
          {shows.map((show, i) => {
            const genre = TV_GENRE_MAP[show.genre_ids?.[0]] || 'TV';
            const year = (show.first_air_date || '').slice(0, 4);
            const isNew =
              new Date(show.first_air_date) >
              new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
            const isHot = show.popularity > 200;
            const badge = isNew ? '🆕 New' : isHot ? '🔥 Hot' : null;
            const saved = isInWatchlist(show.id);
            const title = show.name || show.title;

            return (
              <div
                key={show.id}
                className="relative flex-shrink-0 w-[160px] cursor-pointer group"
                onMouseEnter={() => setHoveredId(show.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* GHOST RANK */}
                <div className="absolute -left-3 bottom-0 text-[80px] font-black text-white/5 group-hover:text-violet-500/10 leading-none select-none transition-colors duration-300 z-0">
                  {i + 1}
                </div>

                {/* CARD */}
                <div className="relative w-full h-[220px] rounded-xl overflow-hidden z-10 border border-violet-900/30 group-hover:border-violet-500/40 shadow-lg group-hover:shadow-violet-900/50 group-hover:shadow-xl group-hover:scale-[1.03] transition-all duration-300">
                  <ImageOrFallback
                    src={show.poster_path ? IMG_W + show.poster_path : ''}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* PLAY OVERLAY */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-violet-600/80 hover:bg-violet-500 border-2 border-white/30 flex items-center justify-center text-white shadow-lg">
                      <FaPlay size={14} className="ml-0.5" />
                    </div>
                  </div>

                  {/* BADGE */}
                  {badge && (
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full border border-violet-500/30 z-10">
                      {badge}
                    </div>
                  )}

                  {/* WATCHLIST BTN */}
                  <button
                    onClick={(e) => toggleWatch(e, show)}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 ${saved ? 'bg-violet-500/30 border-violet-400/50 text-violet-300' : 'bg-black/60 border-white/20 text-white hover:bg-violet-500/40 hover:border-violet-400/50'}`}
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
                      {show.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* TOOLTIP */}
                <div
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-[#1a1a2e] border border-violet-500/30 rounded-xl p-3 w-48 shadow-2xl shadow-violet-900/50 transition-all duration-200 pointer-events-none z-50 ${hoveredId === show.id ? 'opacity-100' : 'opacity-0'}`}
                >
                  <p className="text-white font-semibold text-sm line-clamp-1">
                    {title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <AiFillStar className="text-yellow-400" size={11} />
                    <span className="text-yellow-400 text-xs font-bold">
                      {show.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span className="bg-violet-500/10 text-violet-400 text-[11px] px-2 py-0.5 rounded-full inline-block mt-1 border border-violet-500/15">
                    {genre}
                  </span>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                    {show.overview}
                  </p>
                </div>

                {/* TEXT */}
                <div className="mt-2 px-1 relative z-10">
                  <p className="text-white text-sm font-semibold truncate group-hover:text-violet-300 transition-colors duration-200">
                    {title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-xs">{year}</span>
                    <span className="text-gray-700">·</span>
                    <span className="bg-violet-500/10 text-violet-400 text-[11px] px-2 py-0.5 rounded-full border border-violet-500/10">
                      {genre}
                    </span>
                  </div>
                  <div className="w-full h-0.5 bg-violet-900/30 rounded-full mt-2">
                    <div
                      className={`h-0.5 ${popularityWidths[i]} bg-gradient-to-r from-violet-500 to-purple-500 rounded-full`}
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

export default TVTrendingToday;
