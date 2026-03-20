import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { useMood } from '../context/MoodContext';
import { useWatchlist } from '../context/WatchlistContext';
import MoodSelector from './MoodSelector';
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
};

const GENRE_COLORS = {
  Action: 'bg-red-500',
  Adventure: 'bg-orange-500',
  Animation: 'bg-pink-500',
  Comedy: 'bg-yellow-500',
  Crime: 'bg-gray-500',
  Drama: 'bg-purple-500',
  Fantasy: 'bg-indigo-500',
  Horror: 'bg-red-900',
  Mystery: 'bg-blue-500',
  Romance: 'bg-rose-500',
  'Sci-Fi': 'bg-cyan-500',
  Thriller: 'bg-green-500',
};

const PER_PAGE = 10;

const PopularMovies = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGenre, setActiveGenre] = useState(null);
  const [pageByGenre, setPageByGenre] = useState({});

  const { selectedMood } = useMood();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const genreRefs = useRef({});

  const fetchMovies = async () => {
    try {
      setLoading(true);
      let allMovies = [];
      if (selectedMood) {
        const genreQuery = selectedMood.genres.join(',');
        const pages = await Promise.all(
          [1, 2, 3].map((p) =>
            axios.get(
              `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreQuery}&page=${p}`,
            ),
          ),
        );
        allMovies = pages.flatMap((r) => r.data.results);
      } else {
        const pages = await Promise.all(
          [1, 2, 3, 4, 5, 6].map((p) =>
            axios.get(
              `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${p}`,
            ),
          ),
        );
        allMovies = pages.flatMap((r) => r.data.results);
      }

      const grouped = {};
      allMovies.forEach((movie) => {
        const genreId = movie.genre_ids?.[0];
        const genre = GENRE_MAP[genreId];
        if (!genre) return;
        if (!grouped[genre]) grouped[genre] = [];
        grouped[genre].push(movie);
      });

      Object.keys(grouped).forEach((g) => {
        if (grouped[g].length < 4) delete grouped[g];
        else grouped[g] = grouped[g].slice(0, 40);
      });

      const sorted = Object.fromEntries(
        Object.entries(grouped).sort((a, b) => b[1].length - a[1].length),
      );

      setMoviesByGenre(sorted);
      setPageByGenre({});
      setActiveGenre(null);
      setError(null);
    } catch (e) {
      setError('Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedMood]);

  const toggleWatch = (e, movie, genre) => {
    e.stopPropagation();
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie, genre); // pass genre as source
    }
  };

  const scrollRow = (genre, dir) => {
    genreRefs.current[genre]?.scrollBy({
      left: dir === 'left' ? -600 : 600,
      behavior: 'smooth',
    });
  };

  const formatVotes = (v) =>
    v > 1000 ? `${(v / 1000).toFixed(1)}k votes` : `${v} votes`;
  const genres = Object.keys(moviesByGenre);

  if (loading)
    return (
      <div className="w-full bg-[#0a0a0f] py-10">
        {[1, 2].map((row) => (
          <div key={row} className="mb-10 px-8">
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[160px] flex-shrink-0">
                  <div className="h-[240px] rounded-xl bg-gradient-to-r from-purple-900/10 via-purple-800/20 to-purple-900/10 animate-pulse" />
                  <div className="h-3 bg-purple-900/20 mt-2 rounded animate-pulse" />
                  <div className="h-2 bg-purple-900/20 mt-1 rounded w-2/3 animate-pulse" />
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
          onClick={fetchMovies}
          className="block mt-4 mx-auto bg-purple-600 px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );

  const displayedGenres = activeGenre ? [activeGenre] : genres;
  const totalMovies = Object.values(moviesByGenre).flat().length;

  return (
    <div className="w-full bg-[#0a0a0f] py-10 px-0">
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>
      <MoodSelector />

      <div className="px-8 mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-1 h-7 bg-purple-500 rounded-full mr-4" />
          <h2 className="text-2xl font-bold text-white">
            {selectedMood ? `${selectedMood.name} Movies` : 'Popular Movies'}
          </h2>
          <span className="ml-3 bg-purple-500/15 text-purple-400 text-xs px-2.5 py-1 rounded-full border border-purple-500/20 font-medium">
            {totalMovies}
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
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium ${activeGenre === g ? 'bg-purple-500 border-purple-500 text-white' : 'border-purple-900/40 text-gray-400 hover:border-purple-500/40 hover:text-white'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {displayedGenres.map((genre) => {
        const currentPage = pageByGenre[genre] || 1;
        const totalPages = Math.ceil(moviesByGenre[genre].length / PER_PAGE);
        const paginatedMovies = moviesByGenre[genre].slice(
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
                  className={`w-2.5 h-2.5 rounded-full mr-3 ${GENRE_COLORS[genre]}`}
                />
                <h3 className="text-white text-lg font-bold">{genre}</h3>
                <span className="text-gray-500 text-sm ml-2">
                  {moviesByGenre[genre].length}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollRow(genre, 'left')}
                  className="w-8 h-8 rounded-full bg-purple-900/30 hover:bg-purple-500/30 border border-purple-900/40 hover:border-purple-500/40 text-white/60 hover:text-white flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollRow(genre, 'right')}
                  className="w-8 h-8 rounded-full bg-purple-900/30 hover:bg-purple-500/30 border border-purple-900/40 hover:border-purple-500/40 text-white/60 hover:text-white flex items-center justify-center"
                >
                  ›
                </button>
              </div>
            </div>

            <div
              ref={(el) => (genreRefs.current[genre] = el)}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-8 pb-2"
            >
              {paginatedMovies.map((movie) => {
                const saved = isInWatchlist(movie.id);
                return (
                  <div
                    key={movie.id}
                    className="relative w-[160px] flex-shrink-0 group cursor-pointer"
                  >
                    <div className="relative w-full h-[240px] rounded-xl overflow-hidden border border-purple-900/30 group-hover:border-purple-500/40 shadow-md group-hover:shadow-xl">
                      <ImageOrFallback
                        src={
                          movie.poster_path
                            ? IMAGE_BASE + movie.poster_path
                            : ''
                        }
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-lg">
                        ⭐
                        <span className="text-yellow-400 text-xs font-bold">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      {/* WATCHLIST BUTTON */}
                      <button
                        onClick={(e) => toggleWatch(e, movie, genre)}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm border transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                          saved
                            ? 'bg-purple-500/30 border-purple-400/50 text-purple-300'
                            : 'bg-black/60 border-white/20 text-white hover:bg-purple-500/40 hover:border-purple-400/50'
                        }`}
                        title={
                          saved ? 'Remove from Watchlist' : 'Add to Watchlist'
                        }
                      >
                        {saved ? (
                          <FaBookmark size={10} />
                        ) : (
                          <FiBookmark size={10} />
                        )}
                      </button>
                    </div>
                    <div className="mt-2">
                      <p className="text-white text-sm font-semibold line-clamp-2 group-hover:text-purple-300">
                        {movie.title}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {movie.release_date?.slice(0, 4)}
                      </p>
                      <p className="text-gray-700 text-xs">
                        ({formatVotes(movie.vote_count)})
                      </p>
                    </div>
                    {/* TOOLTIP */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full w-56 bg-[#13131f] border border-purple-500/25 rounded-2xl p-4 shadow-2xl shadow-purple-900/60 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                      {movie.backdrop_path && (
                        <img
                          src={BACKDROP_BASE + movie.backdrop_path}
                          className="w-full h-24 rounded-lg object-cover mb-3 border border-purple-900/30"
                        />
                      )}
                      <p className="text-white text-sm font-bold">
                        {movie.title}
                      </p>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                        {movie.overview}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.genre_ids.map((id) => (
                          <span
                            key={id}
                            className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/15"
                          >
                            {GENRE_MAP[id]}
                          </span>
                        ))}
                      </div>
                      <div className="w-full h-1 bg-purple-900/40 rounded-full mt-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-full rounded-full"
                          style={{
                            width: `${(movie.vote_average / 10) * 100}%`,
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

export default PopularMovies;
