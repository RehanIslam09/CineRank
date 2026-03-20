import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiFilm,
  FiTv,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiGrid,
  FiList,
} from 'react-icons/fi';
import { FaStar, FaFire, FaPlay, FaImdb } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { MdMovieFilter, MdCameraRoll } from 'react-icons/md';

/* ─────────────────────────────────────────────
   IMAGE FALLBACK
───────────────────────────────────────────── */
const ImageOrFallback = ({ src, alt, className, portrait = false }) => {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={`${className} relative overflow-hidden bg-[#111008] flex items-center justify-center`}
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
                className="text-rose-300 text-xs font-mono whitespace-nowrap px-3 py-2"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center px-3">
          <div
            className={`mx-auto mb-2 rounded-full bg-rose-900/20 border border-rose-800/30 flex items-center justify-center ${portrait ? 'w-14 h-14' : 'w-10 h-10'}`}
          >
            <FiUser size={portrait ? 22 : 16} className="text-rose-400/40" />
          </div>
          <p className="text-rose-400/30 text-[9px] uppercase tracking-widest">
            {alt || 'No Image'}
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
const W185 = 'https://image.tmdb.org/t/p/w185';
const W300 = 'https://image.tmdb.org/t/p/w300';

const get = (path, params = {}) =>
  axios.get(`${BASE}${path}`, {
    params: { api_key: API_KEY, language: 'en-US', ...params },
  });

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const DEPARTMENTS = [
  { id: 'all', label: 'All', icon: <FiUser size={13} /> },
  { id: 'Acting', label: 'Actors', icon: <MdCameraRoll size={13} /> },
  { id: 'Directing', label: 'Directors', icon: <MdMovieFilter size={13} /> },
  { id: 'Writing', label: 'Writers', icon: <FiFilm size={13} /> },
  { id: 'Production', label: 'Producers', icon: <FiAward size={13} /> },
];

const GENDER_LABELS = { 0: 'Unknown', 1: 'Female', 2: 'Male', 3: 'Non-binary' };

/* ─────────────────────────────────────────────
   POPULARITY BAR
───────────────────────────────────────────── */
const PopularityBar = ({ value, max = 300, accent = 'rose' }) => {
  const pct = Math.min(100, (value / max) * 100);
  const colors = {
    rose: 'from-rose-500 to-pink-400',
    amber: 'from-amber-500 to-yellow-400',
    violet: 'from-violet-500 to-purple-400',
    cyan: 'from-cyan-500 to-teal-400',
  };
  return (
    <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colors[accent] || colors.rose} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   SHIMMER
───────────────────────────────────────────── */
const Shimmer = ({ className }) => (
  <div
    className={`${className} bg-gradient-to-r from-rose-900/10 via-rose-700/12 to-rose-900/10 animate-pulse rounded-2xl`}
  />
);

/* ─────────────────────────────────────────────
   MARQUEE TICKER
───────────────────────────────────────────── */
const MarqueeTicker = ({ people }) => {
  if (!people.length) return null;
  const doubled = [...people, ...people];
  return (
    <div className="overflow-hidden border-y border-rose-900/20 bg-[#0d0b09]/70 py-2.5 relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0908] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0908] to-transparent z-10 pointer-events-none" />
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: 'marquee 40s linear infinite' }}
      >
        {doubled.map((p, i) => (
          <span
            key={i}
            className="flex items-center gap-2.5 text-sm flex-shrink-0"
          >
            <span className="text-rose-500/60 text-[10px]">✦</span>
            <span className="text-white/60 font-medium tracking-wide">
              {p.name}
            </span>
            <span className="text-gray-700 text-[10px]">
              {p.known_for_department}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   HERO SPOTLIGHT  (top celebrity)
───────────────────────────────────────────── */
const HeroSpotlight = ({ person, onSelect }) => {
  if (!person) return <Shimmer className="h-[500px] w-full rounded-none" />;

  const knownFor = (person.known_for || []).slice(0, 3);
  const popularity = Math.round(person.popularity);

  return (
    <div
      className="relative w-full cursor-pointer group overflow-hidden"
      style={{ height: '480px' }}
      onClick={() => onSelect(person)}
    >
      {/* Full bleed portrait */}
      {person.profile_path ? (
        <>
          <img
            src={ORIG + person.profile_path}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-20 pointer-events-none"
          />
          <img
            src={W500 + person.profile_path}
            alt={person.name}
            className="absolute right-0 top-0 h-full w-auto object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
            style={{ maxWidth: '55%' }}
          />
        </>
      ) : (
        <ImageOrFallback
          src=""
          alt={person.name}
          className="absolute inset-0 w-full h-full"
          portrait
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/85 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-black/40 z-10" />

      {/* Diagonal decorative lines */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-rose-400"
            style={{
              width: '150%',
              top: `${8 + i * 14}%`,
              left: '-25%',
              transform: `rotate(-8deg)`,
              transformOrigin: 'left center',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end px-10 pb-10 max-w-xl">
        {/* Label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            <FaFire size={9} /> #{1} Most Popular
          </span>
          <span className="text-gray-700 text-xs">·</span>
          <span className="text-gray-500 text-xs">
            {person.known_for_department}
          </span>
        </div>

        {/* Name — massive editorial */}
        <h1
          className="text-white font-black leading-[0.9] mb-4 uppercase"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontFamily: "'Georgia', 'Times New Roman', serif",
            letterSpacing: '-0.02em',
            textShadow: '0 0 60px rgba(244,63,94,0.2)',
          }}
        >
          {person.name}
        </h1>

        {/* Popularity meter */}
        <div className="mb-4 max-w-[280px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-gray-600 text-[10px] uppercase tracking-widest">
              Popularity Index
            </span>
            <span className="text-rose-400 text-xs font-black">
              {popularity}
            </span>
          </div>
          <PopularityBar value={person.popularity} max={350} accent="rose" />
        </div>

        {/* Known for */}
        {knownFor.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-600 text-[10px] uppercase tracking-widest mr-1">
              Known for
            </span>
            {knownFor.map((item) => (
              <span
                key={item.id}
                className="bg-white/6 border border-white/10 text-gray-300 text-[10px] px-2.5 py-1 rounded-lg"
              >
                {item.title || item.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rank watermark */}
      <div
        className="absolute right-8 bottom-6 z-20 font-black text-white/4 leading-none select-none pointer-events-none"
        style={{ fontSize: '10rem', fontFamily: "'Georgia', serif" }}
      >
        01
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   CELEBRITY CARD — grid variant
   Uses alternating sizes via `size` prop: 'normal' | 'tall' | 'featured'
───────────────────────────────────────────── */
const CelebCard = ({ person, rank, onSelect, size = 'normal' }) => {
  const heights = {
    normal: 'h-[280px]',
    tall: 'h-[360px]',
    featured: 'h-[320px]',
  };
  const knownFor = (person.known_for || []).slice(0, 1);

  return (
    <div
      onClick={() => onSelect(person)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-rose-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-900/20 hover:-translate-y-1 ${heights[size]}`}
    >
      {/* Portrait */}
      <ImageOrFallback
        src={person.profile_path ? W500 + person.profile_path : ''}
        alt={person.name}
        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        portrait
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Rank badge */}
      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm border border-white/10 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">
        #{rank}
      </div>

      {/* Department badge */}
      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-white/10 text-gray-400 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-lg">
        {person.known_for_department === 'Acting'
          ? '🎭'
          : person.known_for_department === 'Directing'
            ? '🎬'
            : '✍️'}{' '}
        {person.known_for_department}
      </div>

      {/* Bottom name plate */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
        {/* Popularity bar */}
        <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PopularityBar value={person.popularity} max={350} accent="rose" />
        </div>

        <h3
          className="text-white font-black text-base leading-tight mb-0.5 group-hover:text-rose-200 transition-colors duration-200"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            letterSpacing: '-0.01em',
          }}
        >
          {person.name}
        </h3>

        {knownFor[0] && (
          <p className="text-gray-500 text-[10px] line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {knownFor[0].title || knownFor[0].name}
          </p>
        )}

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-rose-400/70 text-[10px] flex items-center gap-1">
            <FiTrendingUp size={9} /> {Math.round(person.popularity)}
          </span>
          <span className="text-gray-700 text-[9px]">
            {GENDER_LABELS[person.gender] || ''}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   LIST ROW CARD
───────────────────────────────────────────── */
const ListRow = ({ person, rank, onSelect }) => {
  const knownFor = (person.known_for || []).slice(0, 3);
  return (
    <div
      onClick={() => onSelect(person)}
      className="group flex items-center gap-4 p-4 rounded-2xl border border-white/5 hover:border-rose-500/25 bg-[#0d0b09] hover:bg-rose-500/5 transition-all duration-200 cursor-pointer"
    >
      {/* Rank */}
      <span
        className="text-gray-700 text-lg font-black w-8 text-center flex-shrink-0"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {rank <= 9 ? `0${rank}` : rank}
      </span>

      {/* Portrait */}
      <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-white/10 group-hover:border-rose-500/40 transition-colors duration-200 flex-shrink-0">
        <ImageOrFallback
          src={person.profile_path ? W185 + person.profile_path : ''}
          alt={person.name}
          className="w-full h-full object-cover object-top"
          portrait
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-white font-bold text-sm group-hover:text-rose-300 transition-colors duration-200 line-clamp-1"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {person.name}
        </h4>
        <p className="text-gray-600 text-[10px] mt-0.5">
          {person.known_for_department}
        </p>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {knownFor.map((item) => (
            <span
              key={item.id}
              className="bg-white/5 border border-white/8 text-gray-500 text-[9px] px-2 py-0.5 rounded"
            >
              {item.title || item.name}
            </span>
          ))}
        </div>
      </div>

      {/* Popularity */}
      <div className="flex-shrink-0 text-right hidden sm:block">
        <div className="text-rose-400 text-sm font-black">
          {Math.round(person.popularity)}
        </div>
        <div className="text-gray-700 text-[9px] uppercase tracking-wider">
          Popularity
        </div>
        <div className="mt-1.5 w-20">
          <PopularityBar value={person.popularity} max={350} accent="rose" />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DETAIL MODAL
───────────────────────────────────────────── */
const DetailModal = ({ person, onClose }) => {
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!person) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [detailRes, creditsRes] = await Promise.all([
          get(`/person/${person.id}`),
          get(`/person/${person.id}/combined_credits`),
        ]);
        setDetails(detailRes.data);
        // Top 6 known-for works sorted by popularity
        const sorted = [
          ...(creditsRes.data.cast || []),
          ...(creditsRes.data.crew || []),
        ]
          .filter((c) => c.poster_path)
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 6);
        setCredits(sorted);
      } catch (e) {
        console.error('Person detail fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [person?.id]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!person) return null;

  const age = details?.birthday
    ? Math.floor(
        (new Date() - new Date(details.birthday)) / (365.25 * 86400000),
      )
    : null;

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div
        className="relative z-10 bg-[#0d0b09] border border-white/10 rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header portrait strip */}
        <div className="relative h-[220px] flex-shrink-0 overflow-hidden">
          {person.profile_path ? (
            <>
              <img
                src={W500 + person.profile_path}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top scale-110 blur-xl opacity-25"
              />
              <img
                src={W500 + person.profile_path}
                alt={person.name}
                className="absolute right-0 top-0 h-full w-auto object-cover opacity-80"
                style={{ maxWidth: '45%' }}
              />
            </>
          ) : (
            <ImageOrFallback
              src=""
              alt={person.name}
              className="absolute inset-0 w-full h-full"
              portrait
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0b09] via-[#0d0b09]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09] to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 border border-white/15 text-gray-400 hover:text-white hover:border-white/30 flex items-center justify-center transition-all duration-200"
          >
            <FiX size={16} />
          </button>

          {/* Name overlay */}
          <div className="absolute bottom-5 left-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {person.known_for_department}
              </span>
              {details?.also_known_as?.length > 0 && (
                <span className="text-gray-600 text-[10px]">
                  aka {details.also_known_as[0]}
                </span>
              )}
            </div>
            <h2
              className="text-white font-black text-3xl leading-tight"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: '-0.02em',
              }}
            >
              {person.name}
            </h2>
          </div>
        </div>

        {/* Scrollable body */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <style>{`.modal-scroll::-webkit-scrollbar{display:none}`}</style>

          <div className="p-6 space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: 'Popularity',
                  value: Math.round(person.popularity),
                  icon: <FiTrendingUp size={12} />,
                  accent: 'rose',
                },
                {
                  label: 'Age',
                  value: loading ? '—' : age ? `${age} yrs` : '—',
                  icon: <FiCalendar size={12} />,
                  accent: 'violet',
                },
                {
                  label: 'Gender',
                  value: GENDER_LABELS[person.gender] || '—',
                  icon: <FiUser size={12} />,
                  accent: 'cyan',
                },
                {
                  label: 'Known Works',
                  value: loading ? '—' : credits.length + '+',
                  icon: <FiFilm size={12} />,
                  accent: 'amber',
                },
              ].map(({ label, value, icon, accent }) => {
                const colors = {
                  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
                  violet:
                    'bg-violet-500/10 border-violet-500/20 text-violet-400',
                  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
                  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                };
                return (
                  <div
                    key={label}
                    className={`rounded-xl border p-3 ${colors[accent]}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {icon}
                      <span className="text-[9px] uppercase tracking-wider opacity-70">
                        {label}
                      </span>
                    </div>
                    <div className="text-white font-black text-base">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bio details */}
            {!loading && details && (
              <div className="space-y-2">
                {details.birthday && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <FiCalendar
                      size={13}
                      className="text-gray-600 flex-shrink-0"
                    />
                    <span className="text-gray-500">Born</span>
                    <span className="text-gray-300">
                      {formatDate(details.birthday)}
                    </span>
                    {details.deathday && (
                      <>
                        <span className="text-gray-700">·</span>
                        <span className="text-gray-400">
                          Died {formatDate(details.deathday)}
                        </span>
                      </>
                    )}
                  </div>
                )}
                {details.place_of_birth && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <FiMapPin
                      size={13}
                      className="text-gray-600 flex-shrink-0"
                    />
                    <span className="text-gray-500">Born in</span>
                    <span className="text-gray-300">
                      {details.place_of_birth}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Biography */}
            {!loading && details?.biography && (
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">
                  Biography
                </p>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">
                  {details.biography}
                </p>
              </div>
            )}

            {/* Popularity bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-600 text-[10px] uppercase tracking-widest">
                  Popularity Score
                </span>
                <span className="text-rose-400 text-xs font-black">
                  {Math.round(person.popularity)} / 350
                </span>
              </div>
              <PopularityBar
                value={person.popularity}
                max={350}
                accent="rose"
              />
            </div>

            {/* Known for films */}
            {credits.length > 0 && (
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">
                  Known For
                </p>
                <div
                  className="flex gap-3 overflow-x-auto pb-1"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {credits.map((item) => (
                    <div
                      key={`${item.id}-${item.credit_id}`}
                      className="flex-shrink-0 w-[90px] group/item cursor-pointer"
                    >
                      <div className="w-[90px] h-[130px] rounded-xl overflow-hidden border border-white/8 group-hover/item:border-rose-500/30 transition-colors duration-200 mb-2">
                        <ImageOrFallback
                          src={item.poster_path ? W185 + item.poster_path : ''}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-gray-400 text-[9px] leading-snug line-clamp-2 group-hover/item:text-rose-300 transition-colors duration-200">
                        {item.title || item.name}
                      </p>
                      {(item.release_date || item.first_air_date) && (
                        <p className="text-gray-700 text-[8px] mt-0.5">
                          {(item.release_date || item.first_air_date)?.slice(
                            0,
                            4,
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Shimmer key={i} className="h-[130px]" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MASONRY GRID  (alternating tall/normal cards)
───────────────────────────────────────────── */
const MasonryGrid = ({ people, startRank, onSelect }) => {
  // Pattern: [normal, tall, normal, normal, tall, normal, featured, normal, normal, tall ...]
  const sizePattern = [
    'normal',
    'tall',
    'normal',
    'normal',
    'tall',
    'normal',
    'tall',
    'normal',
    'normal',
    'normal',
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {people.map((person, i) => (
        <CelebCard
          key={person.id}
          person={person}
          rank={startRank + i}
          onSelect={onSelect}
          size={sizePattern[i % sizePattern.length]}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const CelebritiesPage = () => {
  const [allPeople, setAllPeople] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [hero, setHero] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [department, setDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [fetchedPages, setFetchedPages] = useState([]);
  const searchRef = useRef(null);
  const gridTopRef = useRef(null);

  /* ── FETCH INITIAL ── */
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await get('/person/popular', { page: 1 });
        const people = res.data.results.filter((p) => p.profile_path);
        setAllPeople(people);
        setDisplayed(people.slice(1)); // slice 1 — hero gets index 0
        setHero(people[0] || null);
        setTotalPages(Math.min(res.data.total_pages, 20));
        setFetchedPages([1]);
      } catch (e) {
        console.error('CelebritiesPage fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  /* ── LOAD MORE PAGES ── */
  const loadMore = useCallback(async () => {
    const nextPage = fetchedPages.length + 1;
    if (nextPage > totalPages || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await get('/person/popular', { page: nextPage });
      const newPeople = res.data.results.filter((p) => p.profile_path);
      setAllPeople((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...newPeople.filter((p) => !ids.has(p.id))];
      });
      setFetchedPages((prev) => [...prev, nextPage]);
    } catch (e) {
      console.error('Load more error', e);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchedPages, totalPages, loadingMore]);

  /* ── FILTER BY DEPARTMENT ── */
  const filteredPeople = allPeople.filter(
    (p) => department === 'all' || p.known_for_department === department,
  );

  /* ── SEARCH ── */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await get('/search/person', {
          query: searchQuery,
          page: 1,
        });
        setSearchResults(
          res.data.results.filter((p) => p.profile_path).slice(0, 20),
        );
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const activeList = searchQuery.trim() ? searchResults : filteredPeople;
  const heroVisible = !searchQuery.trim() && department === 'all';

  /* ── PAGINATION (client-side on filtered) ── */
  const PER_PAGE = 20;
  const totalFilteredPages = Math.ceil(
    activeList.slice(heroVisible ? 1 : 0).length / PER_PAGE,
  );
  const pageStart = (currentPage - 1) * PER_PAGE;
  const baseList = activeList.slice(heroVisible ? 1 : 0);
  const pageItems = baseList.slice(pageStart, pageStart + PER_PAGE);

  const handlePageChange = (p) => {
    setCurrentPage(p);
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Pre-fetch more data if needed
    if (pageItems.length < PER_PAGE) loadMore();
  };

  const handleDeptChange = (dept) => {
    setDepartment(dept);
    setCurrentPage(1);
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0a0908' }}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .celeb-card-hover { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .celeb-card-hover:hover { transform: translateY(-4px) scale(1.01); }
      `}</style>

      {/* ═══════════════════════════════════════
          HERO SPOTLIGHT
      ═══════════════════════════════════════ */}
      {heroVisible &&
        (loading ? (
          <Shimmer className="h-[480px] w-full rounded-none" />
        ) : (
          <HeroSpotlight person={hero} onSelect={setSelected} />
        ))}

      {/* ═══════════════════════════════════════
          MARQUEE TICKER
      ═══════════════════════════════════════ */}
      {!loading && <MarqueeTicker people={allPeople.slice(0, 30)} />}

      {/* ═══════════════════════════════════════
          SEARCH + FILTERS BAR
      ═══════════════════════════════════════ */}
      <div className="sticky top-16 z-30 bg-[#0a0908]/90 backdrop-blur-md border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-[320px]">
              <FiSearch
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
              />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search celebrities..."
                className="w-full bg-white/5 border border-white/10 text-white text-sm pl-9 pr-9 py-2 rounded-xl focus:outline-none focus:border-rose-500/40 focus:bg-rose-500/5 placeholder-gray-600 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors duration-200"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* Department filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleDeptChange(dept.id)}
                  className={`flex items-center gap-1.5 flex-shrink-0 text-xs px-3.5 py-2 rounded-xl border font-medium transition-all duration-200 ${
                    department === dept.id
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-900/20'
                      : 'bg-white/4 border-white/8 text-gray-500 hover:border-white/15 hover:text-gray-300'
                  }`}
                >
                  {dept.icon} {dept.label}
                </button>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Count */}
            <span className="text-gray-700 text-xs hidden sm:block">
              {activeList.length} celebrities
            </span>

            {/* View toggle */}
            <div className="flex items-center bg-white/4 border border-white/8 rounded-xl overflow-hidden">
              {[
                { mode: 'grid', icon: <FiGrid size={13} /> },
                { mode: 'list', icon: <FiList size={13} /> },
              ].map(({ mode, icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 transition-all duration-200 ${viewMode === mode ? 'bg-rose-500/20 text-rose-300' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          SECTION HEADER
      ═══════════════════════════════════════ */}
      <div ref={gridTopRef} className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-1 h-7 bg-gradient-to-b from-rose-500 to-pink-600 rounded-full" />
          <h2
            className="text-white font-black text-xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {searchQuery.trim()
              ? `Results for "${searchQuery}"`
              : department === 'all'
                ? 'The Directory'
                : `${DEPARTMENTS.find((d) => d.id === department)?.label}`}
          </h2>
          {activeList.length > 0 && (
            <span className="bg-rose-500/12 border border-rose-500/20 text-rose-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {activeList.length} people
            </span>
          )}
        </div>
        <p className="text-gray-700 text-xs ml-5">
          {searchQuery.trim()
            ? 'Search results from TMDB database'
            : 'Ranked by global popularity · Click any portrait for full profile'}
        </p>
      </div>

      {/* ═══════════════════════════════════════
          MAIN GRID / LIST
      ═══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 15 }).map((_, i) => (
              <Shimmer
                key={i}
                className={i % 3 === 1 ? 'h-[360px]' : 'h-[280px]'}
              />
            ))}
          </div>
        )}

        {/* Searching indicator */}
        {isSearching && (
          <div className="flex items-center justify-center gap-3 py-16">
            <div className="w-5 h-5 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            <span className="text-gray-500 text-sm">Searching…</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !isSearching && activeList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-full bg-rose-500/8 border border-rose-500/15 flex items-center justify-center mb-5">
              <FiUser size={32} className="text-rose-400/30" />
            </div>
            <p className="text-gray-500 text-base font-medium">
              No celebrities found
            </p>
            <p className="text-gray-700 text-sm mt-1">
              {searchQuery ? 'Try a different name' : 'Try a different filter'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDepartment('all');
              }}
              className="mt-5 text-rose-400 text-sm border border-rose-500/25 hover:border-rose-500/50 px-5 py-2 rounded-full transition-all duration-200"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* GRID VIEW */}
        {!loading &&
          !isSearching &&
          pageItems.length > 0 &&
          viewMode === 'grid' && (
            <MasonryGrid
              people={pageItems}
              startRank={heroVisible ? pageStart + 2 : pageStart + 1}
              onSelect={setSelected}
            />
          )}

        {/* LIST VIEW */}
        {!loading &&
          !isSearching &&
          pageItems.length > 0 &&
          viewMode === 'list' && (
            <div className="flex flex-col gap-2">
              {pageItems.map((person, i) => (
                <ListRow
                  key={person.id}
                  person={person}
                  rank={heroVisible ? pageStart + i + 2 : pageStart + i + 1}
                  onSelect={setSelected}
                />
              ))}
            </div>
          )}

        {/* Loading more indicator */}
        {loadingMore && (
          <div className="flex items-center justify-center gap-2 py-6">
            <div className="w-4 h-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
            <span className="text-gray-600 text-sm">Loading more…</span>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          PAGINATION
      ═══════════════════════════════════════ */}
      {!loading && !isSearching && totalFilteredPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-14">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-gray-500 hover:border-rose-500/40 hover:text-rose-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronLeft size={15} />
          </button>

          {Array.from({ length: totalFilteredPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalFilteredPages ||
                Math.abs(p - currentPage) <= 2,
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
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-full text-sm font-bold border transition-all duration-200 ${
                    currentPage === p
                      ? 'bg-gradient-to-br from-rose-600 to-pink-600 border-transparent text-white shadow-lg shadow-rose-900/40'
                      : 'bg-white/4 border-white/8 text-gray-500 hover:border-rose-500/30 hover:text-rose-300'
                  }`}
                >
                  {p}
                </button>
              ),
            )}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalFilteredPages, currentPage + 1))
            }
            disabled={currentPage === totalFilteredPages}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-gray-500 hover:border-rose-500/40 hover:text-rose-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════
          DETAIL MODAL
      ═══════════════════════════════════════ */}
      {selected && (
        <DetailModal person={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default CelebritiesPage;
