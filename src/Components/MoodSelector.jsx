import React, { useState, useCallback } from 'react';
import { useMood, MOODS } from '../context/MoodContext';
import { useWatchlist } from '../context/WatchlistContext';
import { recommendMovies } from '../recommendations/recommendMovies';
import { FiBookmark, FiRefreshCw, FiStar, FiX } from 'react-icons/fi';
import { FaBookmark, FaStar } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';

const W500 = 'https://image.tmdb.org/t/p/w500';
const W300 = 'https://image.tmdb.org/t/p/w300';

/* ─── Image fallback ─── */
const Img = ({ src, alt, className }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className={`${className} bg-[#1a1a2e] flex items-center justify-center`}
      >
        <FiStar size={16} className="text-purple-400/20" />
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

/* ─── Source badge ─── */
const SourceBadge = ({ source }) => {
  if (source === 'watchlist')
    return (
      <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-bold uppercase tracking-wider">
        From Watchlist
      </span>
    );
  return (
    <span className="text-[8px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400 font-bold uppercase tracking-wider">
      Recommended
    </span>
  );
};

/* ─── Single recommendation card ─── */
const RecommendationCard = ({ rec, moodCfg, animDelay }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { movie, reasoning, source } = rec;
  const saved = isInWatchlist(movie.id);
  const genres = (movie.genre_ids || [])
    .slice(0, 2)
    .map(
      (id) =>
        ({
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
          10751: 'Family',
          99: 'Documentary',
          36: 'History',
          37: 'Western',
        })[id],
    )
    .filter(Boolean);

  const toggle = (e) => {
    e.stopPropagation();
    saved
      ? removeFromWatchlist(movie.id)
      : addToWatchlist(movie, 'mood_pick', 'movie');
  };

  return (
    <div
      className="group relative bg-[#0d0d18] border border-purple-900/30 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/25 flex-shrink-0"
      style={{ width: '200px', animationDelay: `${animDelay}ms` }}
    >
      {/* Poster */}
      <div className="relative h-[260px] overflow-hidden">
        <Img
          src={movie.poster_path ? W500 + movie.poster_path : ''}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d18] via-[#0d0d18]/10 to-transparent" />

        {/* Mood color accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${moodCfg.color}`}
        />

        {/* Source badge */}
        <div className="absolute top-3 left-3">
          <SourceBadge source={source} />
        </div>

        {/* Watchlist button */}
        <button
          onClick={toggle}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${saved ? 'bg-purple-500/40 border-purple-400/60 text-purple-200 opacity-100' : 'opacity-0 group-hover:opacity-100 bg-black/60 border-white/15 text-white/70 hover:bg-purple-500/30 hover:text-purple-300'}`}
        >
          {saved ? <FaBookmark size={11} /> : <FiBookmark size={11} />}
        </button>

        {/* Rating */}
        {movie.vote_average > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-yellow-500/20">
            <AiFillStar className="text-yellow-400" size={10} />
            <span className="text-yellow-300 text-[11px] font-bold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-white text-sm font-bold leading-snug line-clamp-2 mb-1.5 group-hover:text-purple-300 transition-colors duration-200">
          {movie.title}
        </h4>

        {/* Genre pills */}
        <div className="flex gap-1 flex-wrap mb-2">
          {genres.map((g) => (
            <span
              key={g}
              className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/15 text-purple-400"
            >
              {g}
            </span>
          ))}
          {movie.release_date && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/8 text-gray-500">
              {movie.release_date.slice(0, 4)}
            </span>
          )}
        </div>

        {/* Reasoning */}
        <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-3 italic">
          "{reasoning}"
        </p>
      </div>
    </div>
  );
};

/* ─── Skeleton card ─── */
const SkeletonCard = () => (
  <div
    className="flex-shrink-0 bg-[#0d0d18] border border-purple-900/20 rounded-2xl overflow-hidden animate-pulse"
    style={{ width: '200px' }}
  >
    <div className="h-[260px] bg-gradient-to-br from-purple-900/10 via-purple-800/15 to-purple-900/10" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-purple-900/20 rounded w-3/4" />
      <div className="h-2 bg-purple-900/10 rounded w-1/2" />
      <div className="h-2 bg-purple-900/10 rounded w-full" />
      <div className="h-2 bg-purple-900/10 rounded w-5/6" />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN MOOD SELECTOR COMPONENT
───────────────────────────────────────────── */
const MoodSelector = () => {
  const { selectedMood, setSelectedMood } = useMood();
  const { watchlist } = useWatchlist();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeMood, setActiveMood] = useState(null); // mood that results are currently showing for

  const handleMoodSelect = useCallback(
    async (mood) => {
      if (loading) return;

      // If clicking same mood and results showing → clear
      if (activeMood?.id === mood.id && recs.length > 0) {
        setActiveMood(null);
        setRecs([]);
        setSelectedMood(null);
        return;
      }

      setSelectedMood(mood);
      setActiveMood(mood);
      setError('');
      setLoading(true);
      setRecs([]);

      try {
        const results = await recommendMovies({ moodId: mood.id, watchlist });
        setRecs(results);
      } catch (e) {
        console.error('Recommendation error', e);
        setError('Could not load recommendations. Try again.');
      } finally {
        setLoading(false);
      }
    },
    [loading, activeMood, recs.length, watchlist, setSelectedMood],
  );

  const clearMood = () => {
    setActiveMood(null);
    setSelectedMood(null);
    setRecs([]);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <style>{`.recs-scroll::-webkit-scrollbar{display:none}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .rec-card{animation:fadeSlideUp 0.4s ease forwards;opacity:0}
      `}</style>

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-1 h-7 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full" />
          <h2 className="text-white font-bold text-lg">How are you feeling?</h2>
          {activeMood && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${activeMood.bg} ${activeMood.border} ${activeMood.text}`}
            >
              {activeMood.emoji} {activeMood.label}
            </span>
          )}
        </div>
        {activeMood && (
          <button
            onClick={clearMood}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-xs transition-colors duration-200"
          >
            <FiX size={12} /> Clear
          </button>
        )}
      </div>

      {/* ── MOOD PILLS ── */}
      <div className="flex gap-2 flex-wrap mb-5">
        {MOODS.map((mood) => {
          const isActive = activeMood?.id === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              disabled={loading}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 disabled:opacity-60 disabled:cursor-wait ${
                isActive
                  ? `bg-gradient-to-r ${mood.color} border-transparent text-white shadow-lg`
                  : `bg-white/4 border-white/10 text-gray-400 hover:border-white/20 hover:text-white hover:bg-white/8`
              }`}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
          <span>{error}</span>
          <button
            onClick={() => activeMood && handleMoodSelect(activeMood)}
            className="ml-auto text-red-300 hover:text-red-200 flex items-center gap-1 text-xs"
          >
            <FiRefreshCw size={11} /> Retry
          </button>
        </div>
      )}

      {/* ── LOADING SKELETONS ── */}
      {loading && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            <span className="text-gray-500 text-sm">
              Finding your perfect {activeMood?.label.toLowerCase()} picks…
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto recs-scroll pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {!loading && recs.length > 0 && activeMood && (
        <div>
          {/* Results header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white text-sm font-semibold">
              {recs.length} picks for your{' '}
              <span className={activeMood.text}>
                {activeMood.emoji} {activeMood.label}
              </span>{' '}
              mood
            </span>
            <button
              onClick={() => handleMoodSelect(activeMood)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-purple-400 text-xs transition-colors duration-200 ml-auto"
            >
              <FiRefreshCw size={11} /> Refresh
            </button>
          </div>

          {/* Horizontal scroll of cards */}
          <div className="flex gap-4 overflow-x-auto recs-scroll pb-3">
            {recs.map((rec, i) => (
              <div
                key={rec.movie.id}
                className="rec-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <RecommendationCard
                  rec={rec}
                  moodCfg={activeMood}
                  animDelay={i * 60}
                />
              </div>
            ))}
          </div>

          {/* Watchlist note */}
          {watchlist.length === 0 && (
            <p className="text-gray-700 text-[11px] mt-2">
              💡 Add movies to your watchlist for even more personalised picks
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodSelector;
