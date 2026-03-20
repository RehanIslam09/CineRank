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

const TVPopularCelebrities = () => {
  const scrollRef = useRef(null);
  const [likedIds, setLikedIds] = useState(new Set());
  const [atStart, setAtStart] = useState(true);
  const [topRising, setTopRising] = useState([]);
  const [byRanking, setByRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        // Fetch people known for TV — filter by known_for_department
        const res = await axios.get(
          `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=1`,
        );
        // Filter to people who are known for Acting and appear in TV shows
        const tvPeople = res.data.results
          .filter((p) => p.known_for?.some((k) => k.media_type === 'tv'))
          .slice(0, 8);

        const sorted = [...tvPeople].sort(
          (a, b) => b.popularity - a.popularity,
        );
        setTopRising(sorted.slice(0, 2));
        setByRanking(tvPeople.slice(2, 8));
      } catch (e) {
        console.error('TVPopularCelebrities fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCelebrities();
  }, []);

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

  const getChange = (person, isRising) => {
    if (isRising) return Math.round(person.popularity * 10);
    return Math.round(person.popularity);
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

  const Card = ({ celeb, rank, isRising }) => (
    <div className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0 w-[150px]">
      <div className="relative w-[130px] h-[130px] rounded-full p-[2.5px] bg-gradient-to-br from-violet-600/0 to-violet-600/0 group-hover:from-violet-500 group-hover:to-purple-500 transition-all duration-300 group-hover:scale-105">
        <div className="w-full h-full rounded-full overflow-hidden border-[2.5px] border-violet-800/50 group-hover:border-transparent transition-all duration-300">
          <ImageOrFallback
            src={celeb.profile_path ? IMG_PROFILE + celeb.profile_path : ''}
            alt={celeb.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(celeb.id);
          }}
          className={`absolute bottom-2 left-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm border flex items-center justify-center text-base transition-all duration-200 ${likedIds.has(celeb.id) ? 'text-red-400 border-red-400/40' : 'text-white/50 border-white/15 hover:text-red-400 hover:border-red-400/40'}`}
        >
          {likedIds.has(celeb.id) ? '♥' : '♡'}
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-1 min-w-full text-center">
        <span className="text-white font-black text-base">{rank}</span>
        <ChangeIndicator value={getChange(celeb, isRising)} />
      </div>

      <p className="text-white text-sm font-semibold text-center leading-snug mt-0.5 group-hover:text-violet-300 transition-colors duration-200 w-full line-clamp-2">
        {celeb.name}
      </p>

      {/* Show what TV show they're known for */}
      <p className="text-gray-600 text-xs text-center mt-0.5 tracking-wide line-clamp-1">
        {celeb.known_for?.find((k) => k.media_type === 'tv')?.name ||
          celeb.known_for_department ||
          'Actor'}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full bg-[#0a0a0f] py-10 px-8">
        <div className="flex gap-8 overflow-hidden pb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 w-[150px] flex-shrink-0"
            >
              <div className="w-[130px] h-[130px] rounded-full bg-gradient-to-br from-violet-900/20 via-violet-800/10 to-violet-900/20 animate-pulse" />
              <div className="h-3 w-20 bg-violet-900/20 rounded animate-pulse" />
              <div className="h-3 w-24 bg-violet-900/20 rounded animate-pulse" />
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
          <div className="w-1 h-7 rounded-full bg-violet-500 mr-4" />
          <h2 className="text-2xl font-bold text-white">
            Popular TV Celebrities
          </h2>
          <span className="text-violet-400 hover:text-violet-300 cursor-pointer ml-2 transition-colors duration-200">
            ›
          </span>
        </div>
        <button className="text-violet-400 hover:text-violet-300 text-sm transition-colors duration-200">
          See all →
        </button>
      </div>

      {/* LEFT ARROW */}
      {!atStart && (
        <div
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-[160px] bg-gradient-to-r from-[#0a0a0f] to-transparent flex items-center justify-start pl-1 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#1a1a2e] border border-violet-500/30 hover:border-violet-400/60 hover:bg-violet-600/20 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110">
            <FiChevronLeft size={20} strokeWidth={2.5} />
          </div>
        </div>
      )}

      {/* RIGHT ARROW */}
      <div
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-[160px] bg-gradient-to-l from-[#0a0a0f] to-transparent flex items-center justify-end pr-1 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-[#1a1a2e] border border-violet-500/30 hover:border-violet-400/60 hover:bg-violet-600/20 text-white/60 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110">
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
        <div className="w-px min-h-[200px] bg-gradient-to-b from-transparent via-violet-800/50 to-transparent mx-8 mt-8 self-stretch flex-shrink-0" />

        {/* BY RANKING */}
        <div className="flex flex-col min-w-fit">
          <p className="text-xs font-black tracking-[0.25em] uppercase text-violet-400 pl-2 mb-6">
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

export default TVPopularCelebrities;
