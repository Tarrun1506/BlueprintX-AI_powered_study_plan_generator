import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/api';

import { useAuth } from './AuthContext';

const AnalysisContext = createContext(undefined);

export const AnalysisProvider = ({ children }) => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [savedAnalyses, setSavedAnalyses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refreshHistory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.fetchAnalyses();
            setSavedAnalyses(data);
            setError(null);
        } catch (err) {
            setError('Failed to load history');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveCurrentAnalysis = async () => {
        if (!analysisResult) return;

        try {
            await api.saveAnalysis({
                filename: analysisResult.filename || 'Untitled',
                content_hash: analysisResult.content_hash || 'hash', // Need to make sure this is returned by backend
                analysis_result: analysisResult.analysis_result || analysisResult
            });
            await refreshHistory();
        } catch (err) {
            console.error('Failed to save analysis', err);
        }
    };

    const removeAnalysis = async (id) => {
        try {
            await api.deleteAnalysis(id);
            setSavedAnalyses(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            console.error('Failed to delete', err);
        }
    };

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            refreshHistory();
        } else {
            setSavedAnalyses([]);
        }
    }, [isAuthenticated, refreshHistory]);

    const value = {
        analysisResult,
        setAnalysisResult,
        savedAnalyses,
        refreshHistory,
        saveCurrentAnalysis,
        removeAnalysis,
        loading,
        error
    };

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
};
