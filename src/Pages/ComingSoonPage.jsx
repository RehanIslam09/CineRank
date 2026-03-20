import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  FiBookmark,
  FiGrid,
  FiList,
  FiCalendar,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { FaBookmark, FaPlay, FaFire } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { MdCalendarToday, MdMovieFilter } from 'react-icons/md';
import { useWatchlist } from '../context/WatchlistContext';

/* ═══════════════════════════════════════════════
   IMAGE FALLBACK
═══════════════════════════════════════════════ */
const ImageOrFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={`${className} relative overflow-hidden bg-[#0d0b14] flex items-center justify-center`}
      >
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
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
                className="text-fuchsia-400 text-xs font-mono whitespace-nowrap px-3 py-2"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-fuchsia-400/30 text-[9px] uppercase tracking-widest">
          Not Available
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

/* ═══════════════════════════════════════════════
   API
═══════════════════════════════════════════════ */
const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE_URL = 'https://api.themoviedb.org/3';
const W500 = 'https://image.tmdb.org/t/p/w500';
const ORIG = 'https://image.tmdb.org/t/p/original';
const W300 = 'https://image.tmdb.org/t/p/w300';
const W185 = 'https://image.tmdb.org/t/p/w185';

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
  10402: 'Music',
  10770: 'TV Movie',
};

const GENRES_FILTER = [
  { id: null, label: 'All' },
  { id: 28, label: 'Action' },
  { id: 35, label: 'Comedy' },
  { id: 18, label: 'Drama' },
  { id: 27, label: 'Horror' },
  { id: 878, label: 'Sci-Fi' },
  { id: 53, label: 'Thriller' },
  { id: 16, label: 'Animation' },
  { id: 10749, label: 'Romance' },
  { id: 14, label: 'Fantasy' },
];

const SORT_OPTIONS = [
  { value: 'date_asc', label: 'Soonest First' },
  { value: 'date_desc', label: 'Latest First' },
  { value: 'popularity', label: 'Most Hyped' },
  { value: 'rating', label: 'Top Rated' },
];

/* ═══════════════════════════════════════════════
   URGENCY
═══════════════════════════════════════════════ */
const getUrgency = (dateStr) => {
  if (!dateStr) return 'tba';
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return 'released';
  if (diff <= 86400000) return 'tomorrow';
  if (diff <= 3 * 86400000) return 'days3';
  if (diff <= 7 * 86400000) return 'week';
  if (diff <= 30 * 86400000) return 'month';
  return 'later';
};

const UC = {
  released: {
    label: 'Out Now',
    bg: 'bg-green-500/20',
    border: 'border-green-500/45',
    text: 'text-green-300',
    dot: 'bg-green-400',
  },
  tomorrow: {
    label: 'Tomorrow!',
    bg: 'bg-red-500/25',
    border: 'border-red-500/55',
    text: 'text-red-300',
    dot: 'bg-red-400',
  },
  days3: {
    label: 'This Week',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/45',
    text: 'text-orange-300',
    dot: 'bg-orange-400',
  },
  week: {
    label: 'This Week',
    bg: 'bg-fuchsia-500/20',
    border: 'border-fuchsia-500/45',
    text: 'text-fuchsia-300',
    dot: 'bg-fuchsia-400',
  },
  month: {
    label: 'This Month',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/30',
    text: 'text-violet-300',
    dot: 'bg-violet-400',
  },
  later: {
    label: 'Coming Soon',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/22',
    text: 'text-cyan-400',
    dot: 'bg-cyan-500',
  },
  tba: {
    label: 'TBA',
    bg: 'bg-white/5',
    border: 'border-white/10',
    text: 'text-gray-400',
    dot: 'bg-gray-500',
  },
};

/* ═══════════════════════════════════════════════
   COUNTDOWN HOOK
═══════════════════════════════════════════════ */
const useCountdown = (targetDate) => {
  const [t, setT] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0)
        return setT({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          released: true,
        });
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        released: false,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
};

