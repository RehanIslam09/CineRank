import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useWatchlist } from '../context/WatchlistContext';
import {
  FiSearch,
  FiX,
  FiChevronRight,
  FiClock,
  FiTrendingUp,
  FiFilm,
  FiTv,
  FiUser,
  FiBookmark,
  FiStar,
  FiCalendar,
  FiMapPin,
  FiPlay,
  FiZap,
} from 'react-icons/fi';
import { FaBookmark, FaPlay, FaStar, FaRegStar, FaFire } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';

/* ─────────────────────────────────────────────
   API
───────────────────────────────────────────── */
const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE = 'https://api.themoviedb.org/3';
const W500 = 'https://image.tmdb.org/t/p/w500';
const W185 = 'https://image.tmdb.org/t/p/w185';
const W300 = 'https://image.tmdb.org/t/p/w300';
const ORIG = 'https://image.tmdb.org/t/p/original';

const get = (path, params = {}) =>
  axios.get(`${BASE}${path}`, {
    params: { api_key: API_KEY, language: 'en-US', ...params },
  });

/* ─────────────────────────────────────────────
   IMAGE FALLBACK
───────────────────────────────────────────── */
const Img = ({ src, alt, className }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className={`${className} bg-[#1a1a2e] flex items-center justify-center`}
      >
        <FiFilm size={12} className="text-purple-400/30" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
    />
  );
};

/* ─────────────────────────────────────────────
   HIGHLIGHT MATCH
───────────────────────────────────────────── */
const Highlight = ({ text, query }) => {
  if (!query || !text) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-purple-500/30 text-purple-200 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
};

