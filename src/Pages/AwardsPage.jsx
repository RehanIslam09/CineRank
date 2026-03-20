import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FiBookmark,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
} from 'react-icons/fi';
import {
  FaBookmark,
  FaPlay,
  FaStar,
  FaTrophy,
  FaMedal,
  FaCrown,
} from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { MdCalendarToday } from 'react-icons/md';
import { useWatchlist } from '../context/WatchlistContext';

/* ─────────────────────────────────────────────
   IMAGE FALLBACK
───────────────────────────────────────────── */
const ImageOrFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={`${className} relative overflow-hidden bg-[#1a1610] flex items-center justify-center`}
      >
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
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
                className="text-yellow-600 text-xs font-mono whitespace-nowrap px-3 py-2"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-yellow-600/50 text-sm uppercase tracking-widest">
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

/* ─────────────────────────────────────────────
   API
───────────────────────────────────────────── */
const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE = 'https://api.themoviedb.org/3';
const W500 = 'https://image.tmdb.org/t/p/w500';
const ORIG = 'https://image.tmdb.org/t/p/original';
const W300 = 'https://image.tmdb.org/t/p/w300';
const W185 = 'https://image.tmdb.org/t/p/w185';

const get = (path, params = {}) =>
  axios.get(`${BASE}${path}`, {
    params: { api_key: API_KEY, language: 'en-US', ...params },
  });

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const AWARD_SHOWS = [
  {
    id: 'oscars',
    name: 'Academy Awards',
    short: 'Oscars',
    edition: '97th',
    date: 'March 2, 2025',
    network: 'ABC',
    color: 'from-yellow-600/30 to-amber-800/20',
    border: 'border-yellow-600/40',
    accent: 'text-yellow-400',
    badge: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
    icon: '🏆',
    description: 'The most prestigious night in cinema',
  },
  {
    id: 'golden-globes',
    name: 'Golden Globe Awards',
    short: 'Golden Globes',
    edition: '82nd',
    date: 'Jan 5, 2025',
    network: 'CBS',
    color: 'from-amber-500/25 to-yellow-900/20',
    border: 'border-amber-500/35',
    accent: 'text-amber-400',
    badge: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
    icon: '🌐',
    description: 'Hollywood Foreign Press celebrates film & TV',
  },
  {
    id: 'bafta',
    name: 'BAFTA Film Awards',
    short: 'BAFTA',
    edition: '78th',
    date: 'Feb 16, 2025',
    network: 'BBC',
    color: 'from-violet-600/25 to-purple-900/20',
    border: 'border-violet-500/35',
    accent: 'text-violet-400',
    badge: 'bg-violet-500/20 border-violet-500/30 text-violet-300',
    icon: '🎭',
    description: "Britain's highest film honours",
  },
  {
    id: 'cannes',
    name: 'Cannes Film Festival',
    short: 'Cannes',
    edition: '78th',
    date: 'May 2025',
    network: 'Canal+',
    color: 'from-red-700/25 to-rose-900/20',
    border: 'border-red-600/35',
    accent: 'text-red-400',
    badge: 'bg-red-500/20 border-red-500/30 text-red-300',
    icon: '🌴',
    description: "The Palme d'Or — cinema's grandest prize",
  },
  {
    id: 'sag',
    name: 'SAG Awards',
    short: 'SAG',
    edition: '31st',
    date: 'Feb 23, 2025',
    network: 'Netflix',
    color: 'from-blue-600/25 to-indigo-900/20',
    border: 'border-blue-500/35',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    icon: '🎬',
    description: 'Screen Actors Guild honors performance',
  },
  {
    id: 'emmy',
    name: 'Emmy Awards',
    short: 'Emmy',
    edition: '77th',
    date: 'Sep 22, 2025',
    network: 'CBS',
    color: 'from-emerald-600/25 to-green-900/20',
    border: 'border-emerald-500/35',
    accent: 'text-emerald-400',
    badge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    icon: '📺',
    description: "Television's highest honour",
  },
];

