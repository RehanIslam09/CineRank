import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useWatchlist } from '../context/WatchlistContext';
import {
  FiGrid,
  FiList,
  FiX,
  FiTrash2,
  FiBookmark,
  FiTv,
  FiFilm,
} from 'react-icons/fi';
import { FaBookmark, FaPlay } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { MdCalendarToday, MdAccessTime } from 'react-icons/md';

/* ================= API CONFIG ================= */
const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_W = 'https://image.tmdb.org/t/p/w500';
const IMG_BACKDROP = 'https://image.tmdb.org/t/p/original';
const IMG_FACE = 'https://image.tmdb.org/t/p/w185';

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
  10762: 'Kids',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10768: 'War & Politics',
};

const SOURCE_LABEL = {
  trending: {
    label: '🔥 Trending',
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  },
  upcoming: {
    label: '🗓 Upcoming',
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  },
  airing_today: {
    label: '📺 Airing Today',
    color: 'text-green-400 border-green-500/30 bg-green-500/10',
  },
  tv_trending: {
    label: '🔥 TV Trending',
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  },
};

const getSourceMeta = (source) => {
  if (!source)
    return {
      label: '🎬 Popular',
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    };
  if (SOURCE_LABEL[source]) return SOURCE_LABEL[source];
  return {
    label: `🎭 ${source}`,
    color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
  };
};

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
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                className="text-purple-400 text-[9px] font-mono whitespace-nowrap px-2 py-1"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-purple-400/50 text-[10px] uppercase tracking-widest">
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

