import { createContext, useContext, useState } from 'react';
import { MOODS } from '../recommendations/recommendMovies';

export { MOODS };

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  return (
    <MoodContext.Provider value={{ selectedMood, setSelectedMood }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => useContext(MoodContext);
