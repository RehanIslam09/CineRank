import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  FiMessageSquare,
  FiThumbsUp,
  FiThumbsDown,
  FiStar,
  FiX,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiEdit3,
  FiHeart,
  FiBookmark,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiFilm,
  FiClock,
  FiCheck,
} from 'react-icons/fi';
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaFire,
  FaQuoteLeft,
  FaHeart,
  FaTrophy,
} from 'react-icons/fa';
import { AiFillStar } from 'react-icons/ai';
import { useWatchlist } from '../context/WatchlistContext';

/* ─────────────────────────────────────────────
   API
───────────────────────────────────────────── */
const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE = 'https://api.themoviedb.org/3';
const W500 = 'https://image.tmdb.org/t/p/w500';
const ORIG = 'https://image.tmdb.org/t/p/original';
const W300 = 'https://image.tmdb.org/t/p/w300';
const W185 = 'https://image.tmdb.org/t/p/w185';

const get = (path, params = {}) =>
  axios.get(`${BASE}${path}`, {
    params: { api_key: API_KEY, language: 'en-US', ...params },
  });

/* ─────────────────────────────────────────────
   IMAGE FALLBACK
───────────────────────────────────────────── */
const ImageOrFallback = ({ src, alt, className }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className={`${className} relative overflow-hidden bg-[#1a1410] flex items-center justify-center`}
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
                className="text-emerald-600 text-xs font-mono whitespace-nowrap px-3 py-2"
              >
                Illustration Not Available •
              </span>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-emerald-700/50 text-[9px] uppercase tracking-widest">
          No Image
        </p>
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

/* ─────────────────────────────────────────────
   CONSTANTS — fictional community members
───────────────────────────────────────────── */
const MEMBERS = [
  {
    id: 1,
    name: 'Mara Voss',
    handle: '@maravoss',
    avatar: '🎬',
    color: 'from-violet-500 to-purple-600',
    reviews: 847,
    followers: 12400,
    badge: 'Critic',
    bio: 'French cinema obsessive. Truffaut or nothing.',
  },
  {
    id: 2,
    name: 'Jin Park',
    handle: '@jinwatches',
    avatar: '🎭',
    color: 'from-emerald-500 to-teal-600',
    reviews: 1203,
    followers: 8900,
    badge: 'Enthusiast',
    bio: 'Horror & A24 films. Jump scares are lazy.',
  },
  {
    id: 3,
    name: 'Dia Santos',
    handle: '@diasays',
    avatar: '✨',
    color: 'from-rose-500 to-pink-600',
    reviews: 521,
    followers: 21000,
    badge: 'Top Writer',
    bio: 'Screenwriter by day, reviewer by night.',
  },
  {
    id: 4,
    name: 'Luca Ferri',
    handle: '@lucaferri',
    avatar: '🍿',
    color: 'from-amber-500 to-orange-600',
    reviews: 334,
    followers: 4200,
    badge: 'Rising',
    bio: 'Italian neorealism & popcorn blockbusters equally.',
  },
  {
    id: 5,
    name: 'Asha Mehta',
    handle: '@ashareviews',
    avatar: '🎞',
    color: 'from-cyan-500 to-blue-600',
    reviews: 678,
    followers: 9800,
    badge: 'Veteran',
    bio: 'Bollywood & world cinema. Every frame tells a story.',
  },
  {
    id: 6,
    name: 'Cole Wright',
    handle: '@coledoesfilm',
    avatar: '🎥',
    color: 'from-fuchsia-500 to-violet-600',
    reviews: 290,
    followers: 3300,
    badge: 'New Voice',
    bio: 'Film student. Still learning. Always watching.',
  },
];

const DEBATE_TAKES = [
  {
    id: 1,
    take: 'Nolan is overrated and Inception is mid.',
    votes: { up: 234, down: 891 },
    spicy: true,
  },
  {
    id: 2,
    take: 'The Shawshank Redemption is the perfect film.',
    votes: { up: 1204, down: 88 },
    spicy: false,
  },
  {
    id: 3,
    take: 'CGI has completely ruined modern blockbusters.',
    votes: { up: 567, down: 423 },
    spicy: true,
  },
  {
    id: 4,
    take: 'Subtitles > dubbing. No exceptions, ever.',
    votes: { up: 934, down: 210 },
    spicy: false,
  },
  {
    id: 5,
    take: 'The last 20 minutes of Avengers: Endgame is cinema.',
    votes: { up: 712, down: 389 },
    spicy: true,
  },
];

const REVIEW_TEMPLATES = [
  {
    rating: 5,
    text: 'An absolute masterwork. Every frame is meticulously crafted — the cinematography alone deserves awards. This is the kind of cinema that reminds you why the medium exists.',
    mood: 'loved it',
  },
  {
    rating: 4,
    text: "Genuinely impressive filmmaking with a few rough edges. The lead performance carries the whole thing. I'd happily sit through this again on a rainy Sunday.",
    mood: 'really liked it',
  },
  {
    rating: 3,
    text: "Solid enough but never quite reaches the heights it's clearly aiming for. The first act is excellent; the third act is a mess. Worth seeing once.",
    mood: 'liked it',
  },
  {
    rating: 2,
    text: 'Frustrating. You can see the bones of a great film beneath all the studio interference. The original vision must have been something special.',
    mood: 'it was ok',
  },
  {
    rating: 5,
    text: "I cried three times. I'm not ashamed. Perfect pacing, perfect score, perfect ending. My film of the year — maybe my film of the decade.",
    mood: 'loved it',
  },
  {
    rating: 4,
    text: "Dense and demanding but rewards patience. I'll be thinking about the final image for a long time. Needs a second viewing to fully appreciate.",
    mood: 'really liked it',
  },
];

const POLL_OPTIONS = [
  { id: 'a', label: 'Practical effects always win' },
  { id: 'b', label: 'CGI when done right is incredible' },
  { id: 'c', label: 'Depends entirely on the film' },
  { id: 'd', label: 'Stop arguing and enjoy movies' },
];

/* ─────────────────────────────────────────────
   SHIMMER
───────────────────────────────────────────── */
const Shimmer = ({ className }) => (
  <div
    className={`${className} bg-gradient-to-r from-emerald-900/10 via-teal-700/12 to-emerald-900/10 animate-pulse rounded-2xl`}
  />
);

/* ─────────────────────────────────────────────
   STAR RATING DISPLAY
───────────────────────────────────────────── */
const StarDisplay = ({ rating, max = 5, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => {
      const filled = i < Math.floor(rating);
      const half = !filled && i < rating;
      const Icon = filled ? FaStar : half ? FaStarHalfAlt : FaRegStar;
      return (
        <Icon
          key={i}
          size={size}
          className={filled || half ? 'text-emerald-400' : 'text-gray-700'}
        />
      );
    })}
  </div>
);

