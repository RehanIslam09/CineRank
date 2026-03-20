import axios from 'axios';

const API_KEY = 'cbf0f905f444c20a3337dbda0032423c';
const BASE = 'https://api.themoviedb.org/3';
const W500 = 'https://image.tmdb.org/t/p/w500';

/* ─────────────────────────────────────────────
   MERGED MOOD SET
   (Your original 6 + teacher's 5, de-duped & expanded)
───────────────────────────────────────────── */
export const MOODS = [
  // From your original set
  {
    id: 'happy',
    label: 'Happy',
    emoji: '😄',
    genres: [35, 10751],
    color: 'from-yellow-500 to-amber-400',
    border: 'border-yellow-500/40',
    text: 'text-yellow-300',
    bg: 'bg-yellow-500/15',
  },
  {
    id: 'sad',
    label: 'Sad',
    emoji: '😢',
    genres: [18, 10749],
    color: 'from-blue-500 to-indigo-500',
    border: 'border-blue-500/40',
    text: 'text-blue-300',
    bg: 'bg-blue-500/15',
  },
  {
    id: 'scared',
    label: 'Scared',
    emoji: '😱',
    genres: [27, 9648, 53],
    color: 'from-red-600 to-rose-500',
    border: 'border-red-500/40',
    text: 'text-red-300',
    bg: 'bg-red-500/15',
  },
  {
    id: 'excited',
    label: 'Excited',
    emoji: '🤩',
    genres: [28, 12, 878],
    color: 'from-orange-500 to-red-500',
    border: 'border-orange-500/40',
    text: 'text-orange-300',
    bg: 'bg-orange-500/15',
  },
  {
    id: 'chill',
    label: 'Chill',
    emoji: '😌',
    genres: [10749, 35, 16],
    color: 'from-teal-500 to-cyan-400',
    border: 'border-teal-500/40',
    text: 'text-teal-300',
    bg: 'bg-teal-500/15',
  },
  {
    id: 'thoughtful',
    label: 'Thoughtful',
    emoji: '🤔',
    genres: [99, 36, 18],
    color: 'from-violet-500 to-purple-500',
    border: 'border-violet-500/40',
    text: 'text-violet-300',
    bg: 'bg-violet-500/15',
  },
  // From teacher's set (adapted/merged)
  {
    id: 'cozy',
    label: 'Cozy',
    emoji: '🛋️',
    genres: [10749, 16, 35],
    color: 'from-pink-500 to-rose-400',
    border: 'border-pink-500/40',
    text: 'text-pink-300',
    bg: 'bg-pink-500/15',
  },
  {
    id: 'edge',
    label: 'On the Edge',
    emoji: '⚡',
    genres: [53, 27, 9648],
    color: 'from-fuchsia-500 to-violet-600',
    border: 'border-fuchsia-500/40',
    text: 'text-fuchsia-300',
    bg: 'bg-fuchsia-500/15',
  },
  {
    id: 'inspired',
    label: 'Inspired',
    emoji: '✨',
    genres: [99, 36, 18],
    color: 'from-emerald-500 to-teal-400',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/15',
  },
  {
    id: 'brainoff',
    label: 'Brain Off',
    emoji: '🍿',
    genres: [28, 12, 14],
    color: 'from-cyan-500 to-blue-400',
    border: 'border-cyan-500/40',
    text: 'text-cyan-300',
    bg: 'bg-cyan-500/15',
  },
  {
    id: 'documentary',
    label: 'Documentary',
    emoji: '🎥',
    genres: [99],
    color: 'from-amber-600 to-yellow-500',
    border: 'border-amber-500/40',
    text: 'text-amber-300',
    bg: 'bg-amber-500/15',
  },
];

