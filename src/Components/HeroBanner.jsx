import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight, FiBookmark } from 'react-icons/fi';
import { FaPlay, FaBookmark } from 'react-icons/fa';
import { MdCalendarToday } from 'react-icons/md';
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
const IMG_SMALL = 'https://image.tmdb.org/t/p/w185';

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
};

/* ================= HERO BANNER ================= */

const HeroBanner = ({ onNavigate }) => {
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [castMap, setCastMap] = useState({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const intervalRef = useRef(null);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendingRes, upcomingRes] = await Promise.all([
          axios.get(
            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`,
          ),
          axios.get(
            `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
          ),
        ]);
        const trendingMovies = trendingRes.data.results.slice(0, 6);
        const upcomingMovies = upcomingRes.data.results
          .filter((m) => m.backdrop_path)
          .slice(0, 8);
        setFeatured(trendingMovies);
        setUpcoming(upcomingMovies);
        const castResults = await Promise.all(
          trendingMovies.map((m) =>
            axios.get(
              `${BASE_URL}/movie/${m.id}/credits?api_key=${API_KEY}&language=en-US`,
            ),
          ),
        );
        const map = {};
        trendingMovies.forEach((m, i) => {
          map[m.id] = castResults[i].data.cast.slice(0, 3);
        });
        setCastMap(map);
      } catch (e) {
        console.error('HeroBanner fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const goTo = (newIndex) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setIndex(newIndex);
      setTransitioning(false);
    }, 350);
  };

  useEffect(() => {
    if (featured.length === 0) return;
    intervalRef.current = setInterval(
      () => goTo((index + 1) % featured.length),
      6000,
    );
    return () => clearInterval(intervalRef.current);
  }, [featured, index, transitioning]);

  const prev = () => {
    clearInterval(intervalRef.current);
    goTo((index - 1 + featured.length) % featured.length);
  };
  const next = () => {
    clearInterval(intervalRef.current);
    goTo((index + 1) % featured.length);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleUpcomingWatch = (e, movie) => {
    e.stopPropagation();
    isInWatchlist(movie.id)
      ? removeFromWatchlist(movie.id)
      : addToWatchlist(movie, 'upcoming');
  };

  const handleBrowseAll = () => {
    if (onNavigate) onNavigate('comingSoon');
  };

  if (loading) {
    return (
      <div className="w-full bg-[#0a0a0f] h-[560px] flex pt-16">
        <div className="flex-1 bg-gradient-to-br from-purple-900/10 via-purple-800/5 to-[#0a0a0f] animate-pulse" />
        <div className="w-[340px] bg-[#0d0d18] border-l border-purple-900/40 animate-pulse" />
      </div>
    );
  }

  const movie = featured[index];
  if (!movie) return null;

  const cast = castMap[movie.id] || [];
  const genres = (movie.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);
  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.slice(0, 4);

  return (
    <div className="w-full bg-[#0a0a0f] pt-16">
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
      <div
        className="flex flex-row w-full"
        style={{
          height: 'calc(100vh - 64px)',
          maxHeight: '580px',
          minHeight: '480px',
        }}
      >
        {/* ===================== LEFT BANNER ===================== */}
        <div className="flex-1 relative overflow-hidden bg-[#0a0a0f] flex flex-col">
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
          >
            {movie.backdrop_path ? (
              <>
                <img
                  src={IMG_BACKDROP + movie.backdrop_path}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-30 pointer-events-none"
                />
                <img
                  src={IMG_BACKDROP + movie.backdrop_path}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </>
            ) : (
              <ImageOrFallback
                src=""
                alt={movie.title}
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/5 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent z-10" />

          <div className="relative z-20 flex items-start justify-between px-5 pt-4">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-purple-500/30 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-purple-300 text-xs font-semibold uppercase tracking-wider">
                #{index + 1} Trending This Week
              </span>
            </div>
            <div className="flex gap-1.5 items-center">
              {featured.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => goTo(i)}
                  className={`relative rounded-lg overflow-hidden border transition-all duration-200 flex-shrink-0 ${i === index ? 'w-12 h-[68px] border-purple-400 shadow-lg shadow-purple-500/40 scale-105' : 'w-10 h-[58px] border-white/10 opacity-50 hover:opacity-90 hover:border-purple-500/40'}`}
                >
                  <ImageOrFallback
                    src={m.poster_path ? IMG_W + m.poster_path : ''}
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />
                  {i === index && (
                    <div className="absolute inset-0 ring-1 ring-purple-400/60 rounded-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-purple-600/50 border border-white/15 hover:border-purple-500/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-lg hover:scale-110"
          >
            <FiChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-purple-600/50 border border-white/15 hover:border-purple-500/60 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-lg hover:scale-110"
          >
            <FiChevronRight size={22} strokeWidth={2.5} />
          </button>

          <div className="mt-auto relative z-20">
            <div
              className={`px-6 pb-3 transition-all duration-500 ${transitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}
            >
              <div className="flex items-end gap-4">
                <div className="w-[80px] h-[116px] flex-shrink-0 rounded-xl overflow-hidden border border-purple-500/40 shadow-2xl shadow-purple-900/60">
                  <ImageOrFallback
                    src={movie.poster_path ? IMG_W + movie.poster_path : ''}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider"
                      >
                        {g}
                      </span>
                    ))}
                    {year && (
                      <span className="bg-white/10 border border-white/10 text-gray-400 text-[10px] px-2.5 py-0.5 rounded-full">
                        {year}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white leading-tight mb-1 line-clamp-1">
                    {movie.title}
                  </h2>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3 max-w-lg">
                    {movie.overview}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-purple-900/50 transition-all duration-200">
                      <FaPlay size={10} /> Watch Trailer
                    </button>
                    <div className="flex items-center gap-1.5 bg-black/50 border border-yellow-500/20 px-3 py-2 rounded-lg">
                      <AiFillStar className="text-yellow-400" size={13} />
                      <span className="text-yellow-300 text-sm font-bold">
                        {rating}
                      </span>
                      <span className="text-gray-600 text-xs">/ 10</span>
                    </div>
                    {cast.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {cast.map((actor) => (
                            <div
                              key={actor.id}
                              className="w-7 h-7 rounded-full border-2 border-[#0a0a0f] overflow-hidden flex-shrink-0"
                              title={actor.name}
                            >
                              <ImageOrFallback
                                src={
                                  actor.profile_path
                                    ? IMG_SMALL + actor.profile_path
                                    : ''
                                }
                                alt={actor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="text-gray-500 text-xs">
                          {cast.map((a) => a.name.split(' ')[0]).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 py-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${i === index ? 'w-6 h-2 bg-purple-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
            <div className="flex flex-row items-center gap-2 px-5 py-2.5 overflow-x-auto scrollbar-hide bg-gradient-to-t from-black/80 to-transparent">
              {[
                'BAFTA Awards →',
                'Annie Awards Winners →',
                'SXSW Festival Guide →',
                'Black History Month →',
              ].map((chip) => (
                <div
                  key={chip}
                  className="bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 text-white text-xs px-4 py-1.5 rounded-full cursor-pointer whitespace-nowrap transition-all duration-200"
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== RIGHT PANEL ===================== */}
        <div className="w-[340px] flex-shrink-0 bg-[#0d0d18] border-l border-purple-900/40 flex flex-col h-full overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-900/30 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full" />
                <h3 className="text-white font-bold text-base">Coming Soon</h3>
              </div>
              {/* ── BROWSE ALL → navigates to ComingSoonPage ── */}
              <button
                onClick={handleBrowseAll}
                className="text-purple-400 hover:text-purple-300 text-xs cursor-pointer transition-all duration-200 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 px-2.5 py-1 rounded-full"
              >
                Browse all →
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {upcoming.map((m) => {
              const upGenres = (m.genre_ids || [])
                .slice(0, 2)
                .map((id) => GENRE_MAP[id])
                .filter(Boolean);
              const saved = isInWatchlist(m.id);
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3.5 border-b border-purple-900/20 hover:bg-purple-500/5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-[80px] h-[54px] rounded-lg flex-shrink-0 overflow-hidden relative border border-purple-900/30 group-hover:border-purple-500/30 transition-all duration-200">
                    <ImageOrFallback
                      src={
                        m.backdrop_path
                          ? `https://image.tmdb.org/t/p/w300${m.backdrop_path}`
                          : ''
                      }
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-1 right-1 bg-black/80 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-bold z-10 border border-purple-500/30 uppercase tracking-wider">
                      Soon
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="text-white text-sm font-semibold truncate group-hover:text-purple-300 transition-colors duration-200">
                      {m.title}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {upGenres.map((g) => (
                        <span
                          key={g}
                          className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/15"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-500 text-[11px] flex items-center gap-1">
                        <MdCalendarToday size={10} className="text-gray-600" />
                        {formatDate(m.release_date)}
                      </span>
                      {m.vote_average > 0 && (
                        <span className="text-yellow-500/70 text-[11px] flex items-center gap-0.5">
                          <AiFillStar size={10} /> {m.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleUpcomingWatch(e, m)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 opacity-0 group-hover:opacity-100 ${saved ? 'bg-purple-500/30 border-purple-400/50 text-purple-300' : 'bg-black/40 border-white/15 text-white/60 hover:bg-purple-500/30 hover:border-purple-400/50 hover:text-purple-300'}`}
                    title={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    {saved ? (
                      <FaBookmark size={11} />
                    ) : (
                      <FiBookmark size={11} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
