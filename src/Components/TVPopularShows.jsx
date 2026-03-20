import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { useMood } from '../context/MoodContext';
import { useWatchlist } from '../context/WatchlistContext';
import Pagination from './Pagination';

/* ================= IMAGE FALLBACK ================= */
const ImageOrFallback = ({ src, alt, className }) => {
  const [imgError, setImgError] = useState(false);
  if (!src || imgError) {
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
            {Array.from({ length: 80 }).map((_, i) => (
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
          <p className="text-purple-400/60 text-xs uppercase tracking-widest">
            Illustration
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
      onError={() => setImgError(true)}
    />
  );
};

/* ================= API CONFIG ================= */
const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w780';

const TV_GENRE_MAP = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10768: 'War & Politics',
  37: 'Western',
};

const TV_GENRE_COLORS = {
  'Action & Adventure': 'bg-red-500',
  Animation: 'bg-pink-500',
  Comedy: 'bg-yellow-500',
  Crime: 'bg-gray-500',
  Documentary: 'bg-green-600',
  Drama: 'bg-purple-500',
  Family: 'bg-orange-400',
  Kids: 'bg-lime-500',
  Mystery: 'bg-blue-500',
  Reality: 'bg-rose-500',
  'Sci-Fi & Fantasy': 'bg-cyan-500',
  'War & Politics': 'bg-red-900',
  Western: 'bg-amber-700',
};

// Map mood genre IDs to TV genre IDs (best effort)
const MOOD_TO_TV_GENRES = {
  35: 35,
  18: 18,
  27: 10759,
  28: 10759,
  12: 10759,
  10749: 18,
  99: 99,
  36: 18,
};

const PER_PAGE = 10;

const TVPopularShows = () => {
  const [showsByGenre, setShowsByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);
  const [pageByGenre, setPageByGenre] = useState({});

  const { selectedMood } = useMood();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const genreRefs = useRef({});

  const fetchShows = async () => {
    try {
      setLoading(true);
      let allShows = [];

      if (selectedMood) {
        const tvGenres = selectedMood.genres
          .map((id) => MOOD_TO_TV_GENRES[id] || id)
          .filter(Boolean);
        const genreQuery = [...new Set(tvGenres)].join(',');
        const pages = await Promise.all(
          [1, 2, 3].map((p) =>
            axios.get(
              `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&with_genres=${genreQuery}&page=${p}`,
            ),
          ),
        );
        allShows = pages.flatMap((r) => r.data.results);
      } else {
        const pages = await Promise.all(
          [1, 2, 3, 4, 5, 6].map((p) =>
            axios.get(
              `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${p}`,
            ),
          ),
        );
        allShows = pages.flatMap((r) => r.data.results);
      }

      const grouped = {};
      allShows.forEach((show) => {
        const genreId = show.genre_ids?.[0];
        const genre = TV_GENRE_MAP[genreId];
        if (!genre) return;
        if (!grouped[genre]) grouped[genre] = [];
        grouped[genre].push(show);
      });

      Object.keys(grouped).forEach((g) => {
        if (grouped[g].length < 4) delete grouped[g];
        else grouped[g] = grouped[g].slice(0, 40);
      });

      const sorted = Object.fromEntries(
        Object.entries(grouped).sort((a, b) => b[1].length - a[1].length),
      );

      setShowsByGenre(sorted);
      setPageByGenre({});
      setActiveGenre(null);
      setError(null);
    } catch (e) {
      setError('Failed to load TV shows.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, [selectedMood]);

  const toggleWatch = (e, show, genre) => {
    e.stopPropagation();
    isInWatchlist(show.id)
      ? removeFromWatchlist(show.id)
      : addToWatchlist(show, genre, 'tv');
  };

  const scrollRow = (genre, dir) => {
    genreRefs.current[genre]?.scrollBy({
      left: dir === 'left' ? -600 : 600,
      behavior: 'smooth',
    });
  };

  const genres = Object.keys(showsByGenre);

  if (loading)
    return (
      <div className="w-full bg-[#0a0a0f] py-10">
        {[1, 2].map((row) => (
          <div key={row} className="mb-10 px-8">
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[160px] flex-shrink-0">
                  <div className="h-[240px] rounded-xl bg-gradient-to-r from-violet-900/10 via-violet-800/20 to-violet-900/10 animate-pulse" />
                  <div className="h-3 bg-violet-900/20 mt-2 rounded animate-pulse" />
                  <div className="h-2 bg-violet-900/20 mt-1 rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-400">
        {error}
        <button
          onClick={fetchShows}
          className="block mt-4 mx-auto bg-violet-600 px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );

  const displayedGenres = activeGenre ? [activeGenre] : genres;
  const totalShows = Object.values(showsByGenre).flat().length;

  return (
    <div className="w-full bg-[#0a0a0f] py-10 px-0">
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

      {/* HEADER */}
      <div className="px-8 mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1 h-7 bg-violet-500 rounded-full mr-4" />
          <h2 className="text-2xl font-bold text-white">
            {selectedMood
              ? `${selectedMood.name} TV Shows`
              : 'Popular TV Shows'}
          </h2>
          <span className="ml-3 bg-violet-500/15 text-violet-400 text-xs px-2.5 py-1 rounded-full border border-violet-500/20 font-medium">
            {totalShows}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => {
                setActiveGenre(g === activeGenre ? null : g);
                setTimeout(
                  () =>
                    genreRefs.current[g]?.scrollIntoView({
                      behavior: 'smooth',
                    }),
                  50,
                );
              }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium ${activeGenre === g ? 'bg-violet-500 border-violet-500 text-white' : 'border-violet-900/40 text-gray-400 hover:border-violet-500/40 hover:text-white'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* GENRE ROWS */}
      {displayedGenres.map((genre) => {
        const currentPage = pageByGenre[genre] || 1;
        const totalPages = Math.ceil(showsByGenre[genre].length / PER_PAGE);
        const paginatedShows = showsByGenre[genre].slice(
          (currentPage - 1) * PER_PAGE,
          currentPage * PER_PAGE,
        );

        return (
          <div
            key={genre}
            ref={(el) => (genreRefs.current[genre] = el)}
            className="mb-12"
          >
            <div className="px-8 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full mr-3 ${TV_GENRE_COLORS[genre] || 'bg-violet-500'}`}
                />
                <h3 className="text-white text-lg font-bold">{genre}</h3>
                <span className="text-gray-500 text-sm ml-2">
                  {showsByGenre[genre].length}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollRow(genre, 'left')}
                  className="w-8 h-8 rounded-full bg-violet-900/30 hover:bg-violet-500/30 border border-violet-900/40 hover:border-violet-500/40 text-white/60 hover:text-white flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollRow(genre, 'right')}
                  className="w-8 h-8 rounded-full bg-violet-900/30 hover:bg-violet-500/30 border border-violet-900/40 hover:border-violet-500/40 text-white/60 hover:text-white flex items-center justify-center"
                >
                  ›
                </button>
              </div>
            </div>

            <div
              ref={(el) => (genreRefs.current[genre] = el)}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-8 pb-2"
            >
              {paginatedShows.map((show) => {
                const saved = isInWatchlist(show.id);
                const title = show.name || show.title;
                const year = (show.first_air_date || '').slice(0, 4);
                return (
                  <div
                    key={show.id}
                    className="relative w-[160px] flex-shrink-0 group cursor-pointer"
                  >
                    <div className="relative w-full h-[240px] rounded-xl overflow-hidden border border-violet-900/30 group-hover:border-violet-500/40 shadow-md group-hover:shadow-xl">
                      <ImageOrFallback
                        src={
                          show.poster_path ? IMAGE_BASE + show.poster_path : ''
                        }
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-lg">
                        ⭐
                        <span className="text-yellow-400 text-xs font-bold">
                          {show.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleWatch(e, show, genre)}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm border transition-all duration-200 opacity-0 group-hover:opacity-100 ${saved ? 'bg-violet-500/30 border-violet-400/50 text-violet-300' : 'bg-black/60 border-white/20 text-white hover:bg-violet-500/40 hover:border-violet-400/50'}`}
                      >
                        {saved ? (
                          <FaBookmark size={10} />
                        ) : (
                          <FiBookmark size={10} />
                        )}
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-white text-sm font-semibold line-clamp-2 group-hover:text-violet-300">
                        {title}
                      </p>
                      <p className="text-gray-600 text-xs">{year}</p>
                    </div>
                    {/* TOOLTIP */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full w-56 bg-[#13131f] border border-violet-500/25 rounded-2xl p-4 shadow-2xl shadow-violet-900/60 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                      {show.backdrop_path && (
                        <img
                          src={BACKDROP_BASE + show.backdrop_path}
                          className="w-full h-24 rounded-lg object-cover mb-3 border border-violet-900/30"
                        />
                      )}
                      <p className="text-white text-sm font-bold">{title}</p>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                        {show.overview}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(show.genre_ids || []).map(
                          (id) =>
                            TV_GENRE_MAP[id] && (
                              <span
                                key={id}
                                className="bg-violet-500/10 text-violet-400 text-[10px] px-2 py-0.5 rounded-full border border-violet-500/15"
                              >
                                {TV_GENRE_MAP[id]}
                              </span>
                            ),
                        )}
                      </div>
                      <div className="w-full h-1 bg-violet-900/40 rounded-full mt-2">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full"
                          style={{
                            width: `${(show.vote_average / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) =>
                  setPageByGenre((prev) => ({ ...prev, [genre]: p }))
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TVPopularShows;