/* ================= DETAIL MODAL ================= */
const DetailModal = ({ item, onClose, onRemove }) => {
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const isTV = item._mediaType === 'tv';

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const endpoint = isTV
          ? `${BASE_URL}/tv/${item.id}`
          : `${BASE_URL}/movie/${item.id}`;
        const creditsEndpoint = isTV
          ? `${BASE_URL}/tv/${item.id}/credits`
          : `${BASE_URL}/movie/${item.id}/credits`;
        const [detailRes, creditsRes] = await Promise.all([
          axios.get(`${endpoint}?api_key=${API_KEY}&language=en-US`),
          axios.get(`${creditsEndpoint}?api_key=${API_KEY}&language=en-US`),
        ]);
        setDetails(detailRes.data);
        setCast(creditsRes.data.cast.slice(0, 8));
      } catch (e) {
        console.error('Modal fetch error', e);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [item.id]);

  const sourceMeta = getSourceMeta(item._source);
  const title = item.title || item.name;
  const genres =
    details?.genres ||
    (item.genre_ids || [])
      .map((id) => ({ id, name: GENRE_MAP[id] }))
      .filter((g) => g.name);
  const runtime = details?.runtime || details?.episode_run_time?.[0];
  const formatRuntime = (mins) =>
    mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : null;
  const accentColor = isTV
    ? 'from-violet-500 to-purple-500'
    : 'from-purple-500 to-fuchsia-500';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#0f0f1a] border border-purple-900/40 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BACKDROP */}
        <div className="relative h-56 flex-shrink-0 overflow-hidden">
          <ImageOrFallback
            src={item.backdrop_path ? IMG_BACKDROP + item.backdrop_path : ''}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a]/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-black/80 flex items-center justify-center transition-all duration-200"
          >
            <FiX size={18} />
          </button>
          <div
            className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full border ${sourceMeta.color}`}
          >
            {sourceMeta.label}
          </div>
          {isTV && (
            <div className="absolute top-4 left-4 mt-8 flex items-center gap-1.5 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs px-3 py-1 rounded-full">
              <FiTv size={11} /> TV Series
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex gap-5 -mt-16 mb-5 relative z-10">
            <div className="w-[100px] h-[148px] flex-shrink-0 rounded-xl overflow-hidden border-2 border-purple-500/40 shadow-2xl shadow-purple-900/60">
              <ImageOrFallback
                src={item.poster_path ? IMG_W + item.poster_path : ''}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 pt-16">
              <h2 className="text-white text-2xl font-bold leading-tight line-clamp-2 mb-2">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {(item.release_date || item.first_air_date) && (
                  <span className="text-gray-400 flex items-center gap-1">
                    <MdCalendarToday size={13} className="text-gray-600" />
                    {(item.release_date || item.first_air_date)?.slice(0, 4)}
                  </span>
                )}
                {isTV && details?.number_of_seasons && (
                  <span className="text-gray-400 text-xs">
                    {details.number_of_seasons} Season
                    {details.number_of_seasons > 1 ? 's' : ''}
                  </span>
                )}
                {isTV && details?.number_of_episodes && (
                  <span className="text-gray-400 text-xs">
                    {details.number_of_episodes} Episodes
                  </span>
                )}
                {!isTV && formatRuntime(runtime) && (
                  <span className="text-gray-400 flex items-center gap-1">
                    <MdAccessTime size={13} className="text-gray-600" />
                    {formatRuntime(runtime)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <AiFillStar className="text-yellow-400" size={14} />
                  <span className="text-yellow-300 font-bold">
                    {item.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-gray-600 text-xs">/ 10</span>
                </span>
              </div>
            </div>
          </div>

          {/* GENRES */}
          <div className="flex flex-wrap gap-2 mb-5">
            {genres.map((g) => (
              <span
                key={g.id || g.name}
                className="bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full"
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* OVERVIEW */}
          <div className="mb-6">
            <h3 className="text-white font-semibold text-sm mb-2 uppercase tracking-wider">
              Overview
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.overview || 'No overview available.'}
            </p>
          </div>

          {/* RATING BAR */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                Audience Score
              </span>
              <span className="text-purple-300 text-xs font-bold">
                {item.vote_average?.toFixed(1)} / 10
              </span>
            </div>
            <div className="w-full h-1.5 bg-purple-900/40 rounded-full">
              <div
                className={`h-full bg-gradient-to-r ${accentColor} rounded-full transition-all duration-700`}
                style={{ width: `${(item.vote_average / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* CAST */}
          {!loadingDetails && cast.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
                Cast
              </h3>
              <div
                className="flex gap-3 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none' }}
              >
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[70px]"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-900/50 hover:border-purple-500/50 transition-all duration-200">
                      <ImageOrFallback
                        src={
                          actor.profile_path
                            ? IMG_FACE + actor.profile_path
                            : ''
                        }
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-white text-[10px] font-medium text-center leading-tight line-clamp-2">
                      {actor.name}
                    </p>
                    <p className="text-gray-600 text-[9px] text-center line-clamp-1">
                      {actor.character || actor.roles?.[0]?.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {loadingDetails && (
            <div className="flex gap-3 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 w-[70px] flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-full bg-purple-900/20 animate-pulse" />
                  <div className="h-2 w-12 bg-purple-900/20 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* EXTRA INFO */}
          {details && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {details.original_language && (
                <div className="bg-purple-500/5 border border-purple-900/30 rounded-xl p-3">
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">
                    Language
                  </p>
                  <p className="text-white text-sm font-medium uppercase">
                    {details.original_language}
                  </p>
                </div>
              )}
              {details.status && (
                <div className="bg-purple-500/5 border border-purple-900/30 rounded-xl p-3">
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p className="text-white text-sm font-medium">
                    {details.status}
                  </p>
                </div>
              )}
              {isTV && details.networks?.length > 0 && (
                <div className="bg-purple-500/5 border border-purple-900/30 rounded-xl p-3">
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">
                    Network
                  </p>
                  <p className="text-white text-sm font-medium">
                    {details.networks[0].name}
                  </p>
                </div>
              )}
              {isTV && details.type && (
                <div className="bg-purple-500/5 border border-purple-900/30 rounded-xl p-3">
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">
                    Type
                  </p>
                  <p className="text-white text-sm font-medium">
                    {details.type}
                  </p>
                </div>
              )}
              {!isTV && details.budget > 0 && (
                <div className="bg-purple-500/5 border border-purple-900/30 rounded-xl p-3">
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">
                    Budget
                  </p>
                  <p className="text-white text-sm font-medium">
                    ${(details.budget / 1e6).toFixed(0)}M
                  </p>
                </div>
              )}
              {!isTV && details.revenue > 0 && (
                <div className="bg-purple-500/5 border border-purple-900/30 rounded-xl p-3">
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider mb-1">
                    Revenue
                  </p>
                  <p className="text-white text-sm font-medium">
                    ${(details.revenue / 1e6).toFixed(0)}M
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-purple-900/30 flex items-center justify-between flex-shrink-0 bg-[#0f0f1a]">
          <button
            onClick={() => {
              onRemove(item.id);
              onClose();
            }}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm transition-all duration-200"
          >
            <FiTrash2 size={14} /> Remove from Watchlist
          </button>
          <button
            className={`flex items-center gap-2 bg-gradient-to-r ${accentColor} hover:opacity-90 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-purple-900/40 transition-all duration-200`}
          >
            <FaPlay size={10} /> {isTV ? 'Watch Trailer' : 'Watch Trailer'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= WATCHLIST PAGE ================= */
const WatchList = () => {
  const { movieWatchlist, tvWatchlist, removeFromWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' | 'tv'
  const [viewMode, setViewMode] = useState('grid');
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterSource, setFilterSource] = useState('all');

  const activeList = activeTab === 'movies' ? movieWatchlist : tvWatchlist;
  const accentColor = activeTab === 'tv' ? 'violet' : 'purple';

  useEffect(() => {
    setFilterSource('all');
  }, [activeTab]);

  const grouped = activeList.reduce((acc, item) => {
    const key = item._source || 'popular';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const allSources = Object.keys(grouped);
  const filteredItems =
    filterSource === 'all'
      ? activeList
      : activeList.filter((m) => (m._source || 'popular') === filterSource);
  const filteredGrouped =
    filterSource === 'all'
      ? grouped
      : { [filterSource]: grouped[filterSource] || [] };

  /* ================= EMPTY STATE ================= */
  const totalCount = movieWatchlist.length + tvWatchlist.length;

  if (totalCount === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] pt-24 flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
          <FiBookmark size={36} className="text-purple-400" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">
          Your Watchlist is Empty
        </h2>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          Start adding movies and TV shows using the bookmark icon on any card.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center text-xs text-gray-600">
          <span className="border border-purple-900/30 px-3 py-1.5 rounded-full">
            🔥 Trending Today
          </span>
          <span className="border border-purple-900/30 px-3 py-1.5 rounded-full">
            🗓 Coming Soon
          </span>
          <span className="border border-purple-900/30 px-3 py-1.5 rounded-full">
            🎬 Popular Movies
          </span>
          <span className="border border-purple-900/30 px-3 py-1.5 rounded-full">
            📺 TV Shows
          </span>
        </div>
      </div>
    );
  }

  /* ================= CARDS ================= */
  const GridCard = ({ item }) => {
    const sourceMeta = getSourceMeta(item._source);
    const title = item.title || item.name;
    const isTV = item._mediaType === 'tv';
    return (
      <div
        className="relative group cursor-pointer"
        onClick={() => setSelectedItem(item)}
      >
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden border border-purple-900/30 group-hover:border-purple-500/40 shadow-md group-hover:shadow-xl group-hover:shadow-purple-900/30 transition-all duration-300">
          <ImageOrFallback
            src={item.poster_path ? IMG_W + item.poster_path : ''}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div
            className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full border ${sourceMeta.color}`}
          >
            {sourceMeta.label}
          </div>
          {isTV && (
            <div className="absolute top-2 left-2 mt-5 bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[9px] px-1.5 py-0.5 rounded-full">
              TV
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFromWatchlist(item.id);
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <FiX size={13} />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
            <AiFillStar className="text-yellow-400" size={10} />
            <span className="text-yellow-400 text-xs font-bold">
              {item.vote_average?.toFixed(1)}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-11 h-11 rounded-full bg-purple-600/80 border-2 border-white/30 flex items-center justify-center text-white shadow-lg">
              <FaPlay size={12} className="ml-0.5" />
            </div>
          </div>
        </div>
        <div className="mt-2 px-0.5">
          <p className="text-white text-sm font-semibold line-clamp-1 group-hover:text-purple-300 transition-colors">
            {title}
          </p>
          <p className="text-gray-600 text-xs mt-0.5">
            {(item.release_date || item.first_air_date)?.slice(0, 4)}
          </p>
        </div>
      </div>
    );
  };

  const ListCard = ({ item }) => {
    const sourceMeta = getSourceMeta(item._source);
    const title = item.title || item.name;
    const isTV = item._mediaType === 'tv';
    const genres = (item.genre_ids || [])
      .slice(0, 3)
      .map((id) => GENRE_MAP[id])
      .filter(Boolean);
    return (
      <div
        className="flex items-center gap-4 p-4 rounded-xl border border-purple-900/20 hover:border-purple-500/30 hover:bg-purple-500/5 cursor-pointer group transition-all duration-200"
        onClick={() => setSelectedItem(item)}
      >
        <div className="w-[60px] h-[88px] flex-shrink-0 rounded-lg overflow-hidden border border-purple-900/30 group-hover:border-purple-500/30 transition-all duration-200">
          <ImageOrFallback
            src={item.poster_path ? IMG_W + item.poster_path : ''}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="w-[120px] h-[68px] flex-shrink-0 rounded-lg overflow-hidden border border-purple-900/30 hidden sm:block">
          <ImageOrFallback
            src={
              item.backdrop_path
                ? `https://image.tmdb.org/t/p/w300${item.backdrop_path}`
                : ''
            }
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors line-clamp-1">
              {title}
            </p>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${sourceMeta.color}`}
            >
              {sourceMeta.label}
            </span>
            {isTV && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 text-violet-400 border-violet-500/30 bg-violet-500/10">
                TV
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mb-2 line-clamp-2">
            {item.overview}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <AiFillStar className="text-yellow-400" size={11} />
              <span className="text-yellow-300 text-xs font-bold">
                {item.vote_average?.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-700">·</span>
            <span className="text-gray-500 text-xs">
              {(item.release_date || item.first_air_date)?.slice(0, 4)}
            </span>
            {genres.map((g) => (
              <span
                key={g}
                className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/15"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFromWatchlist(item.id);
            }}
            className="w-8 h-8 rounded-full bg-black/40 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/40 flex items-center justify-center transition-all duration-200"
          >
            <FiTrash2 size={13} />
          </button>
          <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <FaBookmark size={11} />
          </div>
        </div>
      </div>
    );
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 px-8 pb-16">
      <style>{`*::-webkit-scrollbar{display:none}`}</style>

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-1 h-8 bg-gradient-to-b ${activeTab === 'tv' ? 'from-violet-500 to-purple-500' : 'from-purple-500 to-fuchsia-500'} rounded-full`}
          />
          <div>
            <h1 className="text-white text-2xl font-bold">My Watchlist</h1>
            <p className="text-gray-600 text-sm">
              {movieWatchlist.length} movie
              {movieWatchlist.length !== 1 ? 's' : ''} · {tvWatchlist.length} TV
              show{tvWatchlist.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* SOURCE FILTER */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterSource('all')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${filterSource === 'all' ? `bg-${accentColor}-500 border-${accentColor}-500 text-white` : 'border-purple-900/40 text-gray-400 hover:text-white hover:border-purple-500/40'}`}
              style={
                filterSource === 'all'
                  ? {
                      backgroundColor:
                        activeTab === 'tv'
                          ? 'rgb(139 92 246)'
                          : 'rgb(168 85 247)',
                      borderColor: 'transparent',
                    }
                  : {}
              }
            >
              All
            </button>
            {allSources.map((src) => {
              const meta = getSourceMeta(src);
              return (
                <button
                  key={src}
                  onClick={() => setFilterSource(src)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${filterSource === src ? 'bg-purple-500 border-purple-500 text-white' : 'border-purple-900/40 text-gray-400 hover:text-white hover:border-purple-500/40'}`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>

          {/* GROUP TOGGLE */}
          <button
            onClick={() => setGroupByCategory(!groupByCategory)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${groupByCategory ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300' : 'border-purple-900/40 text-gray-400 hover:text-white'}`}
          >
            {groupByCategory ? 'Grouped' : 'All Together'}
          </button>

          {/* VIEW MODE */}
          <div className="flex items-center bg-purple-900/20 border border-purple-900/40 rounded-lg p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-500 hover:text-white'}`}
            >
              <FiGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-500 hover:text-white'}`}
            >
              <FiList size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* MOVIES / TV TABS */}
      <div className="flex gap-1 mb-8 bg-purple-900/10 border border-purple-900/30 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('movies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'movies' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-400 hover:text-white'}`}
        >
          <FiFilm size={15} /> Movies
          {movieWatchlist.length > 0 && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'movies' ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-400'}`}
            >
              {movieWatchlist.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tv')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'tv' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-900/40' : 'text-gray-400 hover:text-white'}`}
        >
          <FiTv size={15} /> TV Shows
          {tvWatchlist.length > 0 && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'tv' ? 'bg-white/20 text-white' : 'bg-violet-500/20 text-violet-400'}`}
            >
              {tvWatchlist.length}
            </span>
          )}
        </button>
      </div>

      {/* EMPTY TAB STATE */}
      {activeList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className={`w-16 h-16 rounded-full ${activeTab === 'tv' ? 'bg-violet-500/10 border-violet-500/20' : 'bg-purple-500/10 border-purple-500/20'} border flex items-center justify-center mb-4`}
          >
            {activeTab === 'tv' ? (
              <FiTv size={28} className="text-violet-400" />
            ) : (
              <FiFilm size={28} className="text-purple-400" />
            )}
          </div>
          <p className="text-white font-semibold mb-1">
            No {activeTab === 'tv' ? 'TV shows' : 'movies'} saved yet
          </p>
          <p className="text-gray-600 text-sm">
            Bookmark{' '}
            {activeTab === 'tv'
              ? 'shows from the TV Shows page'
              : 'movies from the Movies page'}
          </p>
        </div>
      )}

      {/* CONTENT */}
      {activeList.length > 0 &&
        (groupByCategory ? (
          Object.entries(filteredGrouped).map(([source, items]) => {
            if (!items || items.length === 0) return null;
            const meta = getSourceMeta(source);
            return (
              <div key={source} className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full border ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {items.length} title{items.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex-1 h-px bg-purple-900/30" />
                </div>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {items.map((item) => (
                      <GridCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <ListCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <GridCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredItems.map((item) => (
              <ListCard key={item.id} item={item} />
            ))}
          </div>
        ))}

      {/* MODAL */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRemove={(id) => {
            removeFromWatchlist(id);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default WatchList;
