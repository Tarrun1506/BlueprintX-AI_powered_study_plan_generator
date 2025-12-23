import React, { createContext, useState, useContext } from 'react';

// Create the context with a default value
const AnalysisContext = createContext(undefined);

// Create a provider component
export const AnalysisProvider = ({ children }) => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [studyPlan, setStudyPlan] = useState(null);

    const value = {
        analysisResult,
        setAnalysisResult,
        studyPlan,
        setStudyPlan
    };

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
};

// Create a custom hook to use the context
export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
};
