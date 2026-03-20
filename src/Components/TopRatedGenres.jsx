import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiBookmark, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
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
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
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
                className="text-purple-400 text-xs font-mono whitespace-nowrap px-2 py-1"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <p className="text-purple-400/50 text-[10px] uppercase tracking-widest relative z-10">
          N/A
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

const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_W = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w780';

const MOVIE_GENRE_MAP = {
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

const TV_GENRE_MAP = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  18: 'Drama',
  10751: 'Family',
  9648: 'Mystery',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10768: 'War & Politics',
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
  Thriller: 'bg-green-600',
  'Action & Adventure': 'bg-red-500',
  Family: 'bg-orange-400',
  Reality: 'bg-pink-600',
  'Sci-Fi & Fantasy': 'bg-cyan-600',
  'War & Politics': 'bg-red-900',
};

const TopRatedGenres = ({ mediaType }) => {
  const [byGenre, setByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);
  const genreRefs = useRef({});
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchByGenre = async () => {
      setLoading(true);
      try {
        const GENRE_MAP = mediaType === 'tv' ? TV_GENRE_MAP : MOVIE_GENRE_MAP;
        const endpoint =
          mediaType === 'tv'
            ? `${BASE_URL}/tv/top_rated`
            : `${BASE_URL}/movie/top_rated`;

        const pages = await Promise.all(
          [1, 2, 3, 4, 5].map((p) =>
            axios.get(
              `${endpoint}?api_key=${API_KEY}&language=en-US&page=${p}`,
            ),
          ),
        );
        const all = pages.flatMap((r) => r.data.results);

        const grouped = {};
        all.forEach((item) => {
          const genreId = item.genre_ids?.[0];
          const genre = GENRE_MAP[genreId];
          if (!genre) return;
          if (!grouped[genre]) grouped[genre] = [];
          if (grouped[genre].length < 20) grouped[genre].push(item);
        });

        Object.keys(grouped).forEach((g) => {
          if (grouped[g].length < 3) delete grouped[g];
        });

        const sorted = Object.fromEntries(
          Object.entries(grouped).sort((a, b) => b[1].length - a[1].length),
        );
        setByGenre(sorted);
      } catch (e) {
        console.error('TopRatedGenres fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchByGenre();
  }, [mediaType]);

  const scrollRow = (genre, dir) => {
    genreRefs.current[genre]?.scrollBy({
      left: dir === 'left' ? -560 : 560,
      behavior: 'smooth',
    });
  };

  const genres = Object.keys(byGenre);
  const displayedGenres = activeGenre ? [activeGenre] : genres;

  if (loading) {
    return (
      <div className="w-full px-10 py-8">
        {[1, 2].map((row) => (
          <div key={row} className="mb-10">
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[160px] flex-shrink-0">
                  <div className="h-[240px] rounded-xl bg-purple-900/10 animate-pulse" />
                  <div className="h-3 bg-purple-900/10 mt-2 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-0">
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

      {/* SECTION HEADER */}
      <div className="px-10 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">Top Rated by Genre</h2>
        </div>
        {/* GENRE FILTER CHIPS */}
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
                      block: 'nearest',
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

      {/* GENRE ROWS */}
      {displayedGenres.map((genre) => (
        <div
          key={genre}
          ref={(el) => (genreRefs.current[genre] = el)}
          className="mb-12"
        >
          {/* ROW HEADER */}
          <div className="px-10 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${GENRE_COLORS[genre] || 'bg-purple-500'}`}
              />
              <h3 className="text-white text-lg font-bold">{genre}</h3>
              <span className="text-gray-600 text-sm ml-1">
                {byGenre[genre].length}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollRow(genre, 'left')}
                className="w-8 h-8 rounded-full bg-purple-900/30 hover:bg-purple-500/30 border border-purple-900/40 hover:border-purple-500/40 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollRow(genre, 'right')}
                className="w-8 h-8 rounded-full bg-purple-900/30 hover:bg-purple-500/30 border border-purple-900/40 hover:border-purple-500/40 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* SCROLL ROW */}
          <div
            ref={(el) => (genreRefs.current[genre] = el)}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-10 pb-2"
          >
            {byGenre[genre].map((item, idx) => {
              const title = item.title || item.name;
              const year = (
                item.release_date ||
                item.first_air_date ||
                ''
              ).slice(0, 4);
              const saved = isInWatchlist(item.id);

              return (
                <div
                  key={item.id}
                  className="relative w-[160px] flex-shrink-0 group cursor-pointer"
                >
                  {/* RANK BADGE */}
                  <div className="absolute -top-2 -left-2 z-20 w-6 h-6 rounded-full bg-black/80 border border-purple-500/40 flex items-center justify-center">
                    <span className="text-purple-400 text-[10px] font-black">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="relative w-full h-[240px] rounded-xl overflow-hidden border border-purple-900/30 group-hover:border-purple-500/40 shadow-md group-hover:shadow-xl transition-all duration-300">
                    <ImageOrFallback
                      src={item.poster_path ? IMG_W + item.poster_path : ''}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* RATING */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-lg">
                      <AiFillStar className="text-yellow-400" size={10} />
                      <span className="text-yellow-400 text-xs font-bold">
                        {item.vote_average?.toFixed(1)}
                      </span>
                    </div>

                    {/* WATCHLIST */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saved
                          ? removeFromWatchlist(item.id)
                          : addToWatchlist(item, 'top_rated_genre', mediaType);
                      }}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 opacity-0 group-hover:opacity-100 ${saved ? 'bg-purple-500/30 border-purple-400/50 text-purple-300' : 'bg-black/60 border-white/20 text-white hover:bg-purple-500/40'}`}
                    >
                      {saved ? (
                        <FaBookmark size={10} />
                      ) : (
                        <FiBookmark size={10} />
                      )}
                    </button>

                    {/* HOVER TOOLTIP */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full w-52 bg-[#13131f] border border-purple-500/25 rounded-2xl p-3 shadow-2xl shadow-purple-900/60 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                      {item.backdrop_path && (
                        <img
                          src={BACKDROP_BASE + item.backdrop_path}
                          className="w-full h-20 rounded-lg object-cover mb-2 border border-purple-900/30"
                        />
                      )}
                      <p className="text-white text-sm font-bold line-clamp-1">
                        {title}
                      </p>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-3">
                        {item.overview}
                      </p>
                      <div className="w-full h-1 bg-purple-900/40 rounded-full mt-2">
                        <div
                          className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full"
                          style={{
                            width: `${(item.vote_average / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-white text-sm font-semibold line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {title}
                    </p>
                    <p className="text-gray-600 text-xs">{year}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopRatedGenres;
