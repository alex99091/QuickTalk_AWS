import { useState } from 'react';
import ChattingContext from './ChattingContext';
import ChattingInfo from '../models/ChattingInfo';

function ChattingProvider({ children }) {
  const [chatInfo, setChatInfo] = useState(new ChattingInfo());

  return (
    <ChattingContext.Provider value={{ chatInfo, setChatInfo }}>
      {children}
    </ChattingContext.Provider>
  );
}

export default ChattingProvider;
