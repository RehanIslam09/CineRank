import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
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
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div
            className="absolute inset-0 flex flex-wrap"
            style={{
              transform: 'rotate(-35deg) scale(2)',
              transformOrigin: 'center',
            }}
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                className="text-purple-400 text-xs font-mono whitespace-nowrap px-2 py-1"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-purple-400/50 text-xs uppercase tracking-widest">
            Not Available
          </p>
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

const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_W = 'https://image.tmdb.org/t/p/w500';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/w780';

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
  10759: 'Action & Adventure',
  10765: 'Sci-Fi & Fantasy',
};

const PODIUM = [
  {
    rank: 1,
    label: '🥇 Gold',
    height: 'h-[380px]',
    border: 'border-yellow-500/50',
    glow: 'shadow-yellow-500/20',
    badge: 'from-yellow-400 to-amber-500',
    badgeText: 'text-black',
    ring: 'ring-yellow-400/30',
    accent: 'text-yellow-400',
    bar: 'from-yellow-400 to-amber-500',
    order: 'order-2',
    scale: 'scale-105',
  },
  {
    rank: 2,
    label: '🥈 Silver',
    height: 'h-[320px]',
    border: 'border-gray-400/40',
    glow: 'shadow-gray-400/10',
    badge: 'from-gray-300 to-gray-500',
    badgeText: 'text-black',
    ring: 'ring-gray-400/20',
    accent: 'text-gray-300',
    bar: 'from-gray-300 to-gray-500',
    order: 'order-1',
    scale: '',
  },
  {
    rank: 3,
    label: '🥉 Bronze',
    height: 'h-[280px]',
    border: 'border-amber-700/40',
    glow: 'shadow-amber-700/10',
    badge: 'from-amber-600 to-orange-700',
    badgeText: 'text-white',
    ring: 'ring-amber-700/20',
    accent: 'text-amber-500',
    bar: 'from-amber-600 to-orange-700',
    order: 'order-3',
    scale: '',
  },
];

const TopRatedPodium = ({ mediaType }) => {
  const [top3, setTop3] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchTop3 = async () => {
      setLoading(true);
      try {
        const endpoint =
          mediaType === 'tv'
            ? `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`
            : `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
        const res = await axios.get(endpoint);
        // skip index 0 since that's shown in Hero
        setTop3(res.data.results.slice(1, 4));
      } catch (e) {
        console.error('TopRatedPodium fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTop3();
  }, [mediaType]);

  if (loading) {
    return (
      <div className="w-full px-10 py-8">
        <div className="flex items-end justify-center gap-6">
          {[320, 380, 280].map((h, i) => (
            <div
              key={i}
              className="flex-1 max-w-[280px] rounded-2xl bg-purple-900/10 animate-pulse"
              style={{ height: h }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Reorder: silver(2nd), gold(1st), bronze(3rd) for podium visual
  const ordered = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="w-full px-10 py-8">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-7 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full" />
        <h2 className="text-2xl font-bold text-white">Hall of Fame — Top 3</h2>
        <span className="text-yellow-500 text-sm">🏆</span>
      </div>

      <div className="flex items-end justify-center gap-4">
        {ordered.map((item, i) => {
          // map back to rank
          const rankIndex = i === 0 ? 1 : i === 1 ? 0 : 2;
          const p = PODIUM[rankIndex];
          if (!item) return null;

          const title = item.title || item.name;
          const year = (item.release_date || item.first_air_date || '').slice(
            0,
            4,
          );
          const genres = (item.genre_ids || [])
            .slice(0, 2)
            .map((id) => GENRE_MAP[id])
            .filter(Boolean);
          const saved = isInWatchlist(item.id);

          return (
            <div
              key={item.id}
              className={`relative flex-1 max-w-[300px] ${p.order} ${p.scale} group cursor-pointer`}
            >
              {/* RANK BADGE */}
              <div
                className={`absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-gradient-to-br ${p.badge} flex items-center justify-center shadow-xl border-2 border-white/20`}
              >
                <span className={`font-black text-base ${p.badgeText}`}>
                  {p.rank}
                </span>
              </div>

              {/* CARD */}
              <div
                className={`relative ${p.height} rounded-2xl overflow-hidden border ${p.border} shadow-2xl ${p.glow} ring-1 ${p.ring} transition-all duration-300 group-hover:scale-[1.02]`}
              >
                {/* BACKDROP */}
                {item.backdrop_path ? (
                  <img
                    src={IMG_BACKDROP + item.backdrop_path}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                ) : (
                  <ImageOrFallback
                    src=""
                    alt={title}
                    className="absolute inset-0 w-full h-full"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* POSTER THUMBNAIL */}
                <div className="absolute top-4 left-4 w-12 h-[70px] rounded-lg overflow-hidden border border-white/20 shadow-lg">
                  <ImageOrFallback
                    src={item.poster_path ? IMG_W + item.poster_path : ''}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* WATCHLIST BTN */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saved
                      ? removeFromWatchlist(item.id)
                      : addToWatchlist(item, 'top_rated', mediaType);
                  }}
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 opacity-0 group-hover:opacity-100 ${saved ? 'bg-purple-500/30 border-purple-400/50 text-purple-300' : 'bg-black/60 border-white/20 text-white hover:bg-purple-500/30'}`}
                >
                  {saved ? <FaBookmark size={11} /> : <FiBookmark size={11} />}
                </button>

                {/* BOTTOM CONTENT */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* RATING */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <AiFillStar className={p.accent} size={14} />
                    <span className={`${p.accent} font-black text-base`}>
                      {item.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-xs">/ 10</span>
                  </div>

                  <h3 className="text-white font-bold text-base line-clamp-1 mb-1">
                    {title}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap">
                    {year && (
                      <span className="text-gray-400 text-xs">{year}</span>
                    )}
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="bg-white/10 text-gray-300 text-[10px] px-2 py-0.5 rounded-full"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* RATING BAR */}
                  <div className="w-full h-1 bg-white/10 rounded-full mt-3">
                    <div
                      className={`h-full bg-gradient-to-r ${p.bar} rounded-full`}
                      style={{ width: `${(item.vote_average / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* PODIUM BASE */}
              <div
                className={`w-full h-3 bg-gradient-to-r ${p.badge} rounded-b-lg opacity-60`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopRatedPodium;