/* ─────────────────────────────────────────────
   STAR PICKER  (interactive)
───────────────────────────────────────────── */
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i + 1)}
          className="transition-transform duration-100 hover:scale-125"
        >
          {(hovered || value) > i ? (
            <FaStar size={22} className="text-emerald-400" />
          ) : (
            <FaRegStar size={22} className="text-gray-600" />
          )}
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-emerald-400 text-sm font-bold">
          {['', 'Dreadful', 'Poor', 'Decent', 'Great', 'Masterpiece'][value]}
        </span>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   AVATAR BUBBLE
───────────────────────────────────────────── */
const Avatar = ({ member, size = 'md' }) => {
  const s = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  };
  return (
    <div
      className={`${s[size]} rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center font-bold flex-shrink-0 shadow-lg`}
    >
      {member.avatar}
    </div>
  );
};

/* ─────────────────────────────────────────────
   FILM GRAIN OVERLAY  (CSS)
───────────────────────────────────────────── */
const GrainOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px',
    }}
  />
);

/* ─────────────────────────────────────────────
   REVIEW CARD
───────────────────────────────────────────── */
const ReviewCard = ({ movie, member, template, index }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    Math.floor(Math.random() * 180) + 20,
  );
  const [saved, setSaved] = useState(false);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const timeAgo = ['2h ago', '5h ago', '1d ago', '2d ago', '3d ago', '1w ago'][
    index % 6
  ];

  return (
    <article className="group relative rounded-3xl overflow-hidden border border-white/6 hover:border-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/15 bg-[#0e0c09]">
      {/* Backdrop bleed */}
      {movie?.backdrop_path && (
        <div className="absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none">
          <img
            src={W300 + movie.backdrop_path}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c09] via-[#0e0c09]/60 to-[#0e0c09]/30" />
        </div>
      )}

      <div className="relative z-10 p-5">
        {/* Top row: movie + member */}
        <div className="flex items-start gap-3 mb-4">
          {/* Poster */}
          <div className="w-[48px] h-[70px] rounded-xl overflow-hidden border border-white/10 flex-shrink-0 shadow-lg">
            <ImageOrFallback
              src={movie?.poster_path ? W185 + movie.poster_path : ''}
              alt={movie?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Movie + reviewer */}
          <div className="flex-1 min-w-0">
            <h4
              className="text-white font-bold text-sm leading-tight line-clamp-1 group-hover:text-emerald-300 transition-colors duration-200"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {movie?.title || 'Untitled'}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <StarDisplay rating={template.rating} />
              <span className="text-emerald-500/70 text-[10px] font-semibold ml-0.5">
                {template.rating}.0
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Avatar member={member} size="sm" />
              <span className="text-gray-500 text-[11px]">{member.name}</span>
              <span className="text-gray-700 text-[9px]">·</span>
              <span className="text-gray-700 text-[10px]">{timeAgo}</span>
            </div>
          </div>

          {/* Mood tag */}
          <span className="flex-shrink-0 text-[9px] px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/8 text-emerald-400 font-semibold uppercase tracking-wider">
            {template.mood}
          </span>
        </div>

        {/* Quote */}
        <blockquote className="relative pl-4 mb-4">
          <FaQuoteLeft
            size={12}
            className="absolute left-0 top-0 text-emerald-600/40"
          />
          <p
            className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {template.text}
          </p>
        </blockquote>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 text-xs transition-all duration-200 ${liked ? 'text-rose-400' : 'text-gray-600 hover:text-rose-400'}`}
            >
              {liked ? <FaHeart size={12} /> : <FiHeart size={12} />}
              <span className="font-semibold">{likeCount}</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-400 text-xs transition-colors duration-200">
              <FiMessageSquare size={12} />
              <span>{Math.floor(Math.random() * 30) + 2}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaved((v) => !v)}
              className={`transition-colors duration-200 ${saved ? 'text-emerald-400' : 'text-gray-700 hover:text-emerald-400'}`}
            >
              <FiBookmark size={13} />
            </button>
            <span className="text-gray-700 text-[10px]">
              {movie?.vote_average > 0 && (
                <span className="flex items-center gap-1">
                  <AiFillStar className="text-yellow-500/50" size={9} />
                  {movie.vote_average?.toFixed(1)}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────
   DEBATE CARD
───────────────────────────────────────────── */
const DebateCard = ({ debate, movie }) => {
  const [votes, setVotes] = useState(debate.votes);
  const [myVote, setMyVote] = useState(null); // 'up' | 'down' | null

  const vote = (dir) => {
    if (myVote === dir) {
      setVotes(debate.votes);
      setMyVote(null);
      return;
    }
    setVotes({
      up: debate.votes.up + (dir === 'up' ? 1 : myVote === 'up' ? -1 : 0),
      down:
        debate.votes.down + (dir === 'down' ? 1 : myVote === 'down' ? -1 : 0),
    });
    setMyVote(dir);
  };

  const total = votes.up + votes.down;
  const upPct = total > 0 ? Math.round((votes.up / total) * 100) : 50;

  return (
    <div className="group rounded-2xl border border-white/6 hover:border-emerald-500/20 bg-[#0e0c09] p-4 transition-all duration-200 hover:bg-emerald-500/3">
      {/* Spicy indicator */}
      {debate.spicy && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] text-orange-400/80 uppercase tracking-widest font-bold flex items-center gap-1">
            🌶 Hot Take
          </span>
        </div>
      )}

      {/* Take text */}
      <p
        className="text-white/90 text-sm font-semibold leading-snug mb-3"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        "{debate.take}"
      </p>

      {/* Movie context */}
      {movie && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-8 rounded overflow-hidden border border-white/8 flex-shrink-0">
            <ImageOrFallback
              src={movie.poster_path ? W185 + movie.poster_path : ''}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-gray-600 text-[10px]">re: {movie.title}</span>
        </div>
      )}

      {/* Vote bar */}
      <div className="mb-3">
        <div className="flex h-1.5 rounded-full overflow-hidden bg-white/6 mb-1.5">
          <div
            className="bg-emerald-500 transition-all duration-500 rounded-l-full"
            style={{ width: `${upPct}%` }}
          />
          <div className="bg-rose-500 flex-1 rounded-r-full" />
        </div>
        <div className="flex justify-between text-[9px] text-gray-600">
          <span>{upPct}% agree</span>
          <span>{100 - upPct}% disagree</span>
        </div>
      </div>

      {/* Vote buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => vote('up')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${myVote === 'up' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/4 border-white/8 text-gray-500 hover:bg-emerald-500/10 hover:border-emerald-500/25 hover:text-emerald-400'}`}
        >
          <FiChevronUp size={13} /> {votes.up.toLocaleString()}
        </button>
        <button
          onClick={() => vote('down')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${myVote === 'down' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-white/4 border-white/8 text-gray-500 hover:bg-rose-500/10 hover:border-rose-500/25 hover:text-rose-400'}`}
        >
          <FiChevronDown size={13} /> {votes.down.toLocaleString()}
        </button>
        <span className="text-gray-700 text-[10px] ml-auto">
          {total.toLocaleString()} votes
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   COMMUNITY WATCHLIST CARD
───────────────────────────────────────────── */
const CommunityList = ({ title, member, movies, emoji }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? movies : movies.slice(0, 3);

  return (
    <div className="rounded-2xl border border-white/6 hover:border-emerald-500/20 bg-[#0e0c09] overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-start gap-3">
          <Avatar member={member} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none">{emoji}</span>
              <h4
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {title}
              </h4>
            </div>
            <p className="text-gray-600 text-[10px] mt-0.5">
              {member.name} · {movies.length} films
            </p>
          </div>
          <span className="text-gray-700 text-[10px] flex items-center gap-1">
            <FiHeart size={9} /> {Math.floor(Math.random() * 400) + 50}
          </span>
        </div>
      </div>

      {/* Film strip */}
      <div className="p-3 space-y-2">
        {shown.map((m, i) => {
          const saved = isInWatchlist(m.id);
          return (
            <div
              key={m.id}
              className="group/item flex items-center gap-3 py-1.5 rounded-lg hover:bg-white/3 px-1 transition-all duration-150"
            >
              <span className="text-gray-700 text-xs font-black w-4 text-center">
                {i + 1}
              </span>
              <div className="w-8 h-11 rounded overflow-hidden border border-white/8 flex-shrink-0">
                <ImageOrFallback
                  src={m.poster_path ? W185 + m.poster_path : ''}
                  alt={m.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-xs font-semibold line-clamp-1">
                  {m.title}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <AiFillStar className="text-yellow-500/60" size={8} />
                  <span className="text-gray-600 text-[9px]">
                    {m.vote_average?.toFixed(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  saved
                    ? removeFromWatchlist(m.id)
                    : addToWatchlist(m, 'community', 'movie')
                }
                className={`opacity-0 group/item-hover:opacity-100 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 flex-shrink-0 group-hover/item:opacity-100 ${saved ? 'bg-emerald-500/20 border-emerald-500/35 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-600 hover:text-emerald-400 hover:border-emerald-500/30'}`}
              >
                <FiBookmark size={9} />
              </button>
            </div>
          );
        })}
      </div>

      {movies.length > 3 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full py-2.5 text-gray-600 hover:text-emerald-400 text-[11px] font-semibold border-t border-white/5 transition-colors duration-200 text-center"
        >
          {expanded ? 'Show less ↑' : `Show ${movies.length - 3} more ↓`}
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   ACTIVITY FEED ITEM
───────────────────────────────────────────── */
const ActivityItem = ({ member, action, movie, time }) => (
  <div className="flex items-start gap-3 py-3 border-b border-white/4 last:border-0">
    <Avatar member={member} size="sm" />
    <div className="flex-1 min-w-0">
      <p className="text-gray-400 text-xs leading-snug">
        <span className="text-white font-semibold">{member.name}</span>{' '}
        <span className="text-gray-600">{action}</span>{' '}
        <span className="text-emerald-400 font-medium">
          {movie?.title || '—'}
        </span>
      </p>
      <p className="text-gray-700 text-[10px] mt-0.5">{time}</p>
    </div>
    {movie?.poster_path && (
      <div className="w-7 h-10 rounded overflow-hidden border border-white/8 flex-shrink-0">
        <ImageOrFallback
          src={W185 + movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   WRITE REVIEW MODAL
───────────────────────────────────────────── */
const WriteReviewModal = ({ onClose, trendingMovies }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(trendingMovies.slice(0, 5));
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await get('/search/movie', { query, page: 1 });
        setResults(res.data.results.filter((m) => m.poster_path).slice(0, 6));
      } catch (e) {
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canSubmit = selected && rating > 0 && text.trim().length > 10;

  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <div
          className="relative z-10 bg-[#0e0c09] border border-emerald-500/30 rounded-3xl p-10 text-center max-w-sm w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <FiCheck size={28} className="text-emerald-400" />
          </div>
          <h3
            className="text-white font-black text-xl mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Review Posted!
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Your review of{' '}
            <span className="text-emerald-400">{selected.title}</span> has been
            shared with the community.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-sm"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <div
        className="relative z-10 bg-[#0e0c09] border border-white/10 rounded-3xl overflow-hidden shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
            <h3
              className="text-white font-black text-base"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Write a Review
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-white/20 flex items-center justify-center transition-all duration-200"
          >
            <FiX size={14} />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto p-6 space-y-5"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Step 1: Pick film */}
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">
              1 · Choose a Film
            </p>
            {selected ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                <div className="w-10 h-14 rounded-lg overflow-hidden border border-emerald-500/30 flex-shrink-0">
                  <ImageOrFallback
                    src={
                      selected.poster_path ? W185 + selected.poster_path : ''
                    }
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">
                    {selected.title}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {selected.release_date?.slice(0, 4)}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-600 hover:text-white transition-colors duration-200"
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <div>
                <div className="relative mb-3">
                  <FiSearch
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="w-full bg-white/5 border border-white/10 text-white text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500/40 placeholder-gray-600 transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {results.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className="group text-left rounded-xl overflow-hidden border border-white/6 hover:border-emerald-500/30 transition-all duration-200"
                    >
                      <div className="h-[100px] overflow-hidden">
                        <ImageOrFallback
                          src={m.poster_path ? W185 + m.poster_path : ''}
                          alt={m.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-gray-300 text-[10px] font-semibold line-clamp-2 leading-snug">
                          {m.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Rating */}
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">
              2 · Your Rating
            </p>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          {/* Step 3: Review text */}
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">
              3 · Your Review
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you think? Be honest, be passionate, be you…"
              rows={5}
              className="w-full bg-white/4 border border-white/10 text-gray-300 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500/35 placeholder-gray-700 resize-none transition-all duration-200 leading-relaxed"
              style={{ fontFamily: "'Georgia', serif" }}
            />
            <div className="flex justify-between items-center mt-1.5">
              <span className="text-gray-700 text-[10px]">
                Minimum 10 characters
              </span>
              <span
                className={`text-[10px] ${text.length > 10 ? 'text-emerald-600' : 'text-gray-700'}`}
              >
                {text.length} chars
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between flex-shrink-0">
          <p className="text-gray-600 text-xs">
            Posting as <span className="text-emerald-400">Mara Voss</span>
          </p>
          <button
            onClick={() => canSubmit && setSubmitted(true)}
            disabled={!canSubmit}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${canSubmit ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/40' : 'bg-white/5 text-gray-600 border border-white/8 cursor-not-allowed'}`}
          >
            <FiEdit3 size={13} /> Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   WEEKLY POLL
───────────────────────────────────────────── */
const WeeklyPoll = () => {
  const [voted, setVoted] = useState(null);
  const totalVotes = 4821;
  const mockPcts = { a: 31, b: 24, c: 38, d: 7 };

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/15 to-teal-900/10 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Weekly Poll
        </span>
      </div>
      <h4
        className="text-white font-black text-base mb-4 leading-snug"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        CGI vs. Practical Effects: Which makes a better film?
      </h4>
      <div className="space-y-2.5 mb-4">
        {POLL_OPTIONS.map((opt) => {
          const pct = mockPcts[opt.id];
          const isWinner =
            !voted && pct === Math.max(...Object.values(mockPcts));
          const isMyVote = voted === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => !voted && setVoted(opt.id)}
              className={`w-full relative rounded-xl overflow-hidden text-left transition-all duration-300 ${voted ? 'cursor-default' : 'hover:border-emerald-500/40 cursor-pointer'} border ${isMyVote ? 'border-emerald-500/50' : 'border-white/8'}`}
            >
              {/* Progress fill */}
              {voted && (
                <div
                  className={`absolute inset-0 ${isMyVote ? 'bg-emerald-500/20' : 'bg-white/4'} transition-all duration-700 rounded-xl`}
                  style={{ width: `${pct}%` }}
                />
              )}
              <div className="relative z-10 flex items-center justify-between px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  {isMyVote && (
                    <FiCheck
                      size={12}
                      className="text-emerald-400 flex-shrink-0"
                    />
                  )}
                  <span
                    className={`text-sm font-medium ${isMyVote ? 'text-emerald-300' : voted ? 'text-gray-400' : 'text-gray-300'}`}
                  >
                    {opt.label}
                  </span>
                </div>
                {voted && (
                  <span
                    className={`text-xs font-bold ${isMyVote ? 'text-emerald-400' : isWinner ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {pct}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-gray-700 text-[10px] text-center">
        {voted
          ? `${(totalVotes + 1).toLocaleString()} votes · Poll closes Sunday`
          : `${totalVotes.toLocaleString()} votes so far`}
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TOP REVIEWERS LEADERBOARD
───────────────────────────────────────────── */
const LeaderboardRow = ({ member, rank }) => {
  const rankColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
  const rankIcons = ['🥇', '🥈', '🥉'];
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0 group cursor-pointer">
      <span
        className={`text-sm font-black w-5 text-center flex-shrink-0 ${rankColors[rank - 1] || 'text-gray-700'}`}
      >
        {rank <= 3 ? rankIcons[rank - 1] : `${rank}`}
      </span>
      <Avatar member={member} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-bold group-hover:text-emerald-300 transition-colors duration-200 line-clamp-1">
          {member.name}
        </p>
        <p className="text-gray-700 text-[9px]">{member.handle}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-emerald-400 text-xs font-black">
          {member.reviews.toLocaleString()}
        </p>
        <p className="text-gray-700 text-[9px]">reviews</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const CommunityPage = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [debateMovies, setDebateMovies] = useState([]);
  const [listMovies, setListMovies] = useState({ a: [], b: [], c: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'debates' | 'lists'
  const [showCompose, setShowCompose] = useState(false);
  const [activityMovies, setActivityMovies] = useState([]);

  const ACTIONS = [
    'rated',
    'loved',
    'added to watchlist',
    'reviewed',
    'recommended',
    'finished watching',
  ];
  const TIMES = [
    'just now',
    '2m ago',
    '8m ago',
    '15m ago',
    '31m ago',
    '1h ago',
    '2h ago',
    '3h ago',
  ];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [trendRes, popRes, debateRes, listARes, listBRes, listCRes] =
          await Promise.all([
            get('/trending/movie/day'),
            get('/movie/popular', { page: 1 }),
            get('/movie/top_rated', { page: 1 }),
            get('/discover/movie', {
              with_genres: '18',
              sort_by: 'vote_average.desc',
              'vote_count.gte': 3000,
              page: 1,
            }),
            get('/discover/movie', {
              with_genres: '27',
              sort_by: 'popularity.desc',
              page: 1,
            }),
            get('/discover/movie', {
              with_genres: '878',
              sort_by: 'vote_average.desc',
              'vote_count.gte': 2000,
              page: 1,
            }),
          ]);

        const trendMovies = trendRes.data.results.slice(0, 20);
        setTrending(trendMovies);
        setPopular(popRes.data.results.slice(0, 20));
        setDebateMovies(debateRes.data.results.slice(0, 5));
        setListMovies({
          a: listARes.data.results.slice(0, 8),
          b: listBRes.data.results.slice(0, 8),
          c: listCRes.data.results.slice(0, 8),
        });
        setActivityMovies(trendMovies.slice(0, 16));
      } catch (e) {
        console.error('CommunityPage fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build reviews from trending + members + templates
  const reviews = trending.slice(0, 9).map((movie, i) => ({
    movie,
    member: MEMBERS[i % MEMBERS.length],
    template: REVIEW_TEMPLATES[i % REVIEW_TEMPLATES.length],
    index: i,
  }));

  // Activity feed
  const activityFeed = activityMovies.map((movie, i) => ({
    member: MEMBERS[i % MEMBERS.length],
    action: ACTIONS[i % ACTIONS.length],
    movie,
    time: TIMES[i % TIMES.length],
  }));

  // Community watchlists
  const communityLists = [
    {
      title: 'Essential Dramas of the Decade',
      member: MEMBERS[0],
      movies: listMovies.a,
      emoji: '🎭',
    },
    {
      title: 'Horror You Actually Need to See',
      member: MEMBERS[1],
      movies: listMovies.b,
      emoji: '😱',
    },
    {
      title: 'Sci-Fi That Will Break Your Brain',
      member: MEMBERS[2],
      movies: listMovies.c,
      emoji: '🚀',
    },
  ];

  const TABS = [
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <FiMessageSquare size={13} />,
      count: reviews.length,
    },
    {
      id: 'debates',
      label: 'Hot Debates',
      icon: <FaFire size={11} />,
      count: DEBATE_TAKES.length,
    },
    {
      id: 'lists',
      label: 'Curated Lists',
      icon: <FiBookmark size={13} />,
      count: communityLists.length,
    },
  ];

  return (
    <div className="min-h-screen pt-16" style={{ background: '#09080a' }}>
      <GrainOverlay />
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeSlideUp 0.4s ease forwards; }
      `}</style>

      {/* ═══════════════════════════════════════
          HERO HEADER
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-white/6">
        {/* Ambient from trending */}
        {trending[0]?.backdrop_path && (
          <>
            <img
              src={ORIG + trending[0].backdrop_path}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-8 scale-110 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-[#09080a]/80 to-[#09080a] pointer-events-none" />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {/* Live badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-2 bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live · {Math.floor(Math.random() * 800) + 1200} members online
                </span>
              </div>

              <h1
                className="font-black leading-[0.9] mb-3 text-white"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 80px rgba(16,185,129,0.15)',
                }}
              >
                The Screening
                <br />
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Room
                </span>
              </h1>
              <p className="text-gray-500 text-base max-w-lg leading-relaxed">
                Write reviews, debate takes, build lists. A community for people
                who take cinema seriously — and have a great time doing it.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-5 md:gap-8 flex-wrap">
              {[
                { val: '48.2K', label: 'Members', icon: <FiUsers size={14} /> },
                {
                  val: '312K',
                  label: 'Reviews',
                  icon: <FiMessageSquare size={14} />,
                },
                { val: '89K', label: 'Lists', icon: <FiBookmark size={14} /> },
                { val: '2.1M', label: 'Ratings', icon: <FaStar size={12} /> },
              ].map(({ val, label, icon }) => (
                <div key={label} className="text-center md:text-left">
                  <div className="flex items-center gap-1.5 text-emerald-400/60 mb-1 justify-center md:justify-start">
                    {icon}
                    <span className="text-[9px] uppercase tracking-wider text-gray-600">
                      {label}
                    </span>
                  </div>
                  <div
                    className="text-white text-xl font-black"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setShowCompose(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40 transition-all duration-200 hover:scale-[1.02]"
            >
              <FiEdit3 size={14} /> Write a Review
            </button>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200">
              <FiUsers size={14} /> Browse Members
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MAIN LAYOUT: 2-col (content + sidebar)
      ═══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Tab bar */}
          <div className="flex items-center gap-1 mb-6 bg-white/4 border border-white/8 rounded-2xl p-1 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/20 border border-emerald-500/30 text-emerald-300' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {tab.icon} {tab.label}
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/6 text-gray-600'}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 fade-up">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Shimmer key={i} className="h-[200px]" />
                  ))
                : reviews.map((r, i) => (
                    <div
                      key={`${r.movie.id}-${i}`}
                      style={{ animationDelay: `${i * 50}ms` }}
                      className="fade-up"
                    >
                      <ReviewCard {...r} />
                    </div>
                  ))}
            </div>
          )}

          {/* ── DEBATES TAB ── */}
          {activeTab === 'debates' && (
            <div className="space-y-4 fade-up">
              <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-orange-500/15 bg-orange-500/5 mb-5">
                <span className="text-orange-400 text-lg">🌶</span>
                <p className="text-gray-400 text-sm">
                  <span className="text-orange-300 font-semibold">
                    Hot takes ahead.
                  </span>{' '}
                  Vote on whether you agree or disagree with each take. All
                  opinions welcome.
                </p>
              </div>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Shimmer key={i} className="h-[160px]" />
                  ))
                : DEBATE_TAKES.map((debate, i) => (
                    <div
                      key={debate.id}
                      style={{ animationDelay: `${i * 60}ms` }}
                      className="fade-up"
                    >
                      <DebateCard
                        debate={debate}
                        movie={debateMovies[i] || null}
                      />
                    </div>
                  ))}
            </div>
          )}

          {/* ── LISTS TAB ── */}
          {activeTab === 'lists' && (
            <div className="space-y-4 fade-up">
              <div className="flex items-center gap-2 p-3.5 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 mb-5">
                <span className="text-emerald-400 text-lg">📋</span>
                <p className="text-gray-400 text-sm">
                  <span className="text-emerald-300 font-semibold">
                    Community curated.
                  </span>{' '}
                  Lists built by our top members. Add any film directly to your
                  watchlist.
                </p>
              </div>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Shimmer key={i} className="h-[280px]" />
                  ))
                : communityLists.map((list, i) => (
                    <div
                      key={i}
                      style={{ animationDelay: `${i * 80}ms` }}
                      className="fade-up"
                    >
                      <CommunityList {...list} />
                    </div>
                  ))}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-6">
          {/* Weekly Poll */}
          <WeeklyPoll />

          {/* Top Reviewers */}
          <div className="rounded-2xl border border-white/6 bg-[#0e0c09] p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
              <h3
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Top Reviewers
              </h3>
              <span className="ml-auto text-[9px] text-gray-700 uppercase tracking-wider">
                This Month
              </span>
            </div>
            {MEMBERS.map((m, i) => (
              <LeaderboardRow key={m.id} member={m} rank={i + 1} />
            ))}
          </div>

          {/* Live Activity Feed */}
          <div className="rounded-2xl border border-white/6 bg-[#0e0c09] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Live Activity
              </h3>
              <span className="ml-auto text-[9px] text-emerald-600 uppercase tracking-wider font-semibold">
                Live
              </span>
            </div>
            <div className="px-4 max-h-[360px] overflow-y-auto scrollbar-hide">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Shimmer key={i} className="h-12 my-2" />
                  ))
                : activityFeed.map((item, i) => (
                    <ActivityItem key={i} {...item} />
                  ))}
            </div>
          </div>

          {/* Trending This Week (mini strip) */}
          <div className="rounded-2xl border border-white/6 bg-[#0e0c09] p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
              <h3
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Trending Now
              </h3>
              <FaFire size={11} className="text-orange-400 ml-auto" />
            </div>
            <div className="space-y-2">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Shimmer key={i} className="h-10" />
                  ))
                : trending.slice(0, 6).map((movie, i) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-3 group cursor-pointer py-1"
                    >
                      <span className="text-gray-700 text-xs font-black w-4 text-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="w-8 h-11 rounded-lg overflow-hidden border border-white/8 flex-shrink-0">
                        <ImageOrFallback
                          src={
                            movie.poster_path ? W185 + movie.poster_path : ''
                          }
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-xs font-semibold line-clamp-1 group-hover:text-emerald-300 transition-colors duration-200">
                          {movie.title}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <AiFillStar className="text-yellow-500/60" size={8} />
                          <span className="text-gray-600 text-[9px]">
                            {movie.vote_average?.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Member spotlight */}
          <div className="rounded-2xl border border-white/6 bg-[#0e0c09] p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
              <h3
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Member Spotlight
              </h3>
            </div>
            {(() => {
              const m = MEMBERS[2];
              return (
                <div className="text-center">
                  <Avatar member={m} size="lg" />
                  <div className="mt-3">
                    <div className="flex items-center justify-center gap-2 mb-0.5">
                      <p
                        className="text-white font-bold text-sm"
                        style={{ fontFamily: "'Georgia', serif" }}
                      >
                        {m.name}
                      </p>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 font-bold">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[10px] mb-3">{m.handle}</p>
                    <p
                      className="text-gray-500 text-xs italic leading-relaxed mb-4"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      "{m.bio}"
                    </p>
                    <div className="flex justify-center gap-6">
                      {[
                        { val: m.reviews.toLocaleString(), label: 'Reviews' },
                        {
                          val: (m.followers / 1000).toFixed(1) + 'k',
                          label: 'Followers',
                        },
                      ].map(({ val, label }) => (
                        <div key={label} className="text-center">
                          <p className="text-white font-black text-base">
                            {val}
                          </p>
                          <p className="text-gray-700 text-[9px] uppercase tracking-wider">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── COMPOSE MODAL ── */}
      {showCompose && (
        <WriteReviewModal
          onClose={() => setShowCompose(false)}
          trendingMovies={trending}
        />
      )}
    </div>
  );
};

export default CommunityPage;
