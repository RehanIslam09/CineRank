import React, { useState, useCallback, useRef } from 'react';
import { MOODS, recommendMovies } from '../recommendations/recommendMovies';
import { useWatchlist } from '../context/WatchlistContext';
import {
  FiBookmark,
  FiRefreshCw,
  FiStar,
  FiX,
  FiChevronRight,
  FiHeart,
  FiZap,
  FiInfo,
} from 'react-icons/fi';
import { FaBookmark, FaPlay, FaStar, FaRegStar, FaFire } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';

/* ─────────────────────────────────────────────
   API image bases
───────────────────────────────────────────── */
const W500 = 'https://image.tmdb.org/t/p/w500';
const W300 = 'https://image.tmdb.org/t/p/w300';
const ORIG = 'https://image.tmdb.org/t/p/original';

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
  99: 'Documentary',
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const ImageOrFallback = ({ src, alt, className }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className={`${className} bg-[#1a1a2e] flex items-center justify-center`}
      >
        <FiStar size={20} className="text-purple-400/20" />
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

const Stars = ({ rating }) => {
  const n = Math.round(rating / 2);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) =>
        i < n ? (
          <FaStar key={i} size={10} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} size={10} className="text-gray-700" />
        ),
      )}
    </div>
  );
};

const SourceBadge = ({ source }) => {
  if (source === 'watchlist')
    return (
      <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-bold uppercase tracking-wider">
        <FiHeart size={8} /> Watchlist
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400 font-bold uppercase tracking-wider">
      <FiZap size={8} /> For You
    </span>
  );
};

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
const SkeletonCard = ({ i }) => (
  <div
    className="bg-[#0d0d18] border border-purple-900/20 rounded-3xl overflow-hidden animate-pulse"
    style={{ animationDelay: `${i * 80}ms` }}
  >
    <div className="h-[220px] bg-gradient-to-br from-purple-900/10 via-purple-800/15 to-purple-900/10" />
    <div className="p-4 space-y-2.5">
      <div className="h-4 bg-purple-900/20 rounded-lg w-3/4" />
      <div className="h-3 bg-purple-900/12 rounded-lg w-1/2" />
      <div className="h-3 bg-purple-900/10 rounded-lg w-full" />
      <div className="h-3 bg-purple-900/10 rounded-lg w-5/6" />
      <div className="h-3 bg-purple-900/8 rounded-lg w-2/3" />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   RECOMMENDATION CARD  (full)
───────────────────────────────────────────── */
const RecCard = ({ rec, moodCfg, index }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { movie, reasoning, source } = rec;
  const saved = isInWatchlist(movie.id);
  const genres = (movie.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const toggle = (e) => {
    e.stopPropagation();
    saved
      ? removeFromWatchlist(movie.id)
      : addToWatchlist(movie, 'for_you', 'movie');
  };

  return (
    <div
      className="group relative bg-[#0d0d18] border border-purple-900/30 hover:border-purple-500/40 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-900/30 cursor-pointer rec-enter"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Top accent bar in mood color */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${moodCfg.color} z-10`}
      />

      {/* Backdrop / poster */}
      <div className="relative h-[220px] overflow-hidden">
        <ImageOrFallback
          src={
            movie.backdrop_path
              ? W300 + movie.backdrop_path
              : movie.poster_path
                ? W500 + movie.poster_path
                : ''
          }
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] via-[#0d0d18]/20 to-transparent" />

        {/* Poster thumbnail — bottom left overlap */}
        <div className="absolute bottom-3 left-3 w-[52px] h-[74px] rounded-xl overflow-hidden border border-purple-500/40 shadow-xl flex-shrink-0 z-10">
          <ImageOrFallback
            src={movie.poster_path ? W500 + movie.poster_path : ''}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Source badge */}
        <div className="absolute top-3 left-3 z-10">
          <SourceBadge source={source} />
        </div>

        {/* Watchlist button */}
        <button
          onClick={toggle}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${saved ? 'bg-purple-500/40 border-purple-400/60 text-purple-200 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-sm border-white/15 text-white/70 hover:bg-purple-500/30 hover:text-purple-300'}`}
        >
          {saved ? <FaBookmark size={12} /> : <FiBookmark size={12} />}
        </button>

        {/* Rating bubble */}
        {movie.vote_average > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-xl border border-yellow-500/20 z-10">
            <AiFillStar className="text-yellow-400" size={11} />
            <span className="text-yellow-300 text-xs font-black">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pt-3">
        {/* Title — left-padded to clear poster */}
        <div className="pl-16 mb-3">
          <h3 className="text-white text-sm font-bold leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {movie.release_date && (
              <span className="text-gray-600 text-[10px]">
                {movie.release_date.slice(0, 4)}
              </span>
            )}
            {movie.vote_average > 0 && (
              <>
                <span className="text-gray-700 text-[10px]">·</span>
                <Stars rating={movie.vote_average} />
              </>
            )}
          </div>
        </div>

        {/* Genre pills */}
        <div className="flex gap-1 flex-wrap mb-3">
          {genres.map((g) => (
            <span
              key={g}
              className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/15 text-purple-400"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Reasoning */}
        <div className="flex items-start gap-2 bg-white/3 border border-white/6 rounded-xl p-2.5">
          <FiInfo size={11} className="text-gray-600 flex-shrink-0 mt-0.5" />
          <p className="text-gray-500 text-[10px] leading-relaxed italic line-clamp-3">
            {reasoning}
          </p>
        </div>

        {/* CTA */}
        <button className="mt-3 w-full flex items-center justify-center gap-2 bg-white/4 hover:bg-purple-500/15 border border-white/8 hover:border-purple-500/30 text-gray-400 hover:text-purple-300 text-xs font-semibold py-2 rounded-xl transition-all duration-200">
          <FaPlay size={9} /> Watch Trailer
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MOOD CARD  (large, clickable)
───────────────────────────────────────────── */
const MoodCard = ({ mood, isActive, onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`group relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-wait overflow-hidden ${
      isActive
        ? `bg-gradient-to-br ${mood.color} border-transparent shadow-xl scale-105`
        : `bg-[#0d0d18] ${mood.border} hover:scale-[1.03] hover:shadow-lg`
    }`}
  >
    {/* Ambient glow when active */}
    {isActive && (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-20 blur-xl`}
      />
    )}
    <span className="relative z-10 text-3xl leading-none">{mood.emoji}</span>
    <span
      className={`relative z-10 text-xs font-bold tracking-wide ${isActive ? 'text-white' : `text-gray-400 group-hover:text-white`} transition-colors duration-200`}
    >
      {mood.label}
    </span>
    {isActive && (
      <span className="relative z-10 flex items-center gap-1 text-[9px] text-white/70">
        <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />{' '}
        Active
      </span>
    )}
  </button>
);

/* ─────────────────────────────────────────────
   HERO HEADER
───────────────────────────────────────────── */
const ForYouHero = ({ activeMood, watchlistCount }) => {
  const hasWatchlist = watchlistCount > 0;
  return (
    <div className="relative overflow-hidden border-b border-purple-900/20">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-fuchsia-600/5 blur-3xl" />
        {activeMood && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${activeMood.color} opacity-5 transition-opacity duration-700`}
          />
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {/* Label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-2 bg-purple-500/12 border border-purple-500/25 text-purple-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                <FiZap size={9} /> Personalised For You
              </span>
              {hasWatchlist && (
                <span className="text-gray-600 text-[10px] border border-white/8 px-2.5 py-1 rounded-full">
                  Based on {watchlistCount} saved film
                  {watchlistCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-black leading-[0.9] mb-3 text-white"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: '-0.02em',
                textShadow: '0 0 60px rgba(168,85,247,0.15)',
              }}
            >
              {activeMood ? (
                <>
                  Your{' '}
                  <span
                    style={{
                      background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundImage: `linear-gradient(135deg, #a855f7, #ec4899)`,
                    }}
                  >
                    {activeMood.emoji} {activeMood.label}
                  </span>{' '}
                  Picks
                </>
              ) : (
                <>
                  What's Your
                  <br />
                  Mood Tonight?
                </>
              )}
            </h1>

            <p className="text-gray-500 text-base max-w-lg leading-relaxed">
              {activeMood
                ? `6 handpicked films for your ${activeMood.label.toLowerCase()} mood — curated from your taste and what's trending.`
                : 'Pick a mood and get 6 films picked just for you — personalised to your watchlist and taste.'}
            </p>
          </div>

          {/* Stats */}
          {activeMood && (
            <div className="flex gap-5 flex-shrink-0">
              {[
                { val: '6', label: 'Picks' },
                {
                  val: hasWatchlist ? `${watchlistCount}` : '0',
                  label: 'Watchlist',
                },
                { val: `${MOODS.length}`, label: 'Moods' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-white text-2xl font-black"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {val}
                  </div>
                  <div className="text-gray-700 text-[9px] uppercase tracking-wider">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   EMPTY STATE  (no mood selected yet)
───────────────────────────────────────────── */
const EmptyState = ({ watchlistCount }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
    <div className="text-6xl mb-5">🎬</div>
    <h3
      className="text-white font-black text-xl mb-2"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      Pick a mood to begin
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">
      Choose any mood from the grid above and we'll instantly generate 6
      personalised film picks — tailored to your taste.
    </p>
    {watchlistCount === 0 && (
      <div className="flex items-start gap-2.5 bg-purple-500/8 border border-purple-500/18 rounded-2xl px-4 py-3 text-left">
        <FiInfo size={14} className="text-purple-400/60 flex-shrink-0 mt-0.5" />
        <p className="text-gray-500 text-xs leading-relaxed">
          <span className="text-purple-400 font-semibold">Tip:</span> Add films
          to your watchlist first for even more personalised recommendations
          based on your actual taste.
        </p>
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const ForYouPage = () => {
  const { watchlist } = useWatchlist();
  const [activeMood, setActiveMood] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  const handleMoodSelect = useCallback(
    async (mood) => {
      if (loading) return;

      // Toggle off
      if (activeMood?.id === mood.id && recs.length > 0) {
        setActiveMood(null);
        setRecs([]);
        return;
      }

      setActiveMood(mood);
      setError('');
      setLoading(true);
      setRecs([]);

      try {
        const results = await recommendMovies({ moodId: mood.id, watchlist });
        setRecs(results);
        // Smooth scroll to results
        setTimeout(
          () =>
            resultsRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            }),
          100,
        );
      } catch (e) {
        console.error('ForYouPage recommend error', e);
        setError('Could not load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [loading, activeMood, recs.length, watchlist],
  );

  const refresh = useCallback(() => {
    if (activeMood) handleMoodSelect(activeMood);
  }, [activeMood, handleMoodSelect]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-16">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none }
        @keyframes recEnter {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rec-enter { animation: recEnter 0.45s ease forwards; opacity: 0; }
      `}</style>

      {/* HERO */}
      <ForYouHero activeMood={activeMood} watchlistCount={watchlist.length} />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── MOOD GRID ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-7 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full" />
            <h2 className="text-white font-bold text-lg">Choose Your Mood</h2>
            <span className="bg-purple-500/12 border border-purple-500/22 text-purple-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {MOODS.length} moods
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
            {MOODS.map((mood) => (
              <MoodCard
                key={mood.id}
                mood={mood}
                isActive={activeMood?.id === mood.id}
                onClick={() => handleMoodSelect(mood)}
                isLoading={loading}
              />
            ))}
          </div>
        </div>

        {/* ── RESULTS SECTION ── */}
        <div ref={resultsRef}>
          {/* Section header when showing results */}
          {(loading || recs.length > 0) && activeMood && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-1 h-7 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full" />
                <h2 className="text-white font-bold text-lg">
                  {loading
                    ? 'Finding your picks…'
                    : `Your ${activeMood.emoji} ${activeMood.label} Picks`}
                </h2>
                {!loading && (
                  <span className="bg-purple-500/12 border border-purple-500/22 text-purple-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {recs.length} films
                  </span>
                )}
              </div>
              {!loading && (
                <button
                  onClick={refresh}
                  className="flex items-center gap-2 text-gray-500 hover:text-purple-400 text-xs border border-white/8 hover:border-purple-500/30 px-3 py-1.5 rounded-xl transition-all duration-200"
                >
                  <FiRefreshCw size={12} /> Refresh picks
                </button>
              )}
            </div>
          )}

          {/* Loading skeleton grid */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} i={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-2xl px-5 py-4 mb-4">
              <span className="text-red-400 text-sm flex-1">{error}</span>
              <button
                onClick={refresh}
                className="flex items-center gap-1.5 text-red-300 hover:text-red-200 text-sm font-semibold transition-colors duration-200"
              >
                <FiRefreshCw size={13} /> Try again
              </button>
            </div>
          )}

          {/* Results grid */}
          {!loading && recs.length > 0 && activeMood && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                {recs.map((rec, i) => (
                  <RecCard
                    key={rec.movie.id}
                    rec={rec}
                    moodCfg={activeMood}
                    index={i}
                  />
                ))}
              </div>

              {/* Personalisation note */}
              <div className="mt-8 flex items-start gap-3 bg-purple-500/6 border border-purple-500/15 rounded-2xl px-5 py-4">
                <FiInfo
                  size={15}
                  className="text-purple-400/50 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {watchlist.length > 0
                      ? `These picks are personalised using your ${watchlist.length} saved film${watchlist.length > 1 ? 's' : ''} — the more you save, the sharper your recommendations get.`
                      : 'These are trending picks for your mood. Add films to your watchlist for personalised recommendations based on your actual taste.'}
                  </p>
                </div>
              </div>

              {/* Other moods prompt */}
              <div className="mt-6 text-center">
                <p className="text-gray-700 text-sm">Not feeling it?</p>
                <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                  {MOODS.filter((m) => m.id !== activeMood.id)
                    .slice(0, 5)
                    .map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => handleMoodSelect(mood)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200 bg-white/4 ${mood.border} ${mood.text} hover:scale-[1.05]`}
                      >
                        {mood.emoji} {mood.label}
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* Empty state — no mood selected */}
          {!loading && recs.length === 0 && !activeMood && !error && (
            <EmptyState watchlistCount={watchlist.length} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForYouPage;