const CATEGORY_GENRES = [
  {
    label: 'Best Drama',
    genreId: 18,
    accent: 'from-rose-600/20 to-red-900/10',
    border: 'border-rose-600/30',
    text: 'text-rose-400',
    badge: '🎭',
  },
  {
    label: 'Best Comedy',
    genreId: 35,
    accent: 'from-amber-500/20 to-yellow-900/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: '😄',
  },
  {
    label: 'Best Animation',
    genreId: 16,
    accent: 'from-cyan-600/20 to-blue-900/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    badge: '✨',
  },
  {
    label: 'Best Sci-Fi',
    genreId: 878,
    accent: 'from-violet-600/20 to-purple-900/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    badge: '🚀',
  },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const RANK_STYLES = [
  {
    ring: 'ring-yellow-400/60',
    bg: 'bg-yellow-400/10',
    text: 'text-yellow-300',
    icon: <FaCrown size={11} className="text-yellow-400" />,
    label: 'Gold',
  },
  {
    ring: 'ring-gray-300/50',
    bg: 'bg-gray-300/10',
    text: 'text-gray-300',
    icon: <FaTrophy size={11} className="text-gray-300" />,
    label: 'Silver',
  },
  {
    ring: 'ring-amber-600/60',
    bg: 'bg-amber-700/10',
    text: 'text-amber-500',
    icon: <FaMedal size={11} className="text-amber-600" />,
    label: 'Bronze',
  },
];

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'TBA';

/* ─────────────────────────────────────────────
   SHIMMER SKELETON
───────────────────────────────────────────── */
const Shimmer = ({ className }) => (
  <div
    className={`${className} bg-gradient-to-r from-yellow-900/10 via-yellow-700/15 to-yellow-900/10 animate-pulse rounded-xl`}
  />
);

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
const SectionHeader = ({ icon, title, subtitle, count, gold }) => (
  <div className="flex items-start justify-between mb-6">
    <div className="flex items-center gap-3">
      <span
        className={`w-1 h-8 rounded-full ${gold ? 'bg-gradient-to-b from-yellow-400 to-amber-600' : 'bg-gradient-to-b from-purple-500 to-fuchsia-500'}`}
      />
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <h2
            className={`font-black text-xl tracking-tight ${gold ? 'text-yellow-100' : 'text-white'}`}
          >
            {title}
          </h2>
          {count && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${gold ? 'bg-yellow-500/15 border-yellow-500/25 text-yellow-400' : 'bg-purple-500/15 border-purple-500/25 text-purple-400'}`}
            >
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-gray-500 text-xs mt-0.5 ml-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   AWARD SHOW CARD
───────────────────────────────────────────── */
const AwardShowCard = ({ show, active, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex-shrink-0 w-[210px] rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${show.border} ${active ? `bg-gradient-to-br ${show.color} scale-[1.02] shadow-xl` : 'bg-[#0f0e0a] hover:bg-[#141208] hover:scale-[1.01]'}`}
  >
    {/* Subtle glow bg */}
    <div
      className={`absolute inset-0 bg-gradient-to-br ${show.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
    />

    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl leading-none">{show.icon}</span>
        <span
          className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${show.badge}`}
        >
          {show.edition}
        </span>
      </div>
      <h3
        className={`font-black text-sm leading-snug mb-1 ${active ? show.accent : 'text-white group-hover:' + show.accent} transition-colors duration-200`}
      >
        {show.short}
      </h3>
      <p className="text-gray-600 text-[10px] leading-relaxed line-clamp-2 mb-2.5">
        {show.description}
      </p>
      <div className="flex items-center gap-1.5">
        <MdCalendarToday size={9} className="text-gray-600" />
        <span className="text-gray-500 text-[10px]">{show.date}</span>
      </div>
      <div className="mt-1.5">
        <span className="text-gray-700 text-[9px] uppercase tracking-widest">
          {show.network}
        </span>
      </div>
    </div>

    {active && (
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent ${show.accent.replace('text-', 'via-')} to-transparent`}
      />
    )}
  </button>
);

/* ─────────────────────────────────────────────
   BEST PICTURE CONTENDER CARD  (hero row)
───────────────────────────────────────────── */
const ContenderCard = ({ movie, rank, onSelect }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);
  const rs = RANK_STYLES[rank - 1] || RANK_STYLES[2];
  const isPodium = rank <= 3;

  return (
    <div
      onClick={() => onSelect && onSelect(movie)}
      className={`group relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${isPodium ? `ring-1 ${rs.ring} border-transparent` : 'border-yellow-900/25 hover:border-yellow-600/30'}`}
      style={{ width: '160px' }}
    >
      {/* Poster */}
      <div className="relative h-[220px] overflow-hidden">
        <ImageOrFallback
          src={movie.poster_path ? W500 + movie.poster_path : ''}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        {/* Rank badge */}
        <div
          className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border backdrop-blur-sm ${isPodium ? `${rs.bg} ${rs.text}` : 'bg-black/70 text-gray-400 border-white/10'}`}
        >
          {isPodium && rs.icon}#{rank}
        </div>

        {/* Watchlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            saved
              ? removeFromWatchlist(movie.id)
              : addToWatchlist(movie, 'awards', 'movie');
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 opacity-0 group-hover:opacity-100 ${saved ? 'bg-yellow-500/30 border-yellow-400/50 text-yellow-300' : 'bg-black/60 border-white/15 text-white/70 hover:bg-yellow-500/20 hover:border-yellow-400/40 hover:text-yellow-300'}`}
        >
          {saved ? <FaBookmark size={9} /> : <FiBookmark size={9} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 bg-[#0f0e0a]">
        <h4
          className={`text-xs font-bold leading-snug line-clamp-2 mb-1 group-hover:text-yellow-300 transition-colors duration-200 ${isPodium ? rs.text : 'text-white'}`}
        >
          {movie.title}
        </h4>
        <div className="flex items-center gap-1">
          <AiFillStar className="text-yellow-500" size={10} />
          <span className="text-yellow-400/80 text-[10px] font-bold">
            {movie.vote_average?.toFixed(1)}
          </span>
          <span className="text-gray-700 text-[9px]">
            ({(movie.vote_count / 1000).toFixed(0)}k)
          </span>
        </div>
        {movie.release_date && (
          <p className="text-gray-600 text-[9px] mt-0.5">
            {movie.release_date.slice(0, 4)}
          </p>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   RANKED LIST ROW
───────────────────────────────────────────── */
const RankedRow = ({ movie, rank }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);
  const rs = RANK_STYLES[rank - 1];
  const isPodium = rank <= 3;

  return (
    <div
      className={`group flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-200 hover:bg-yellow-500/5 cursor-pointer ${isPodium ? `border-yellow-900/40 hover:border-yellow-600/30` : 'border-[#1a1710] hover:border-yellow-900/30'}`}
    >
      {/* Rank */}
      <div
        className={`w-8 text-center font-black text-base flex-shrink-0 ${isPodium ? rs.text : 'text-gray-700'}`}
      >
        {isPodium ? rs.icon : `#${rank}`}
      </div>

      {/* Poster */}
      <div
        className={`w-10 h-[58px] rounded-lg overflow-hidden flex-shrink-0 border ${isPodium ? rs.ring.replace('ring-', 'border-').replace('/60', '/40') : 'border-yellow-900/20'}`}
      >
        <ImageOrFallback
          src={movie.poster_path ? W500 + movie.poster_path : ''}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4
          className={`text-sm font-bold line-clamp-1 group-hover:text-yellow-300 transition-colors duration-200 ${isPodium ? rs.text : 'text-white'}`}
        >
          {movie.title}
        </h4>
        <p className="text-gray-600 text-xs line-clamp-1 mt-0.5">
          {movie.overview}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <AiFillStar className="text-yellow-500" size={11} />
        <span className="text-yellow-400 text-xs font-bold">
          {movie.vote_average?.toFixed(1)}
        </span>
      </div>

      {/* Year */}
      <span className="text-gray-700 text-xs flex-shrink-0 hidden sm:block">
        {movie.release_date?.slice(0, 4)}
      </span>

      {/* Bookmark */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          saved
            ? removeFromWatchlist(movie.id)
            : addToWatchlist(movie, 'awards', 'movie');
        }}
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 opacity-0 group-hover:opacity-100 ${saved ? 'bg-yellow-500/25 border-yellow-400/40 text-yellow-300 opacity-100' : 'bg-black/30 border-white/10 text-white/50 hover:bg-yellow-500/15 hover:border-yellow-400/30 hover:text-yellow-300'}`}
      >
        {saved ? <FaBookmark size={9} /> : <FiBookmark size={9} />}
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PERSON CARD  (actor / director contenders)
───────────────────────────────────────────── */
const PersonCard = ({ person, rank, category }) => (
  <div className="group flex flex-col items-center gap-2 cursor-pointer">
    {/* Portrait */}
    <div
      className={`relative w-[90px] h-[90px] rounded-full overflow-hidden border-2 transition-all duration-200 group-hover:scale-105 ${rank <= 3 ? RANK_STYLES[rank - 1].ring.replace('ring-', 'border-').replace('/60', '/80') : 'border-yellow-900/30 group-hover:border-yellow-600/40'}`}
    >
      <ImageOrFallback
        src={person.profile_path ? W185 + person.profile_path : ''}
        alt={person.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      {rank <= 3 && (
        <div
          className={`absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center border ${RANK_STYLES[rank - 1].bg} border-white/20`}
        >
          {RANK_STYLES[rank - 1].icon}
        </div>
      )}
    </div>
    <div className="text-center">
      <p className="text-white text-xs font-bold line-clamp-1 group-hover:text-yellow-300 transition-colors duration-200">
        {person.name}
      </p>
      <p className="text-gray-600 text-[10px] line-clamp-1">
        {person.known_for?.[0]?.title || person.known_for?.[0]?.name || '—'}
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   GENRE CATEGORY SECTION
───────────────────────────────────────────── */
const GenreCategoryRow = ({ cat, movies, loading }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' });
  };

  return (
    <div
      className={`rounded-2xl border p-5 bg-gradient-to-br ${cat.accent} ${cat.border}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cat.badge}</span>
          <h3 className={`font-black text-base ${cat.text}`}>{cat.label}</h3>
          <span
            className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${cat.border} ${cat.text} bg-black/30`}
          >
            Top Picks
          </span>
        </div>
        <div className="flex gap-1">
          {[FiChevronLeft, FiChevronRight].map((Icon, i) => (
            <button
              key={i}
              onClick={() => scroll(i === 0 ? -1 : 1)}
              className="w-7 h-7 rounded-full bg-black/40 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 flex items-center justify-center transition-all duration-200"
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Shimmer key={i} className="flex-shrink-0 w-[120px] h-[175px]" />
            ))
          : movies.map((m, i) => {
              const saved = isInWatchlist(m.id);
              return (
                <div
                  key={m.id}
                  className="group relative flex-shrink-0 w-[120px] rounded-xl overflow-hidden border border-black/40 hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <div className="relative h-[160px]">
                    <ImageOrFallback
                      src={m.poster_path ? W500 + m.poster_path : ''}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-white/10">
                      #{i + 1}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saved
                          ? removeFromWatchlist(m.id)
                          : addToWatchlist(m, 'awards', 'movie');
                      }}
                      className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 opacity-0 group-hover:opacity-100 ${saved ? 'bg-yellow-500/30 border-yellow-400/50 text-yellow-300' : 'bg-black/60 border-white/10 text-white/60 hover:text-yellow-300'}`}
                    >
                      {saved ? (
                        <FaBookmark size={8} />
                      ) : (
                        <FiBookmark size={8} />
                      )}
                    </button>
                  </div>
                  <div className="p-2 bg-black/60 backdrop-blur-sm">
                    <p className="text-white text-[10px] font-bold line-clamp-2 leading-snug">
                      {m.title}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      <AiFillStar className="text-yellow-500" size={8} />
                      <span className="text-yellow-400/80 text-[9px]">
                        {m.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SPOTLIGHT MODAL  (click a contender)
───────────────────────────────────────────── */
const SpotlightModal = ({ movie, onClose }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative z-10 bg-[#0f0e0a] border border-yellow-900/40 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop */}
        {movie.backdrop_path && (
          <div className="relative h-[200px] overflow-hidden">
            <img
              src={W300 + movie.backdrop_path}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e0a] to-transparent" />
          </div>
        )}
        <div className="p-6 -mt-10 relative">
          <div className="flex items-end gap-4 mb-4">
            <div className="w-[70px] h-[100px] rounded-xl overflow-hidden border border-yellow-600/40 shadow-xl flex-shrink-0">
              <ImageOrFallback
                src={movie.poster_path ? W500 + movie.poster_path : ''}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-yellow-100 text-xl font-black leading-tight">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <AiFillStar className="text-yellow-400" size={13} />
                <span className="text-yellow-300 font-bold text-sm">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-600 text-xs">
                  · {movie.release_date?.slice(0, 4)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-4">
            {movie.overview}
          </p>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all duration-200">
              <FaPlay size={11} /> Watch Trailer
            </button>
            <button
              onClick={() =>
                saved
                  ? removeFromWatchlist(movie.id)
                  : addToWatchlist(movie, 'awards', 'movie')
              }
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${saved ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-yellow-500/10 hover:border-yellow-500/30 hover:text-yellow-300'}`}
            >
              {saved ? <FaBookmark size={11} /> : <FiBookmark size={11} />}
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm text-gray-500 border border-white/8 hover:border-white/15 transition-all duration-200"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const AwardsPage = () => {
  const [activeShow, setActiveShow] = useState('oscars');
  const [bestPicture, setBestPicture] = useState([]);
  const [actors, setActors] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const showsRef = useRef(null);

  /* ── FETCH MAIN DATA ── */
  useEffect(() => {
    const fetchMain = async () => {
      setLoadingMain(true);
      try {
        const [topRatedRes, actorsRes, directorsRes] = await Promise.all([
          get('/discover/movie', {
            sort_by: 'vote_average.desc',
            'vote_count.gte': 5000,
            'vote_average.gte': 7.5,
            with_genres: '18', // drama — most award-bait genre
            page: 1,
          }),
          get('/person/popular', { page: 1 }),
          get('/person/popular', { page: 2 }),
        ]);

        const films = topRatedRes.data.results.slice(0, 20);
        setBestPicture(films);
        setHeroMovie(films[0] || null);

        // Actors — filter those known for movies
        const rawActors = actorsRes.data.results
          .filter((p) => p.known_for_department === 'Acting' && p.profile_path)
          .slice(0, 10);
        setActors(rawActors);

        // Directors — second page, filter directors
        const rawDirectors = directorsRes.data.results
          .filter(
            (p) => p.known_for_department === 'Directing' && p.profile_path,
          )
          .slice(0, 10);
        setDirectors(rawDirectors);
      } catch (e) {
        console.error('AwardsPage main fetch error', e);
      } finally {
        setLoadingMain(false);
      }
    };
    fetchMain();
  }, []);

  /* ── FETCH GENRE FILMS ── */
  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const results = await Promise.all(
          CATEGORY_GENRES.map((cat) =>
            get('/discover/movie', {
              sort_by: 'vote_average.desc',
              'vote_count.gte': 1000,
              with_genres: String(cat.genreId),
              page: 1,
            }),
          ),
        );
        const map = {};
        CATEGORY_GENRES.forEach((cat, i) => {
          map[cat.label] = results[i].data.results.slice(0, 10);
        });
        setGenreMovies(map);
      } catch (e) {
        console.error('AwardsPage genre fetch error', e);
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  const scrollShows = (dir) => {
    showsRef.current?.scrollBy({ left: dir * 250, behavior: 'smooth' });
  };

  const currentShow = AWARD_SHOWS.find((s) => s.id === activeShow);

  /* ── HERO BACKDROP ── */
  const heroBg = heroMovie?.backdrop_path
    ? ORIG + heroMovie.backdrop_path
    : null;

  return (
    <div className="min-h-screen bg-[#0a0908] pt-16">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .gold-shimmer {
          background: linear-gradient(105deg, #78350f 0%, #d97706 30%, #fbbf24 50%, #d97706 70%, #78350f 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldshine 4s linear infinite;
        }
        @keyframes goldshine {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .award-glow { box-shadow: 0 0 60px 20px rgba(180,120,20,0.12), 0 0 120px 60px rgba(120,80,10,0.06); }
      `}</style>

      {/* ═══════════════════════════════════════
          HERO — CINEMATIC HEADER
      ═══════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '460px' }}
      >
        {/* Background */}
        {heroBg ? (
          <>
            <img
              src={heroBg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-20 pointer-events-none"
            />
            <img
              src={heroBg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-amber-900/10 to-[#0a0908]" />
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/70 to-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/90 via-transparent to-[#0a0908]/60 z-10" />

        {/* Gold particle dots — decorative */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-yellow-400/30"
              style={{
                width: `${2 + (i % 4)}px`,
                height: `${2 + (i % 4)}px`,
                top: `${10 + ((i * 31) % 75)}%`,
                left: `${5 + ((i * 17) % 88)}%`,
                animationDelay: `${(i * 0.4) % 3}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-end px-8 pb-10 max-w-7xl mx-auto">
          {/* Pill */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-2 bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs px-4 py-1.5 rounded-full font-semibold uppercase tracking-wider">
              <FaTrophy size={11} /> Awards Season 2024–25
            </span>
            <span className="text-gray-700 text-xs">·</span>
            <span className="text-gray-600 text-xs">6 Major Ceremonies</span>
          </div>

          <h1
            className="gold-shimmer font-black leading-none mb-3"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-0.02em',
            }}
          >
            Awards Central
          </h1>
          <p className="text-gray-400 text-base max-w-xl leading-relaxed mb-6">
            Track nominees, winners, and contenders across every major award
            show. From the Oscars to Cannes — your complete awards season guide.
          </p>

          {/* Hero film info */}
          {heroMovie && !loadingMain && (
            <div className="flex items-center gap-3">
              <div className="w-[44px] h-[62px] rounded-xl overflow-hidden border border-yellow-600/40 shadow-xl flex-shrink-0">
                <ImageOrFallback
                  src={
                    heroMovie.poster_path ? W500 + heroMovie.poster_path : ''
                  }
                  alt={heroMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-0.5">
                  Featured Contender
                </p>
                <p className="text-yellow-200 text-sm font-bold">
                  {heroMovie.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <AiFillStar className="text-yellow-500" size={11} />
                  <span className="text-yellow-400 text-xs font-semibold">
                    {heroMovie.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-gray-700 text-xs">
                    · {heroMovie.release_date?.slice(0, 4)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          AWARD SHOWS STRIP
      ═══════════════════════════════════════ */}
      <div className="border-y border-yellow-900/20 bg-[#0c0b08]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-full" />
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">
                Award Shows
              </h2>
            </div>
            <div className="flex gap-1.5">
              {[FiChevronLeft, FiChevronRight].map((Icon, i) => (
                <button
                  key={i}
                  onClick={() => scrollShows(i === 0 ? -1 : 1)}
                  className="w-7 h-7 rounded-full bg-[#0f0e0a] border border-yellow-900/30 text-gray-500 hover:text-yellow-400 hover:border-yellow-600/40 flex items-center justify-center transition-all duration-200"
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>
          <div
            ref={showsRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
          >
            {AWARD_SHOWS.map((show) => (
              <AwardShowCard
                key={show.id}
                show={show}
                active={activeShow === show.id}
                onClick={() => setActiveShow(show.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          ACTIVE SHOW BANNER
      ═══════════════════════════════════════ */}
      {currentShow && (
        <div
          className={`border-b ${currentShow.border} bg-gradient-to-r ${currentShow.color}`}
        >
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
            <span className="text-2xl">{currentShow.icon}</span>
            <div className="flex-1">
              <span className={`font-black text-sm ${currentShow.accent}`}>
                {currentShow.name}
              </span>
              <span className="text-gray-600 text-xs ml-2">
                · {currentShow.date} · {currentShow.network}
              </span>
            </div>
            <span
              className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${currentShow.badge}`}
            >
              {currentShow.edition} Edition
            </span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">
        {/* ── BEST PICTURE CONTENDERS (horizontal scroll of poster cards) ── */}
        <section>
          <SectionHeader
            icon="🎬"
            title="Best Picture Contenders"
            subtitle="Top-rated dramatic films — ranked by audience score & critical acclaim"
            count={bestPicture.length ? `${bestPicture.length} films` : null}
            gold
          />

          {loadingMain ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[160px]">
                  <Shimmer className="h-[220px] w-full" />
                  <Shimmer className="h-8 w-full mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {bestPicture.map((m, i) => (
                  <ContenderCard
                    key={m.id}
                    movie={m}
                    rank={i + 1}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </div>
              {/* Fade edges */}
              <div className="absolute top-0 left-0 bottom-2 w-8 bg-gradient-to-r from-[#0a0908] to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 bottom-2 w-16 bg-gradient-to-l from-[#0a0908] to-transparent pointer-events-none" />
            </div>
          )}
        </section>

        {/* ── TWO COLUMN: RANKED LIST  +  PEOPLE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Left — Ranked list */}
          <section>
            <SectionHeader
              icon="📋"
              title="Full Rankings"
              subtitle="All contenders ranked by score"
              gold
            />
            <div className="space-y-2">
              {loadingMain
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Shimmer key={i} className="h-[70px] w-full" />
                  ))
                : bestPicture.map((m, i) => (
                    <RankedRow key={m.id} movie={m} rank={i + 1} />
                  ))}
            </div>
          </section>

          {/* Right — Actors + Directors */}
          <div className="space-y-10">
            {/* Best Actor Contenders */}
            <section>
              <SectionHeader
                icon="🎭"
                title="Acting Contenders"
                subtitle="Most celebrated performers"
                gold
              />
              {loadingMain ? (
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <Shimmer className="w-[70px] h-[70px] rounded-full" />
                      <Shimmer className="h-2 w-14" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {actors.slice(0, 8).map((p, i) => (
                    <PersonCard
                      key={p.id}
                      person={p}
                      rank={i + 1}
                      category="actor"
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Best Director Contenders */}
            <section>
              <SectionHeader
                icon="🎥"
                title="Directors"
                subtitle="Masters behind the camera"
                gold
              />
              {loadingMain ? (
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <Shimmer className="w-[70px] h-[70px] rounded-full" />
                      <Shimmer className="h-2 w-14" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {directors.slice(0, 8).map((p, i) => (
                    <PersonCard
                      key={p.id}
                      person={p}
                      rank={i + 1}
                      category="director"
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* ── GENRE CATEGORY AWARDS ── */}
        <section>
          <SectionHeader
            icon="🏅"
            title="Category Awards"
            subtitle="Best films across every genre"
            gold
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CATEGORY_GENRES.map((cat) => (
              <GenreCategoryRow
                key={cat.label}
                cat={cat}
                movies={genreMovies[cat.label] || []}
                loading={loadingGenres}
              />
            ))}
          </div>
        </section>

        {/* ── BOTTOM SPACER ── */}
        <div className="pb-8" />
      </div>

      {/* ── SPOTLIGHT MODAL ── */}
      {selectedMovie && (
        <SpotlightModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default AwardsPage;