/* ─────────────────────────────────────────────
   GENRE MAP  (id → name, for reasoning text)
───────────────────────────────────────────── */
const GENRE_NAMES = {
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
const uniq = (arr) => [...new Set(arr)];

const genreNames = (ids) =>
  (ids || []).map((id) => GENRE_NAMES[id]).filter(Boolean);

function topGenreIdsFromWatchlist(watchlist, limit = 6) {
  const counts = new Map();
  for (const m of watchlist) {
    for (const id of m?.genre_ids || []) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}

function scoreMoodMatch(movie, moodGenreIds) {
  const movieIds = movie?.genre_ids || [];
  const overlap = movieIds.filter((id) => moodGenreIds.includes(id)).length;
  const rating =
    typeof movie?.vote_average === 'number' ? movie.vote_average / 10 : 0;
  const popularity =
    typeof movie?.popularity === 'number'
      ? Math.min(movie.popularity / 100, 1)
      : 0;
  return overlap * 5 + rating * 2 + popularity;
}

function pickFromWatchlist(watchlist, moodGenreIds, count) {
  return [...watchlist]
    .filter((m) => m?.id)
    .sort(
      (a, b) =>
        scoreMoodMatch(b, moodGenreIds) - scoreMoodMatch(a, moodGenreIds),
    )
    .reduce((acc, m) => {
      if (!acc.find((x) => x.id === m.id)) acc.push(m);
      return acc;
    }, [])
    .slice(0, count);
}

/* ─────────────────────────────────────────────
   REASONING BUILDERS
───────────────────────────────────────────── */
function watchlistReasoning(movie, mood) {
  const moodCfg = MOODS.find((m) => m.id === mood);
  const moodLabel = moodCfg?.label || mood;
  const overlap = (movie.genre_ids || []).filter((id) =>
    (moodCfg?.genres || []).includes(id),
  );
  const names = genreNames(overlap).slice(0, 2);

  if (names.length > 0) {
    return `Already in your watchlist — perfect for a ${moodLabel} night with its ${names.join(' & ')} energy.`;
  }
  return `Already saved — steering it toward your ${moodLabel} vibe tonight.`;
}

function discoveryReasoning(movie, mood, vibeGenreIds) {
  const moodCfg = MOODS.find((m) => m.id === mood);
  const moodLabel = moodCfg?.label || mood;
  const moodIds = moodCfg?.genres || [];
  const movieIds = movie?.genre_ids || [];

  const moodMatch = genreNames(
    movieIds.filter((id) => moodIds.includes(id)),
  ).slice(0, 2);
  const vibeMatch = genreNames(
    movieIds.filter((id) => vibeGenreIds.includes(id)),
  ).slice(0, 2);

  if (moodMatch.length > 0 && vibeMatch.length > 0) {
    return `A great ${moodLabel} pick — blends ${moodMatch.join(' & ')} with the ${vibeMatch.join(' & ')} vibes from your watchlist.`;
  }
  if (moodMatch.length > 0) {
    return `Matches your ${moodLabel} mood perfectly with strong ${moodMatch.join(' & ')} energy.`;
  }
  if (vibeMatch.length > 0) {
    return `Tailored to your taste — your watchlist loves ${vibeMatch.join(' & ')}, and this delivers.`;
  }
  return `A top-rated pick that fits your ${moodLabel} mood right now.`;
}

/* ─────────────────────────────────────────────
   TMDB DISCOVER  (returns full movie objects)
───────────────────────────────────────────── */
async function discoverMovies({
  genreIds,
  excludeIds = [],
  targetCount = 4,
  maxPages = 4,
}) {
  if (!genreIds.length) return [];
  const excludeSet = new Set(excludeIds);
  const collected = [];
  const collectedIds = new Set();

  for (let page = 1; page <= maxPages; page++) {
    try {
      const { data } = await axios.get(`${BASE}/discover/movie`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          sort_by: 'popularity.desc',
          include_adult: false,
          with_genres: uniq(genreIds).join(','),
          'vote_count.gte': 200,
          page,
        },
      });

      for (const m of data.results || []) {
        if (!m?.id || excludeSet.has(m.id) || collectedIds.has(m.id)) continue;
        collectedIds.add(m.id);
        collected.push(m);
        if (collected.length >= targetCount) break;
      }
      if (collected.length >= targetCount) break;
    } catch (e) {
      console.error('discoverMovies error', e);
      break;
    }
  }
  return collected.slice(0, targetCount);
}

async function discoverPopularFallback({ excludeIds = [], targetCount = 2 }) {
  const excludeSet = new Set(excludeIds);
  const collected = [];
  const collectedIds = new Set();
  try {
    for (let page = 1; page <= 3; page++) {
      const { data } = await axios.get(`${BASE}/movie/popular`, {
        params: { api_key: API_KEY, language: 'en-US', page },
      });
      for (const m of data.results || []) {
        if (!m?.id || excludeSet.has(m.id) || collectedIds.has(m.id)) continue;
        collectedIds.add(m.id);
        collected.push(m);
        if (collected.length >= targetCount) break;
      }
      if (collected.length >= targetCount) break;
    }
  } catch (e) {
    console.error('fallback error', e);
  }
  return collected.slice(0, targetCount);
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
   Returns array of recommendation objects:
   { movie (full TMDB obj), reasoning, source }
───────────────────────────────────────────── */
export async function recommendMovies({ moodId, watchlist = [] }) {
  const moodCfg = MOODS.find((m) => m.id === moodId);
  if (!moodCfg) throw new Error(`Unknown mood: ${moodId}`);

  const moodGenreIds = moodCfg.genres;
  const recent = watchlist.slice(-30);
  const watchlistIds = recent.map((m) => m?.id).filter(Boolean);
  const vibeGenreIds = topGenreIdsFromWatchlist(recent, 6);
  const combinedIds = uniq([...moodGenreIds, ...vibeGenreIds]).slice(0, 6);

  // 2 from watchlist (if available)
  const wlPicks = pickFromWatchlist(recent, moodGenreIds, 2);
  const wlIds = wlPicks.map((m) => m.id);
  const excludes = [...watchlistIds, ...wlIds];

  const recs = wlPicks.map((m) => ({
    movie: m,
    reasoning: watchlistReasoning(m, moodId),
    source: 'watchlist',
  }));

  // Fill up to 6 with discovered movies
  let remaining = 6 - recs.length;

  const discovered = await discoverMovies({
    genreIds: combinedIds,
    excludeIds: excludes,
    targetCount: remaining,
    maxPages: 4,
  });

  discovered.forEach((m) => {
    recs.push({
      movie: m,
      reasoning: discoveryReasoning(m, moodId, vibeGenreIds),
      source: 'discovery',
    });
    excludes.push(m.id);
  });

  // Fallback to popular if still not 6
  remaining = 6 - recs.length;
  if (remaining > 0) {
    const fallback = await discoverPopularFallback({
      excludeIds: excludes,
      targetCount: remaining,
    });
    fallback.forEach((m) => {
      recs.push({
        movie: m,
        reasoning: discoveryReasoning(m, moodId, vibeGenreIds),
        source: 'popular',
      });
    });
  }

  return recs.slice(0, 6);
}