/* ═══════════════════════════════════════════════
   COUNTDOWN HERO  (large blocks)
═══════════════════════════════════════════════ */
const CountdownHero = ({ releaseDate, urgency }) => {
  const { days, hours, minutes, seconds } = useCountdown(releaseDate);
  const uc = UC[urgency] || UC.later;
  return (
    <div className="flex items-center gap-1.5">
      {[
        { v: days, label: 'Days' },
        { v: hours, label: 'Hrs' },
        { v: minutes, label: 'Min' },
        { v: seconds, label: 'Sec' },
      ].map(({ v, label }, i) => (
        <React.Fragment key={label}>
          <div
            className={`flex flex-col items-center justify-center rounded-xl border backdrop-blur-sm px-2.5 py-1.5 min-w-[46px] ${uc.bg} ${uc.border}`}
          >
            <span
              className={`text-xl font-black font-mono leading-none ${uc.text}`}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {String(v ?? 0).padStart(2, '0')}
            </span>
            <span
              className={`text-[8px] uppercase tracking-widest opacity-60 mt-0.5 ${uc.text}`}
            >
              {label}
            </span>
          </div>
          {i < 3 && (
            <span className={`text-base font-black mb-2 opacity-40 ${uc.text}`}>
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   COUNTDOWN COMPACT
═══════════════════════════════════════════════ */
const CountdownCompact = ({ releaseDate }) => {
  const { days, hours, minutes, released } = useCountdown(releaseDate);
  if (released)
    return (
      <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Out Now
      </span>
    );
  const uc = UC[getUrgency(releaseDate)];
  return (
    <span className={`font-mono font-bold text-[10px] ${uc.text}`}>
      {days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   HERO CAROUSEL
═══════════════════════════════════════════════ */
const HeroCarousel = ({ movies }) => {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const goTo = useCallback(
    (next) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setIdx(next);
        setFading(false);
      }, 450);
    },
    [fading],
  );

  useEffect(() => {
    if (!movies.length) return;
    timerRef.current = setInterval(() => goTo((idx + 1) % movies.length), 7000);
    return () => clearInterval(timerRef.current);
  }, [movies.length, idx, goTo]);

  const prev = () => {
    clearInterval(timerRef.current);
    goTo((idx - 1 + movies.length) % movies.length);
  };
  const next = () => {
    clearInterval(timerRef.current);
    goTo((idx + 1) % movies.length);
  };

  if (!movies.length)
    return (
      <div
        className="w-full bg-[#0a0812] animate-pulse"
        style={{ height: '85vh', maxHeight: '700px', minHeight: '520px' }}
      />
    );

  const m = movies[idx];
  const urg = getUrgency(m.release_date);
  const uc = UC[urg];
  const genres = (m.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);
  const saved = isInWatchlist(m.id);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#0a0812]"
      style={{ height: '85vh', maxHeight: '700px', minHeight: '520px' }}
    >
      {/* BG layers */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        {m.backdrop_path && (
          <>
            <img
              src={ORIG + m.backdrop_path}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-25 pointer-events-none"
            />
            <img
              src={ORIG + m.backdrop_path}
              alt={m.title}
              className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none"
              style={{ objectPosition: 'center 20%' }}
            />
          </>
        )}
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0812] via-[#0a0812]/55 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0812]/95 via-[#0a0812]/35 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950/15 to-cyan-950/8 z-10 pointer-events-none" />

      {/* Scan lines */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)',
          backgroundSize: '100% 3px',
        }}
      />

      {/* Orbs */}
      <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-fuchsia-600/5 blur-3xl z-10 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-cyan-600/4 blur-3xl z-10 pointer-events-none" />

      {/* CONTENT */}
      <div
        className={`relative z-20 h-full flex flex-col justify-end px-8 md:px-14 pb-12 transition-all duration-500 ${fading ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}
      >
        <div className="max-w-3xl">
          {/* Badges row */}
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span
              className={`flex items-center gap-2 text-[10px] px-3.5 py-1.5 rounded-full border font-bold uppercase tracking-widest backdrop-blur-sm ${uc.bg} ${uc.border} ${uc.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${uc.dot} ${urg === 'tomorrow' ? 'animate-pulse' : ''}`}
              />
              {uc.label}
            </span>
            {genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-gray-300 backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
            <span className="text-[9px] bg-black/40 backdrop-blur-sm border border-white/8 text-gray-500 px-2.5 py-1 rounded-full">
              #{idx + 1} of {movies.length}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-white font-black leading-[0.88] mb-4"
            style={{
              fontSize: 'clamp(2.8rem,7vw,5.5rem)',
              fontFamily: "'Georgia','Times New Roman',serif",
              letterSpacing: '-0.025em',
              textShadow:
                '0 0 80px rgba(232,121,249,0.12),0 4px 30px rgba(0,0,0,0.8)',
            }}
          >
            {m.title}
          </h1>

          {/* Overview */}
          <p
            className="text-gray-300/75 text-sm md:text-base leading-relaxed line-clamp-2 mb-6 max-w-2xl"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            {m.overview}
          </p>

          {/* CTA + countdown row */}
          <div className="flex flex-wrap items-center gap-4 md:gap-5">
            {urg !== 'released' && urg !== 'tba' && (
              <CountdownHero releaseDate={m.release_date} urgency={urg} />
            )}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2.5 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-fuchsia-900/50 transition-all duration-200 hover:scale-[1.03]">
                <FaPlay size={11} /> Watch Trailer
              </button>
              <button
                onClick={() =>
                  saved
                    ? removeFromWatchlist(m.id)
                    : addToWatchlist(m, 'upcoming')
                }
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 hover:scale-[1.03] backdrop-blur-sm ${saved ? 'bg-fuchsia-500/25 border-fuchsia-400/50 text-fuchsia-300' : 'bg-white/8 border-white/18 text-white/80 hover:bg-fuchsia-500/15 hover:border-fuchsia-400/40 hover:text-fuchsia-300'}`}
              >
                {saved ? <FaBookmark size={11} /> : <FiBookmark size={11} />}
                {saved ? 'Saved' : 'Watchlist'}
              </button>
              {m.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-yellow-500/18 px-3 py-2.5 rounded-xl">
                  <AiFillStar className="text-yellow-400" size={13} />
                  <span className="text-yellow-300 text-sm font-black">
                    {m.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-600 text-xs">/10</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail strip — bottom right */}
        <div className="absolute right-8 bottom-10 hidden lg:flex flex-col items-end gap-3 z-30">
          <div className="flex gap-2 items-end">
            {movies.map((mv, i) => (
              <button
                key={mv.id}
                onClick={() => goTo(i)}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 flex-shrink-0 ${i === idx ? 'w-[72px] h-[100px] border-fuchsia-400/70 shadow-xl shadow-fuchsia-500/30 scale-105' : 'w-[52px] h-[74px] border-white/10 opacity-45 hover:opacity-90 hover:border-fuchsia-500/40'}`}
              >
                <ImageOrFallback
                  src={mv.poster_path ? W500 + mv.poster_path : ''}
                  alt={mv.title}
                  className="w-full h-full object-cover"
                />
                {i === idx && (
                  <div className="absolute inset-0 ring-1 ring-fuchsia-400/40 rounded-xl" />
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${i === idx ? 'w-8 h-1.5 bg-fuchsia-400' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-fuchsia-600/50 border border-white/15 hover:border-fuchsia-500/60 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:scale-110 shadow-lg"
      >
        <FiChevronLeft size={22} strokeWidth={2.5} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-fuchsia-600/50 border border-white/15 hover:border-fuchsia-500/60 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm hover:scale-110 shadow-lg"
      >
        <FiChevronRight size={22} strokeWidth={2.5} />
      </button>

      {/* Mobile dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 lg:hidden">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? 'w-6 h-1.5 bg-fuchsia-400' : 'w-1.5 h-1.5 bg-white/25'}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   URGENCY STRIP  ("In Theatres Soon")
═══════════════════════════════════════════════ */
const UrgencyStrip = ({ movies }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const outNow = movies
    .filter((m) => new Date(m.release_date) <= new Date())
    .slice(0, 3);
  const thisWeek = movies.filter((m) => {
    const d = new Date(m.release_date) - new Date();
    return d > 0 && d <= 7 * 86400000;
  });
  const featured = [...outNow, ...thisWeek].slice(0, 9);
  if (!featured.length) return null;

  return (
    <div className="border-y border-fuchsia-900/28 bg-gradient-to-r from-[#0d0812]/90 via-[#110a1a]/80 to-[#0d0812]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3.5">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-white text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
              In Theatres Soon
            </span>
            <span className="w-px h-4 bg-white/10 mx-1" />
          </div>
          {featured.map((m) => {
            const uc = UC[getUrgency(m.release_date)];
            const saved = isInWatchlist(m.id);
            return (
              <div
                key={m.id}
                className="group flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
              >
                <div className="w-8 h-11 rounded-lg overflow-hidden border border-white/8 group-hover:border-fuchsia-500/40 transition-colors duration-200 flex-shrink-0">
                  <ImageOrFallback
                    src={m.poster_path ? W185 + m.poster_path : ''}
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white text-[11px] font-semibold line-clamp-1 max-w-[110px] group-hover:text-fuchsia-300 transition-colors duration-200">
                    {m.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${uc.dot}`}
                    />
                    <CountdownCompact releaseDate={m.release_date} />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saved
                      ? removeFromWatchlist(m.id)
                      : addToWatchlist(m, 'upcoming');
                  }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0 ${saved ? 'bg-fuchsia-500/30 border-fuchsia-400/50 text-fuchsia-300' : 'bg-black/40 border-white/15 text-white/60 hover:text-fuchsia-300'}`}
                >
                  {saved ? <FaBookmark size={7} /> : <FiBookmark size={7} />}
                </button>
                <span className="w-px h-5 bg-white/8 ml-1 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   STATS BAR
═══════════════════════════════════════════════ */
const StatsBar = ({ movies }) => {
  const released = movies.filter(
    (m) => new Date(m.release_date) <= new Date(),
  ).length;
  const upcoming = movies.length - released;
  const thisWeek = movies.filter((m) => {
    const d = new Date(m.release_date) - new Date();
    return d > 0 && d <= 7 * 86400000;
  }).length;
  const thisMonth = movies.filter((m) => {
    const d = new Date(m.release_date) - new Date();
    return d > 0 && d <= 30 * 86400000;
  }).length;
  return (
    <div className="bg-[#0c0a14]/80 border-b border-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6 md:gap-10 overflow-x-auto scrollbar-hide">
        {[
          {
            icon: <MdMovieFilter size={14} />,
            label: 'Total',
            val: movies.length,
            color: 'text-fuchsia-400',
          },
          {
            icon: <FiClock size={12} />,
            label: 'Coming Up',
            val: upcoming,
            color: 'text-violet-400',
          },
          {
            icon: <FaFire size={11} />,
            label: 'This Week',
            val: thisWeek,
            color: 'text-orange-400',
          },
          {
            icon: <FiCalendar size={12} />,
            label: 'This Month',
            val: thisMonth,
            color: 'text-cyan-400',
          },
          {
            icon: <AiFillStar size={12} />,
            label: 'Out Now',
            val: released,
            color: 'text-green-400',
          },
        ].map(({ icon, label, val, color }) => (
          <div key={label} className="flex items-center gap-2.5 flex-shrink-0">
            <span className={color}>{icon}</span>
            <div>
              <div className="text-white text-sm font-black leading-none">
                {val}
              </div>
              <div className="text-gray-600 text-[9px] uppercase tracking-wider mt-0.5">
                {label}
              </div>
            </div>
          </div>
        ))}
        <div className="ml-auto h-px w-32 bg-gradient-to-r from-transparent via-fuchsia-500/35 to-transparent hidden md:block" />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MONTH HEADER
═══════════════════════════════════════════════ */
const MonthHeader = ({ label, count }) => (
  <div className="flex items-center gap-3 mb-5 mt-1">
    <span className="w-1 h-7 bg-gradient-to-b from-fuchsia-500 to-violet-600 rounded-full" />
    <h2 className="text-white font-black text-lg tracking-tight">{label}</h2>
    <span className="bg-fuchsia-500/10 border border-fuchsia-500/22 text-fuchsia-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
      {count} titles
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-fuchsia-900/40 to-transparent" />
  </div>
);

/* ═══════════════════════════════════════════════
   GRID CARD
═══════════════════════════════════════════════ */
const GridCard = ({ movie, rank }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);
  const urg = getUrgency(movie.release_date);
  const uc = UC[urg];
  const genres = (movie.genre_ids || [])
    .slice(0, 2)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);
  const relDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBA';
  const toggle = (e) => {
    e.stopPropagation();
    saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie, 'upcoming');
  };

  return (
    <div className="group relative bg-[#0e0b16] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-fuchsia-500/35 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-fuchsia-900/15">
      {/* Poster */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '200px' }}
      >
        <ImageOrFallback
          src={movie.poster_path ? W500 + movie.poster_path : ''}
          alt={movie.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b16] via-[#0e0b16]/20 to-transparent" />

        {/* Diagonal tape label */}
        <div
          className={`absolute top-4 -right-7 px-10 py-1 text-[8px] font-black uppercase tracking-widest border-y rotate-[35deg] origin-center ${uc.bg} ${uc.border} ${uc.text}`}
        >
          {uc.label}
        </div>

        {/* Rank */}
        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-lg border border-white/10">
          #{rank}
        </div>

        {/* Watchlist btn */}
        <button
          onClick={toggle}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${saved ? 'bg-fuchsia-500/35 border-fuchsia-400/60 text-fuchsia-200 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-sm border-white/15 text-white/70 hover:bg-fuchsia-500/25 hover:border-fuchsia-400/50 hover:text-fuchsia-300'}`}
        >
          {saved ? <FaBookmark size={11} /> : <FiBookmark size={11} />}
        </button>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3
          className="text-white text-sm font-bold leading-snug line-clamp-2 mb-2 group-hover:text-fuchsia-200 transition-colors duration-200"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          {movie.title}
        </h3>
        <div className="flex gap-1 flex-wrap mb-2.5">
          {genres.map((g) => (
            <span
              key={g}
              className="bg-fuchsia-500/10 border border-fuchsia-500/15 text-fuchsia-400/80 text-[9px] px-2 py-0.5 rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="flex items-center gap-1 text-gray-600 text-[10px]">
            <MdCalendarToday size={9} className="text-gray-700" />
            {relDate}
          </span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-0.5">
              <AiFillStar className="text-yellow-500/70" size={9} />
              <span className="text-yellow-400/70 text-[10px] font-semibold">
                {movie.vote_average.toFixed(1)}
              </span>
            </span>
          )}
        </div>
        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
          <span className="text-gray-700 text-[9px] uppercase tracking-wider">
            {urg === 'released' ? 'Status' : 'Releases in'}
          </span>
          <CountdownCompact releaseDate={movie.release_date} />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   LIST CARD
═══════════════════════════════════════════════ */
const ListCard = ({ movie, rank }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);
  const urg = getUrgency(movie.release_date);
  const uc = UC[urg];
  const genres = (movie.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);
  const relDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBA';
  const toggle = (e) => {
    e.stopPropagation();
    saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie, 'upcoming');
  };

  return (
    <div className="group flex items-center gap-4 bg-[#0e0b16] border border-white/5 hover:border-fuchsia-500/28 rounded-2xl p-3.5 transition-all duration-200 hover:bg-fuchsia-500/4 cursor-pointer">
      <span
        className="text-gray-700 text-lg font-black w-7 text-center flex-shrink-0"
        style={{ fontFamily: "'Georgia',serif" }}
      >
        {rank <= 9 ? `0${rank}` : rank}
      </span>
      <div className="relative w-[110px] h-[64px] rounded-xl overflow-hidden flex-shrink-0 border border-white/8 group-hover:border-fuchsia-500/30 transition-colors duration-200">
        <ImageOrFallback
          src={
            movie.backdrop_path
              ? W300 + movie.backdrop_path
              : movie.poster_path
                ? W500 + movie.poster_path
                : ''
          }
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div
          className={`absolute top-1.5 right-1.5 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase border backdrop-blur-sm ${uc.bg} ${uc.border} ${uc.text}`}
        >
          {uc.label}
        </div>
      </div>
      <div className="w-[38px] h-[54px] rounded-lg overflow-hidden flex-shrink-0 border border-white/8 hidden md:block">
        <ImageOrFallback
          src={movie.poster_path ? W500 + movie.poster_path : ''}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className="text-white text-sm font-bold mb-1 line-clamp-1 group-hover:text-fuchsia-300 transition-colors duration-200"
          style={{ fontFamily: "'Georgia',serif" }}
        >
          {movie.title}
        </h3>
        <p className="text-gray-600 text-xs line-clamp-1 mb-1.5">
          {movie.overview}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {genres.map((g) => (
            <span
              key={g}
              className="bg-fuchsia-500/10 border border-fuchsia-500/15 text-fuchsia-400/70 text-[9px] px-2 py-0.5 rounded-full"
            >
              {g}
            </span>
          ))}
          <span className="flex items-center gap-1 text-gray-700 text-[9px]">
            <MdCalendarToday size={8} /> {relDate}
          </span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-0.5 text-yellow-500/60 text-[9px]">
              <AiFillStar size={8} />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <CountdownCompact releaseDate={movie.release_date} />
        <button
          onClick={toggle}
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${saved ? 'bg-fuchsia-500/25 border-fuchsia-400/45 text-fuchsia-300' : 'bg-white/4 border-white/10 text-gray-600 hover:bg-fuchsia-500/15 hover:border-fuchsia-400/35 hover:text-fuchsia-300'}`}
        >
          {saved ? <FaBookmark size={11} /> : <FiBookmark size={11} />}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   SKELETONS
═══════════════════════════════════════════════ */
const GridSkeleton = () => (
  <div className="bg-[#0e0b16] border border-white/4 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-[200px] bg-gradient-to-br from-fuchsia-900/10 via-violet-800/8 to-fuchsia-900/10" />
    <div className="p-3.5 space-y-2">
      <div className="h-3 bg-fuchsia-900/20 rounded w-4/5" />
      <div className="h-2 bg-fuchsia-900/10 rounded w-1/2" />
      <div className="h-1 bg-fuchsia-900/15 rounded mt-3" />
    </div>
  </div>
);
const ListSkeleton = () => (
  <div className="flex items-center gap-4 bg-[#0e0b16] border border-white/4 rounded-2xl p-3.5 animate-pulse">
    <div className="w-7 h-5 bg-fuchsia-900/20 rounded" />
    <div className="w-[110px] h-[64px] bg-gradient-to-br from-fuchsia-900/10 via-violet-800/8 to-fuchsia-900/10 rounded-xl" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-fuchsia-900/20 rounded w-2/3" />
      <div className="h-2 bg-fuchsia-900/10 rounded w-full" />
      <div className="h-2 bg-fuchsia-900/10 rounded w-1/3" />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
const ComingSoonPage = ({ onNavigate }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [genre, setGenre] = useState(null);
  const [sortBy, setSortBy] = useState('date_asc');
  const [grouped, setGrouped] = useState(true);
  const topRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const reqs = [1, 2, 3].map((p) =>
          axios.get(
            `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${p}`,
          ),
        );
        const res = await Promise.all(reqs);
        const all = res.flatMap((r) => r.data.results);
        const seen = new Set();
        setMovies(
          all.filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          }),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = movies
    .filter((m) => !genre || (m.genre_ids || []).includes(genre))
    .sort((a, b) => {
      if (sortBy === 'date_asc')
        return new Date(a.release_date) - new Date(b.release_date);
      if (sortBy === 'date_desc')
        return new Date(b.release_date) - new Date(a.release_date);
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'rating') return b.vote_average - a.vote_average;
      return 0;
    });

  const PER_PAGE = 20;
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const groupedMap = grouped
    ? (() => {
        const map = {};
        paginated.forEach((m) => {
          const key = m.release_date
            ? new Date(m.release_date).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })
            : 'TBA';
          if (!map[key]) map[key] = [];
          map[key].push(m);
        });
        return map;
      })()
    : null;

  const changePage = (p) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const heroMovies = [...movies]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0812] pt-16">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .card-in{animation:fadeSlideUp 0.4s ease forwards;opacity:0}
      `}</style>

      {/* HERO */}
      {loading ? (
        <div
          className="w-full animate-pulse bg-gradient-to-br from-fuchsia-900/10 via-violet-900/5 to-[#0a0812]"
          style={{ height: '85vh', maxHeight: '700px', minHeight: '520px' }}
        />
      ) : (
        <HeroCarousel movies={heroMovies} />
      )}

      {/* URGENCY STRIP */}
      {!loading && <UrgencyStrip movies={movies} />}

      {/* STATS */}
      {!loading && <StatsBar movies={movies} />}

      {/* MAIN */}
      <div ref={topRef} className="max-w-7xl mx-auto px-6 pt-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-8 bg-gradient-to-b from-fuchsia-500 to-violet-600 rounded-full" />
          <h2
            className="text-white font-black text-2xl tracking-tight"
            style={{ fontFamily: "'Georgia',serif" }}
          >
            Upcoming Releases
          </h2>
          <span className="bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs px-3 py-1 rounded-full font-bold">
            {filtered.length} films
          </span>
        </div>

        {/* Sticky controls */}
        <div className="sticky top-16 z-20 -mx-6 px-6 py-3 mb-6 bg-[#0a0812]/92 backdrop-blur-md border-b border-white/5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              {GENRES_FILTER.map(({ id, label }) => (
                <button
                  key={label}
                  onClick={() => {
                    setGenre(id);
                    setPage(1);
                  }}
                  className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full border font-semibold transition-all duration-200 ${genre === id ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 border-transparent text-white shadow-lg shadow-fuchsia-900/40' : 'bg-white/4 border-white/8 text-gray-500 hover:border-fuchsia-500/30 hover:text-fuchsia-300 hover:bg-fuchsia-500/8'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-[#0e0b16] border border-white/10 text-gray-400 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-fuchsia-500/40 cursor-pointer hover:border-white/15 transition-colors duration-200"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setGrouped(!grouped)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 ${grouped ? 'bg-fuchsia-500/15 border-fuchsia-500/32 text-fuchsia-300' : 'bg-white/4 border-white/8 text-gray-500 hover:border-fuchsia-500/25 hover:text-fuchsia-400'}`}
            >
              <FiCalendar size={11} /> Group by Month
            </button>
            <div className="flex items-center bg-[#0e0b16] border border-white/8 rounded-xl overflow-hidden">
              {[
                { m: 'grid', icon: <FiGrid size={13} /> },
                { m: 'list', icon: <FiList size={13} /> },
              ].map(({ m, icon }) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 transition-all duration-200 ${viewMode === m ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SKELETONS */}
        {loading && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                : 'flex flex-col gap-3'
            }
          >
            {Array.from({ length: 10 }).map((_, i) =>
              viewMode === 'grid' ? (
                <GridSkeleton key={i} />
              ) : (
                <ListSkeleton key={i} />
              ),
            )}
          </div>
        )}

        {/* GROUPED */}
        {!loading && grouped && groupedMap && (
          <div className="space-y-10">
            {Object.entries(groupedMap).map(([month, items]) => (
              <div key={month}>
                <MonthHeader label={month} count={items.length} />
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items.map((m, i) => (
                      <div
                        key={m.id}
                        className="card-in"
                        style={{ animationDelay: `${i * 35}ms` }}
                      >
                        <GridCard movie={m} rank={filtered.indexOf(m) + 1} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {items.map((m, i) => (
                      <div
                        key={m.id}
                        className="card-in"
                        style={{ animationDelay: `${i * 25}ms` }}
                      >
                        <ListCard movie={m} rank={filtered.indexOf(m) + 1} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FLAT */}
        {!loading &&
          !grouped &&
          (viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paginated.map((m, i) => (
                <div
                  key={m.id}
                  className="card-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <GridCard movie={m} rank={(page - 1) * PER_PAGE + i + 1} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {paginated.map((m, i) => (
                <div
                  key={m.id}
                  className="card-in"
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  <ListCard movie={m} rank={(page - 1) * PER_PAGE + i + 1} />
                </div>
              ))}
            </div>
          ))}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-fuchsia-500/8 border border-fuchsia-500/15 flex items-center justify-center mb-5">
              <MdMovieFilter size={30} className="text-fuchsia-400/30" />
            </div>
            <p className="text-gray-400 text-base font-semibold mb-1">
              No upcoming titles found
            </p>
            <p className="text-gray-700 text-sm mb-5">
              Try adjusting the genre filter
            </p>
            <button
              onClick={() => {
                setGenre(null);
                setPage(1);
              }}
              className="text-fuchsia-400 text-sm border border-fuchsia-500/25 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/8 px-5 py-2 rounded-full transition-all duration-200"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 pb-12">
            <button
              onClick={() => changePage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-gray-500 hover:border-fuchsia-500/40 hover:text-fuchsia-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`e${i}`} className="text-gray-700 px-1">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={`w-9 h-9 rounded-full text-sm font-bold border transition-all duration-200 ${page === p ? 'bg-gradient-to-br from-fuchsia-600 to-violet-600 border-transparent text-white shadow-lg shadow-fuchsia-900/40' : 'bg-white/4 border-white/8 text-gray-500 hover:border-fuchsia-500/30 hover:text-fuchsia-300'}`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              onClick={() => changePage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-gray-500 hover:border-fuchsia-500/40 hover:text-fuchsia-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoonPage;
