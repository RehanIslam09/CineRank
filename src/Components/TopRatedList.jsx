import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBookmark, FiChevronDown } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { MdCalendarToday } from 'react-icons/md';
import { useWatchlist } from '../context/WatchlistContext';

/* ================= IMAGE FALLBACK ================= */
const ImageOrFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={`${className} relative overflow-hidden bg-[#1a1a2e] flex items-center justify-center`}
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 flex flex-wrap"
            style={{
              transform: 'rotate(-35deg) scale(2)',
              transformOrigin: 'center',
            }}
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="text-purple-400 text-[9px] font-mono whitespace-nowrap px-2 py-1"
              >
                N/A •
              </span>
            ))}
          </div>
        </div>
        <p className="text-purple-400/40 text-[9px] uppercase tracking-widest relative z-10">
          N/A
        </p>
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

const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_W = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w300';

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
  10759: 'Action & Adventure',
  10765: 'Sci-Fi & Fantasy',
  10768: 'War & Politics',
};

const getRankColor = (rank) => {
  if (rank === 1) return 'text-yellow-400 font-black';
  if (rank === 2) return 'text-gray-300 font-black';
  if (rank === 3) return 'text-amber-600 font-black';
  if (rank <= 10) return 'text-purple-400 font-bold';
  return 'text-gray-600 font-bold';
};

const ITEMS_PER_LOAD = 20;

const TopRatedList = ({ mediaType }) => {
  const [items, setItems] = useState([]);
  const [displayed, setDisplayed] = useState(ITEMS_PER_LOAD);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setDisplayed(ITEMS_PER_LOAD);
      try {
        const endpoint =
          mediaType === 'tv'
            ? `${BASE_URL}/tv/top_rated`
            : `${BASE_URL}/movie/top_rated`;

        const pages = await Promise.all(
          [1, 2, 3, 4, 5].map((p) =>
            axios.get(
              `${endpoint}?api_key=${API_KEY}&language=en-US&page=${p}`,
            ),
          ),
        );
        // skip first item (shown in Hero + Podium)
        const all = pages.flatMap((r) => r.data.results).slice(1);
        setItems(all);
      } catch (e) {
        console.error('TopRatedList fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [mediaType]);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayed((prev) => Math.min(prev + ITEMS_PER_LOAD, items.length));
      setLoadingMore(false);
    }, 400);
  };

  if (loading) {
    return (
      <div className="w-full px-10 py-8">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl bg-purple-900/10 animate-pulse"
            >
              <div className="w-10 h-6 bg-purple-900/20 rounded" />
              <div className="w-12 h-[68px] bg-purple-900/20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-purple-900/20 rounded" />
                <div className="h-3 w-2/3 bg-purple-900/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-10 py-8">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-purple-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">
            {mediaType === 'tv' ? 'Top Rated TV Shows' : 'Top Rated Movies'} —
            Full List
          </h2>
          <span className="bg-purple-500/15 text-purple-400 text-xs px-2.5 py-1 rounded-full border border-purple-500/20 font-medium">
            {items.length}
          </span>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {items.slice(0, displayed).map((item, i) => {
          const rank = i + 2; // starts at 2 since #1 is in Hero
          const title = item.title || item.name;
          const year = (item.release_date || item.first_air_date || '').slice(
            0,
            4,
          );
          const genres = (item.genre_ids || [])
            .slice(0, 3)
            .map((id) => GENRE_MAP[id])
            .filter(Boolean);
          const saved = isInWatchlist(item.id);

          return (
            <div
              key={item.id}
              className="relative flex items-center gap-4 p-3 rounded-xl border border-purple-900/20 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200 cursor-pointer group"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* RANK NUMBER */}
              <div className="w-10 text-right flex-shrink-0">
                <span className={`text-lg ${getRankColor(rank)}`}>{rank}</span>
              </div>

              {/* POSTER */}
              <div className="w-[44px] h-[64px] flex-shrink-0 rounded-lg overflow-hidden border border-purple-900/30 group-hover:border-purple-500/30 transition-all duration-200">
                <ImageOrFallback
                  src={item.poster_path ? IMG_W + item.poster_path : ''}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* BACKDROP (hidden on small, shown on hover on larger) */}
              <div className="w-[100px] h-[58px] flex-shrink-0 rounded-lg overflow-hidden border border-purple-900/20 hidden md:block group-hover:border-purple-500/20 transition-all duration-200">
                <ImageOrFallback
                  src={
                    item.backdrop_path ? BACKDROP_BASE + item.backdrop_path : ''
                  }
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors line-clamp-1">
                  {title}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {year && (
                    <span className="text-gray-500 text-xs flex items-center gap-1">
                      <MdCalendarToday size={10} className="text-gray-600" />
                      {year}
                    </span>
                  )}
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/15"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                  {item.overview}
                </p>
              </div>

              {/* RATING */}
              <div className="flex items-center gap-1.5 flex-shrink-0 bg-black/40 border border-yellow-500/15 px-2.5 py-1.5 rounded-lg">
                <AiFillStar className="text-yellow-400" size={12} />
                <span className="text-yellow-300 text-sm font-bold">
                  {item.vote_average?.toFixed(1)}
                </span>
              </div>

              {/* VOTES */}
              <div className="hidden lg:block flex-shrink-0 text-right w-20">
                <p className="text-gray-600 text-xs">
                  {item.vote_count > 1000
                    ? `${(item.vote_count / 1000).toFixed(1)}k`
                    : item.vote_count}{' '}
                  votes
                </p>
              </div>

              {/* WATCHLIST */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saved
                    ? removeFromWatchlist(item.id)
                    : addToWatchlist(item, 'top_rated', mediaType);
                }}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 opacity-0 group-hover:opacity-100 ${saved ? 'bg-purple-500/30 border-purple-400/50 text-purple-300' : 'bg-black/40 border-white/15 text-white/60 hover:bg-purple-500/20 hover:border-purple-400/40 hover:text-purple-300'}`}
              >
                {saved ? <FaBookmark size={11} /> : <FiBookmark size={11} />}
              </button>

              {/* RATING BAR (subtle background) */}
              <div
                className="absolute bottom-0 left-0 h-[2px] bg-purple-900/20 rounded-b-xl"
                style={{ width: '100%' }}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 rounded-b-xl transition-all duration-700 opacity-0 group-hover:opacity-100"
                  style={{ width: `${(item.vote_average / 10) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* LOAD MORE */}
      {displayed < items.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 hover:text-white hover:bg-purple-500/10 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            {loadingMore ? (
              <span className="w-4 h-4 rounded-full border-2 border-purple-400/30 border-t-purple-400 animate-spin" />
            ) : (
              <FiChevronDown size={16} />
            )}
            {loadingMore
              ? 'Loading...'
              : `Load More (${items.length - displayed} remaining)`}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopRatedList;
