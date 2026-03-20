import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBookmark, FiAward } from 'react-icons/fi';
import { FaBookmark, FaPlay, FaTrophy } from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { MdAccessTime } from 'react-icons/md';
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
  10765: 'Sci-Fi & Fantasy',
  10768: 'War & Politics',
};

const TopRatedHero = ({ mediaType }) => {
  const [hero, setHero] = useState(null);
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const endpoint =
          mediaType === 'tv'
            ? `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`
            : `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

        const res = await axios.get(endpoint);
        const top = res.data.results[0];
        setHero(top);

        const detailEndpoint =
          mediaType === 'tv'
            ? `${BASE_URL}/tv/${top.id}`
            : `${BASE_URL}/movie/${top.id}`;
        const creditsEndpoint =
          mediaType === 'tv'
            ? `${BASE_URL}/tv/${top.id}/credits`
            : `${BASE_URL}/movie/${top.id}/credits`;

        const [detailRes, creditsRes] = await Promise.all([
          axios.get(`${detailEndpoint}?api_key=${API_KEY}&language=en-US`),
          axios.get(`${creditsEndpoint}?api_key=${API_KEY}&language=en-US`),
        ]);
        setDetails(detailRes.data);
        setCast(creditsRes.data.cast.slice(0, 5));
      } catch (e) {
        console.error('TopRatedHero fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [mediaType]);

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-gradient-to-br from-yellow-900/10 via-purple-900/10 to-[#0a0a0f] animate-pulse flex items-end px-10 pb-10">
        <div className="flex gap-6 items-end w-full">
          <div className="w-[160px] h-[240px] rounded-2xl bg-purple-900/20 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-32 bg-purple-900/20 rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-purple-900/20 rounded animate-pulse" />
            <div className="h-4 w-full bg-purple-900/20 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-purple-900/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!hero) return null;

  const title = hero.title || hero.name;
  const year = (hero.release_date || hero.first_air_date || '').slice(0, 4);
  const genres = (hero.genre_ids || [])
    .slice(0, 4)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);
  const runtime = details?.runtime || details?.episode_run_time?.[0];
  const saved = isInWatchlist(hero.id);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: '500px' }}
    >
      {/* BACKDROP */}
      {hero.backdrop_path && (
        <>
          <img
            src={IMG_BACKDROP + hero.backdrop_path}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-20 pointer-events-none"
          />
          <img
            src={IMG_BACKDROP + hero.backdrop_path}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        </>
      )}

      {/* GRADIENTS */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/70 to-[#0a0a0f]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />

      {/* GOLDEN GLOW TOP */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* CONTENT */}
      <div
        className="relative z-10 flex items-end gap-8 px-10 pb-12 pt-16"
        style={{ minHeight: '500px' }}
      >
        {/* POSTER with trophy overlay */}
        <div className="relative flex-shrink-0">
          {/* TROPHY BADGE */}
          <div className="absolute -top-4 -left-4 z-20 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-xl shadow-yellow-900/50 border-2 border-yellow-300/50">
            <FaTrophy size={18} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 z-20 bg-black/80 border border-yellow-500/40 text-yellow-400 text-xs font-black px-2 py-0.5 rounded-full">
            #1
          </div>
          <div className="w-[160px] h-[240px] rounded-2xl overflow-hidden border-2 border-yellow-500/40 shadow-2xl shadow-yellow-900/30">
            <ImageOrFallback
              src={hero.poster_path ? IMG_W + hero.poster_path : ''}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* TEXT */}
        <div className="flex-1 min-w-0">
          {/* LABEL */}
          <div className="flex items-center gap-2 mb-3">
            <FiAward className="text-yellow-400" size={16} />
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">
              {mediaType === 'tv'
                ? 'All Time Top Rated TV Show'
                : 'All Time Top Rated Movie'}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="text-4xl font-black text-white leading-tight mb-3 line-clamp-2">
            {title}
          </h1>

          {/* META ROW */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* RATING */}
            <div className="flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-500/30 px-3 py-1.5 rounded-lg">
              <AiFillStar className="text-yellow-400" size={16} />
              <span className="text-yellow-300 font-black text-lg">
                {hero.vote_average?.toFixed(1)}
              </span>
              <span className="text-gray-500 text-xs">/ 10</span>
            </div>
            {details?.vote_count > 0 && (
              <span className="text-gray-500 text-sm">
                {details.vote_count.toLocaleString()} votes
              </span>
            )}
            {year && <span className="text-gray-400 text-sm">{year}</span>}
            {runtime && (
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <MdAccessTime size={14} className="text-gray-600" />
                {Math.floor(runtime / 60)}h {runtime % 60}m
              </span>
            )}
            {mediaType === 'tv' && details?.number_of_seasons && (
              <span className="text-gray-400 text-sm">
                {details.number_of_seasons} Seasons
              </span>
            )}
          </div>

          {/* GENRES */}
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map((g) => (
              <span
                key={g}
                className="bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs px-3 py-1 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>

          {/* OVERVIEW */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-5 max-w-2xl">
            {hero.overview}
          </p>

          {/* CAST */}
          {cast.length > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex -space-x-2">
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] overflow-hidden flex-shrink-0"
                    title={actor.name}
                  >
                    <ImageOrFallback
                      src={
                        actor.profile_path ? IMG_FACE + actor.profile_path : ''
                      }
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-gray-500 text-xs">
                {cast.map((a) => a.name).join(', ')}
              </span>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black px-6 py-2.5 rounded-xl text-sm font-black shadow-xl shadow-yellow-900/40 transition-all duration-200">
              <FaPlay size={11} /> Watch Trailer
            </button>
            <button
              onClick={() =>
                saved
                  ? removeFromWatchlist(hero.id)
                  : addToWatchlist(hero, 'top_rated', mediaType)
              }
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${saved ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'border-white/15 text-white hover:bg-white/5'}`}
            >
              {saved ? <FaBookmark size={12} /> : <FiBookmark size={12} />}
              {saved ? 'Saved' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRatedHero;
