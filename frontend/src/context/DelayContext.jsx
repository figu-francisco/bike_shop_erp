import { createContext, useContext } from 'react';

const DelayContext = createContext();

export const DelayProvider = ({ children }) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <DelayContext.Provider value={{ delay }}>
            {children}
        </DelayContext.Provider>
    );
};

export const useDelay = () => useContext(DelayContext);