/* ─────────────────────────────────────────────
   TYPE BADGE
───────────────────────────────────────────── */
const TypeBadge = ({ type }) => {
  const cfg = {
    movie: {
      label: 'Movie',
      cls: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      icon: <FiFilm size={8} />,
    },
    tv: {
      label: 'TV Show',
      cls: 'bg-violet-500/20 border-violet-500/30 text-violet-300',
      icon: <FiTv size={8} />,
    },
    person: {
      label: 'Person',
      cls: 'bg-rose-500/20 border-rose-500/30 text-rose-300',
      icon: <FiUser size={8} />,
    },
  };
  const c = cfg[type] || cfg.movie;
  return (
    <span
      className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${c.cls}`}
    >
      {c.icon} {c.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   STARS
───────────────────────────────────────────── */
const Stars = ({ rating }) => {
  const filled = Math.round(rating / 2);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        i < filled ? (
          <FaStar key={i} size={9} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} size={9} className="text-gray-700" />
        ),
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SEARCH DETAIL MODAL
───────────────────────────────────────────── */
const SearchDetailModal = ({ item, onClose }) => {
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const saved = isInWatchlist(item.id);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        if (mediaType === 'person') {
          const [dr, cr] = await Promise.all([
            get(`/person/${item.id}`),
            get(`/person/${item.id}/combined_credits`),
          ]);
          setDetails(dr.data);
          setCast(
            [...(cr.data.cast || [])]
              .filter((c) => c.poster_path)
              .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
              .slice(0, 8),
          );
        } else {
          const ep =
            mediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
          const cp =
            mediaType === 'tv'
              ? `/tv/${item.id}/credits`
              : `/movie/${item.id}/credits`;
          const [dr, cr] = await Promise.all([get(ep), get(cp)]);
          setDetails(dr.data);
          setCast(
            (cr.data.cast || []).filter((c) => c.profile_path).slice(0, 8),
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [item.id, mediaType]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const title = details?.title || details?.name || item.title || item.name;
  const overview = details?.overview || item.overview || '';
  const backdrop = details?.backdrop_path || item.backdrop_path;
  const poster =
    details?.poster_path ||
    details?.profile_path ||
    item.poster_path ||
    item.profile_path;
  const rating = details?.vote_average || item.vote_average || 0;
  const year = (
    details?.release_date ||
    details?.first_air_date ||
    item.release_date ||
    item.first_air_date ||
    ''
  )?.slice(0, 4);
  const genres = details?.genres?.map((g) => g.name).slice(0, 4) || [];
  const runtime = details?.runtime || details?.episode_run_time?.[0];
  const seasons = details?.number_of_seasons;
  const budget = details?.budget;
  const revenue = details?.revenue;
  const birthday = details?.birthday;
  const birthplace = details?.place_of_birth;
  const biography = details?.biography;
  const department = details?.known_for_department || item.known_for_department;

  const fmt = (n) => (n ? `$${(n / 1000000).toFixed(0)}M` : null);
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-[#0d0d18] border border-purple-900/40 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop header */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ height: backdrop ? '220px' : '80px' }}
        >
          {backdrop && (
            <>
              <img
                src={ORIG + backdrop}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d18]/80 to-transparent" />
            </>
          )}
          {!backdrop && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-[#0d0d18]" />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/15 text-gray-400 hover:text-white hover:border-white/30 flex items-center justify-center transition-all duration-200"
          >
            <FiX size={16} />
          </button>
          <div className="absolute top-4 left-4 z-20">
            <TypeBadge type={mediaType} />
          </div>
        </div>

        {/* Body */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="px-6 pb-6">
            {/* Poster + title */}
            <div className="flex items-end gap-4 -mt-14 mb-5 relative z-10">
              <div className="w-[80px] h-[115px] flex-shrink-0 rounded-2xl overflow-hidden border border-purple-500/40 shadow-2xl">
                <Img
                  src={
                    poster
                      ? (mediaType === 'person' ? W185 : W500) + poster
                      : ''
                  }
                  alt={title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <h2
                  className="text-white font-black text-2xl leading-tight mb-1"
                  style={{ fontFamily: "'Georgia',serif" }}
                >
                  {loading ? (
                    <div className="h-7 bg-purple-900/30 rounded w-3/4 animate-pulse" />
                  ) : (
                    title
                  )}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {year && (
                    <span className="text-gray-500 text-xs">{year}</span>
                  )}
                  {rating > 0 && (
                    <>
                      <span className="text-gray-700">·</span>
                      <div className="flex items-center gap-1">
                        <Stars rating={rating} />
                        <span className="text-yellow-400 text-xs font-bold">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </>
                  )}
                  {runtime && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className="text-gray-500 text-xs">{runtime}m</span>
                    </>
                  )}
                  {seasons && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className="text-gray-500 text-xs">
                        {seasons} season{seasons > 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                  {department && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className="text-gray-500 text-xs">
                        {department}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-purple-900/20 rounded animate-pulse"
                    style={{ width: `${85 - i * 10}%` }}
                  />
                ))}
              </div>
            )}

            {!loading && (
              <>
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[10px] px-2.5 py-0.5 rounded-full font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                {(overview || biography) && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-4">
                    {overview || biography}
                  </p>
                )}

                {mediaType === 'person' && (birthday || birthplace) && (
                  <div className="space-y-2 mb-4">
                    {birthday && (
                      <div className="flex items-center gap-2.5">
                        <FiCalendar size={12} className="text-gray-600" />
                        <span className="text-gray-500 text-xs">
                          Born {fmtDate(birthday)}
                        </span>
                      </div>
                    )}
                    {birthplace && (
                      <div className="flex items-center gap-2.5">
                        <FiMapPin size={12} className="text-gray-600" />
                        <span className="text-gray-500 text-xs">
                          {birthplace}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {mediaType !== 'person' && (budget > 0 || revenue > 0) && (
                  <div className="flex gap-3 mb-5 flex-wrap">
                    {budget > 0 && (
                      <div className="bg-white/4 border border-white/8 rounded-xl px-3 py-2">
                        <p className="text-gray-600 text-[9px] uppercase tracking-wider">
                          Budget
                        </p>
                        <p className="text-white text-sm font-bold">
                          {fmt(budget)}
                        </p>
                      </div>
                    )}
                    {revenue > 0 && (
                      <div className="bg-white/4 border border-white/8 rounded-xl px-3 py-2">
                        <p className="text-gray-600 text-[9px] uppercase tracking-wider">
                          Box Office
                        </p>
                        <p className="text-white text-sm font-bold">
                          {fmt(revenue)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {cast.length > 0 && (
                  <div className="mb-5">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-3">
                      {mediaType === 'person' ? 'Known For' : 'Cast'}
                    </p>
                    <div
                      className="flex gap-3 overflow-x-auto pb-1"
                      style={{ scrollbarWidth: 'none' }}
                    >
                      {cast.map((c) => (
                        <div
                          key={`${c.id}-${c.credit_id || c.id}`}
                          className="flex-shrink-0 w-[72px]"
                        >
                          <div className="w-[72px] h-[100px] rounded-xl overflow-hidden border border-white/8 mb-1.5">
                            <Img
                              src={
                                mediaType === 'person'
                                  ? c.poster_path
                                    ? W185 + c.poster_path
                                    : ''
                                  : c.profile_path
                                    ? W185 + c.profile_path
                                    : ''
                              }
                              alt={c.name || c.title}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <p className="text-gray-400 text-[9px] leading-snug line-clamp-2">
                            {mediaType === 'person'
                              ? c.title || c.name
                              : c.name}
                          </p>
                          {c.character && (
                            <p className="text-gray-600 text-[8px] line-clamp-1 mt-0.5 italic">
                              {c.character}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2 border-t border-purple-900/20">
                  <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-900/40 transition-all duration-200 hover:scale-[1.02]">
                    <FaPlay size={11} />{' '}
                    {mediaType === 'person'
                      ? 'View Filmography'
                      : 'Watch Trailer'}
                  </button>
                  {mediaType !== 'person' && (
                    <button
                      onClick={() =>
                        saved
                          ? removeFromWatchlist(item.id)
                          : addToWatchlist(
                              { ...item, ...details },
                              mediaType === 'tv' ? 'tv' : 'popular',
                              mediaType === 'tv' ? 'tv' : 'movie',
                            )
                      }
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 hover:scale-[1.02] ${saved ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300'}`}
                    >
                      {saved ? (
                        <FaBookmark size={11} />
                      ) : (
                        <FiBookmark size={11} />
                      )}{' '}
                      {saved ? 'Saved' : 'Watchlist'}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="ml-auto px-4 py-2.5 text-gray-600 hover:text-gray-400 text-sm border border-white/6 hover:border-white/12 rounded-xl transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   RESULT ROW
───────────────────────────────────────────── */
const ResultRow = ({ item, query, isHighlighted, onClick }) => {
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '')?.slice(0, 4);
  const rating = item.vote_average;
  const poster = item.poster_path || item.profile_path;
  const knownFor = item.known_for
    ?.slice(0, 2)
    .map((k) => k.title || k.name)
    .join(', ');

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-5 py-3 text-left transition-all duration-150 border-b border-purple-900/15 last:border-0 ${isHighlighted ? 'bg-purple-500/15' : 'hover:bg-purple-500/8'}`}
    >
      <div className="w-[38px] h-[54px] rounded-lg overflow-hidden flex-shrink-0 border border-white/8">
        <Img
          src={poster ? W185 + poster : ''}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-white text-sm font-semibold line-clamp-1">
            <Highlight text={title} query={query} />
          </span>
          <TypeBadge type={item.media_type} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {year && <span className="text-gray-600 text-[10px]">{year}</span>}
          {rating > 0 && (
            <>
              <span className="text-gray-700 text-[10px]">·</span>
              <div className="flex items-center gap-1">
                <AiFillStar className="text-yellow-500/70" size={9} />
                <span className="text-gray-500 text-[10px]">
                  {rating.toFixed(1)}
                </span>
              </div>
            </>
          )}
          {knownFor && (
            <>
              <span className="text-gray-700 text-[10px]">·</span>
              <span className="text-gray-600 text-[10px] line-clamp-1">
                {knownFor}
              </span>
            </>
          )}
        </div>
      </div>
      <FiChevronRight
        size={14}
        className={`flex-shrink-0 transition-colors duration-150 ${isHighlighted ? 'text-purple-400' : 'text-gray-700'}`}
      />
    </button>
  );
};

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
const SectionLabel = ({ label, icon }) => (
  <div className="flex items-center gap-2 px-5 py-2 bg-purple-900/15 border-b border-purple-900/20">
    <span className="text-purple-400">{icon}</span>
    <span className="text-purple-300/70 text-[10px] font-bold uppercase tracking-widest">
      {label}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = ({ currentPage, onNavigate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const inputRef = useRef(null);
  const { watchlist } = useWatchlist();

  const navLinks = [
    { label: 'Movies', page: 'movies' },
    { label: 'TV Shows', page: 'tv' },
    { label: 'Top Rated', page: 'topRated' },
    { label: 'Coming Soon', page: 'comingSoon' },
    { label: 'Celebrities', page: 'celebrities' },
    { label: 'Awards', page: 'awards' },
    { label: 'Community', page: 'community' },
    { label: '✦ For You', page: 'forYou' },
  ];

  /* Load recent */
  useEffect(() => {
    try {
      setRecentSearches(
        JSON.parse(localStorage.getItem('cinerank_recent') || '[]').slice(0, 5),
      );
    } catch {}
  }, []);

  const saveRecent = useCallback((item) => {
    try {
      const title = item.title || item.name;
      const prev = JSON.parse(localStorage.getItem('cinerank_recent') || '[]');
      const next = [
        { id: item.id, title, media_type: item.media_type },
        ...prev.filter((r) => r.id !== item.id),
      ].slice(0, 5);
      localStorage.setItem('cinerank_recent', JSON.stringify(next));
      setRecentSearches(next);
    } catch {}
  }, []);

  /* Fetch trending */
  useEffect(() => {
    get('/trending/all/day')
      .then((r) =>
        setTrending(
          r.data.results
            .filter(
              (i) =>
                i.media_type !== 'person' && (i.poster_path || i.backdrop_path),
            )
            .slice(0, 6),
        ),
      )
      .catch(() => {});
  }, []);

  /* Debounced search */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHighlighted(-1);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await get('/search/multi', {
          query: query.trim(),
          page: 1,
          include_adult: false,
        });
        setResults(
          data.results
            .filter(
              (r) =>
                r.media_type !== 'unknown' &&
                (r.poster_path || r.profile_path || r.backdrop_path),
            )
            .slice(0, 12),
        );
        setHighlighted(-1);
      } catch {
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => clearTimeout(t);
  }, [query]);

  /* Keyboard nav */
  useEffect(() => {
    if (!searchOpen) return;
    const flat = query.trim()
      ? [
          ...results.filter((r) => r.media_type === 'movie'),
          ...results.filter((r) => r.media_type === 'tv'),
          ...results.filter((r) => r.media_type === 'person'),
        ]
      : trending;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, flat.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, -1));
      }
      if (e.key === 'Enter' && highlighted >= 0 && flat[highlighted])
        handleSelect(flat[highlighted]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, query, results, trending, highlighted]);

  /* Focus on open */
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else {
      setQuery('');
      setResults([]);
      setHighlighted(-1);
    }
  }, [searchOpen]);

  const handleSelect = (item) => {
    saveRecent(item);
    setSelectedItem(item);
    setSearchOpen(false);
  };

  const movies = results.filter((r) => r.media_type === 'movie');
  const tvShows = results.filter((r) => r.media_type === 'tv');
  const people = results.filter((r) => r.media_type === 'person');
  const allResults = [...movies, ...tvShows, ...people];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg shadow-purple-950/50">
        <div className="backdrop-blur-md bg-[#09090b]/80 border-b border-purple-900/30">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* LOGO */}
            <div
              onClick={() => onNavigate('movies')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="text-xl">🎬</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                CineRank
              </span>
            </div>

            {/* NAV LINKS */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                const isForYou = link.page === 'forYou';
                return (
                  <button
                    key={link.page}
                    onClick={() => onNavigate(link.page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isForYou
                        ? isActive
                          ? 'text-fuchsia-300 bg-fuchsia-500/15 border border-fuchsia-500/30'
                          : 'text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-500/10'
                        : isActive
                          ? 'text-purple-300 bg-purple-500/15 border border-purple-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-purple-500/10'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-500/10 transition-all duration-200"
              >
                <FiSearch size={18} strokeWidth={2} />
              </button>
              <button
                onClick={() => onNavigate('watchlist')}
                className={`relative border px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === 'watchlist' ? 'bg-purple-500/20 border-purple-500/60 text-purple-200' : 'border-purple-500/40 text-purple-300 hover:bg-purple-500/10'}`}
              >
                Watchlist
                {watchlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {watchlist.length > 9 ? '9+' : watchlist.length}
                  </span>
                )}
              </button>
              {isLoggedIn ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                  AR
                </div>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-lg shadow-purple-900/50 transition-all duration-200"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70" />
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center pt-24 px-4 transition-all duration-300 ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSearchOpen(false)}
      >
        <div
          className={`absolute inset-0 bg-black/75 backdrop-blur-lg transition-opacity duration-300 ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        <div
          className={`relative z-10 w-full max-w-2xl transition-all duration-300 ${searchOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-[0.98]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input */}
          <div className="flex items-center bg-[#0f0f1a] border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-900/50 mb-2 overflow-hidden focus-within:border-purple-500/70 transition-colors duration-200">
            {loading ? (
              <div className="ml-4 w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin flex-shrink-0" />
            ) : (
              <FiSearch
                size={18}
                className="ml-4 text-purple-400 flex-shrink-0"
              />
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, celebrities…"
              className="flex-1 bg-transparent text-white text-base placeholder-gray-500 py-4 px-3 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="mr-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200"
              >
                <FiX size={13} />
              </button>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="mr-4 text-gray-600 hover:text-gray-400 text-xs font-semibold transition-colors duration-200 flex-shrink-0"
            >
              ESC
            </button>
          </div>

          {/* Results panel */}
          <div
            className="bg-[#0f0f1a] border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/40 max-h-[62vh] overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Empty state */}
            {!query.trim() && (
              <>
                {recentSearches.length > 0 && (
                  <>
                    <SectionLabel label="Recent" icon={<FiClock size={11} />} />
                    {recentSearches.map((r, i) => (
                      <button
                        key={r.id}
                        onClick={() => setQuery(r.title)}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left border-b border-purple-900/12 last:border-0 transition-all duration-150 ${highlighted === i ? 'bg-purple-500/15' : 'hover:bg-purple-500/8'}`}
                      >
                        <FiClock
                          size={12}
                          className="text-gray-600 flex-shrink-0"
                        />
                        <span className="text-gray-400 text-sm flex-1">
                          {r.title}
                        </span>
                        <TypeBadge type={r.media_type} />
                      </button>
                    ))}
                    <div className="h-px bg-purple-900/25" />
                  </>
                )}
                <SectionLabel
                  label="Trending Now"
                  icon={<FiTrendingUp size={11} />}
                />
                {trending.map((item, i) => {
                  const title = item.title || item.name;
                  const year = (
                    item.release_date ||
                    item.first_air_date ||
                    ''
                  )?.slice(0, 4);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`w-full flex items-center gap-3.5 px-5 py-3 text-left border-b border-purple-900/12 last:border-0 transition-all duration-150 ${highlighted === recentSearches.length + i ? 'bg-purple-500/15' : 'hover:bg-purple-500/8'}`}
                    >
                      <div className="w-[34px] h-[48px] rounded-lg overflow-hidden flex-shrink-0 border border-white/8">
                        <Img
                          src={item.poster_path ? W185 + item.poster_path : ''}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold line-clamp-1">
                          {title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {year && (
                            <span className="text-gray-600 text-[10px]">
                              {year}
                            </span>
                          )}
                          {item.vote_average > 0 && (
                            <>
                              <span className="text-gray-700 text-[10px]">
                                ·
                              </span>
                              <div className="flex items-center gap-0.5">
                                <AiFillStar
                                  className="text-yellow-500/60"
                                  size={9}
                                />
                                <span className="text-gray-500 text-[10px]">
                                  {item.vote_average.toFixed(1)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <TypeBadge type={item.media_type} />
                    </button>
                  );
                })}
              </>
            )}

            {/* No results */}
            {query.trim() && !loading && results.length === 0 && (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-purple-500/8 border border-purple-500/15 flex items-center justify-center mb-3">
                  <FiSearch size={22} className="text-purple-400/30" />
                </div>
                <p className="text-gray-500 text-sm font-medium">
                  No results for "{query}"
                </p>
                <p className="text-gray-700 text-xs mt-1">
                  Try a different title or name
                </p>
              </div>
            )}

            {/* Grouped results */}
            {query.trim() && results.length > 0 && (
              <>
                {movies.length > 0 && (
                  <>
                    {
                      <SectionLabel
                        label={`Movies · ${movies.length}`}
                        icon={<FiFilm size={11} />}
                      />
                    }
                    {movies.map((item) => (
                      <ResultRow
                        key={item.id}
                        item={item}
                        query={query}
                        isHighlighted={highlighted === allResults.indexOf(item)}
                        onClick={() => handleSelect(item)}
                      />
                    ))}
                  </>
                )}
                {tvShows.length > 0 && (
                  <>
                    {
                      <SectionLabel
                        label={`TV Shows · ${tvShows.length}`}
                        icon={<FiTv size={11} />}
                      />
                    }
                    {tvShows.map((item) => (
                      <ResultRow
                        key={item.id}
                        item={item}
                        query={query}
                        isHighlighted={highlighted === allResults.indexOf(item)}
                        onClick={() => handleSelect(item)}
                      />
                    ))}
                  </>
                )}
                {people.length > 0 && (
                  <>
                    {
                      <SectionLabel
                        label={`People · ${people.length}`}
                        icon={<FiUser size={11} />}
                      />
                    }
                    {people.map((item) => (
                      <ResultRow
                        key={item.id}
                        item={item}
                        query={query}
                        isHighlighted={highlighted === allResults.indexOf(item)}
                        onClick={() => handleSelect(item)}
                      />
                    ))}
                  </>
                )}
                <div className="px-5 py-2.5 border-t border-purple-900/20 flex items-center justify-between">
                  <span className="text-gray-700 text-[10px]">
                    ↑↓ navigate · Enter select · Esc close
                  </span>
                  <span className="text-gray-700 text-[10px]">
                    {results.length} results
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <SearchDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};

export default Navbar;
