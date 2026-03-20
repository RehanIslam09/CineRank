import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
            {Array.from({ length: 120 }).map((_, i) => (
              <span
                key={i}
                className="text-purple-400 text-[9px] font-mono whitespace-nowrap px-2 py-1"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-center">
          <p className="text-purple-400/50 text-[10px] font-semibold tracking-widest uppercase">
            Illustration
          </p>
          <p className="text-purple-300/30 text-[9px] tracking-widest mt-0.5">
            Not Available
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

/* ================= API CONFIG ================= */

const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_PROFILE = 'https://image.tmdb.org/t/p/w185';

/* ================= COMPONENT ================= */

const PopularCelebrities = () => {
  const scrollRef = useRef(null);
  const [likedIds, setLikedIds] = useState(new Set());
  const [atStart, setAtStart] = useState(true);
  const [topRising, setTopRising] = useState([]);
  const [byRanking, setByRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=1`,
        );

        const people = res.data.results.slice(0, 8);

        // TOP RISING — top 2 by popularity score (highest popularity = most trending)
        const sorted = [...people].sort((a, b) => b.popularity - a.popularity);
        setTopRising(sorted.slice(0, 2));

        // BY RANKING — next 6 in original popularity rank order
        setByRanking(people.slice(2, 8));
      } catch (e) {
        console.error('PopularCelebrities fetch error', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrities();
  }, []);

  /* ================= SCROLL ================= */

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setAtStart(el.scrollLeft <= 5);
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLike = (id) => {
    const newSet = new Set(likedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setLikedIds(newSet);
  };

  /* ================= CHANGE INDICATOR ================= */

  // Derive a "change" value from popularity score for display
  // Top rising get big positive numbers, by ranking get moderate ones
  const getChange = (person, isRising) => {
    if (isRising) return Math.round(person.popularity * 10);
    const change = Math.round(person.popularity);
    return change > 0 ? change : 0;
  };

  const ChangeIndicator = ({ value }) => {
    if (value > 0)
      return (
        <div className="flex items-center gap-0.5">
          <span className="text-green-400 text-[10px]">▲</span>
          <span className="text-green-400 text-xs font-semibold">
            ({value.toLocaleString()})
          </span>
        </div>
      );
    return <span className="text-gray-500 text-xs font-semibold">(—)</span>;
  };

  /* ================= CARD ================= */

  const Card = ({ celeb, rank, isRising }) => (
    <div className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0 w-[150px]">
      {/* PORTRAIT */}
      <div className="relative w-[130px] h-[130px] rounded-full p-[2.5px] bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-500 group-hover:to-fuchsia-500 transition-all duration-300 group-hover:scale-105">
        <div className="w-full h-full rounded-full overflow-hidden border-[2.5px] border-purple-800/50 group-hover:border-transparent transition-all duration-300">
          <ImageOrFallback
            src={celeb.profile_path ? IMG_PROFILE + celeb.profile_path : ''}
            alt={celeb.name}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* HEART BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(celeb.id);
          }}
          className={`absolute bottom-2 left-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm border flex items-center justify-center text-base transition-all duration-200
          ${
            likedIds.has(celeb.id)
              ? 'text-red-400 border-red-400/40'
              : 'text-white/50 border-white/15 hover:text-red-400 hover:border-red-400/40'
          }`}
        >
          {likedIds.has(celeb.id) ? '♥' : '♡'}
        </button>
      </div>

      {/* RANK + CHANGE */}
      <div className="flex items-center justify-center gap-1.5 mt-1 min-w-full text-center">
        <span className="text-white font-black text-base">{rank}</span>
        <ChangeIndicator value={getChange(celeb, isRising)} />
      </div>

      {/* NAME */}
      <p className="text-white text-sm font-semibold text-center leading-snug mt-0.5 group-hover:text-purple-300 transition-colors duration-200 w-full line-clamp-2">
        {celeb.name}
      </p>

      {/* KNOWN FOR */}
      <p className="text-gray-600 text-xs text-center mt-0.5 tracking-wide">
        {celeb.known_for_department || 'Actor'}
      </p>
    </div>
  );

  /* ================= LOADING SKELETON ================= */

  if (loading) {
    return (
      <div className="w-full bg-[#0a0a0f] py-10 px-8">
        <div className="flex gap-8 overflow-hidden pb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 w-[150px] flex-shrink-0"
            >
              <div className="w-[130px] h-[130px] rounded-full bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-900/20 animate-pulse" />
              <div className="h-3 w-20 bg-purple-900/20 rounded animate-pulse" />
              <div className="h-3 w-24 bg-purple-900/20 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0a0a0f] py-10 px-8 relative">
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}`}</style>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-1 h-7 rounded-full bg-purple-500 mr-4" />
          <h2 className="text-2xl font-bold text-white">
            Most Popular Celebrities
          </h2>
          <span className="text-purple-400 hover:text-purple-300 cursor-pointer ml-2 transition-colors duration-200">
            ›
          </span>
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200">
          See all →
        </button>
      </div>

      {/* LEFT ARROW */}
      {!atStart && (
        <div
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-[160px] bg-gradient-to-r from-[#0a0a0f] to-transparent flex items-center justify-start pl-1 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#1a1a2e] border border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-600/20 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110">
            <FiChevronLeft size={20} strokeWidth={2.5} />
          </div>
        </div>
      )}

      {/* RIGHT ARROW */}
      <div
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-[160px] bg-gradient-to-l from-[#0a0a0f] to-transparent flex items-center justify-end pr-1 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-[#1a1a2e] border border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-600/20 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110">
          <FiChevronRight size={20} strokeWidth={2.5} />
        </div>
      </div>

      {/* SCROLL ROW */}
      <div
        ref={scrollRef}
        className="flex flex-row items-start gap-0 overflow-x-auto scrollbar-hide pb-6 px-2"
      >
        {/* TOP RISING */}
        <div className="flex flex-col min-w-fit">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-yellow-500 pl-2 mb-6">
            TOP RISING
          </p>
          <div className="flex flex-row gap-8">
            {topRising.map((c, i) => (
              <Card key={c.id} celeb={c} rank={i + 1} isRising={true} />
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-px min-h-[200px] bg-gradient-to-b from-transparent via-purple-800/50 to-transparent mx-8 mt-8 self-stretch flex-shrink-0" />

        {/* BY RANKING */}
        <div className="flex flex-col min-w-fit">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-purple-400 pl-2 mb-6">
            BY RANKING
          </p>
          <div className="flex flex-row gap-8">
            {byRanking.map((c, i) => (
              <Card key={c.id} celeb={c} rank={i + 3} isRising={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularCelebrities;
