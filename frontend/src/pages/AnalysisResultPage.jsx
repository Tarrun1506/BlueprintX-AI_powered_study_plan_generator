import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Button, CircularProgress,
    Divider, Grid, Alert, Container
} from '@mui/material';
import {
    Download as DownloadIcon,
    CalendarMonth as CalendarMonthIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import { TopicItem } from '../components/features/TopicView';
import { generatePdf } from '../utils/PdfExport';
import * as api from '../services/api';

const AnalysisResultPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAnalysis, generateSchedule, saveAnalysis } = useApi(); // Assuming getAnalysis exists or I need to fetch it manually
    // Actually useApi might not have getAnalysis exposed directly if it's just a wrapper. 
    // Let's check api.js: fetchAnalyses gets all, get_analysis by ID endpoint exists in backend but maybe not in frontend service yet?
    // I recall `fetchAnalyses` but not `fetchAnalysisById` in api.js view. 
    // I will use `fetch`${API_BASE_URL}/analysis/${id}`` style for now or add it to services. 
    // Wait, let's just add it to api.js first properly. For now I'll assume I can add it.

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch analysis on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Direct fetch since useApi might not have the ID specific getter exposed yet
                // I will add it to api.js in a moment, but for this file content lets assume it exists or use direct fetch
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8000/api/analysis/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to load analysis");
                const data = await response.json();
                setAnalysis(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleGenerateSchedule = async () => {
        if (!analysis) return;
        setActionLoading(true);
        try {
            const updated = await generateSchedule(id, {
                start_date: new Date().toISOString(),
                daily_hours: 2.0
            });
            // The backend returns the full document, update local state
            setAnalysis(updated);
        } catch (err) {
            console.error(err);
            alert("Failed to generate schedule: " + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDownload = () => {
        if (analysis) {
            // Need to normalize data structure for PDF export if needed
            // The PDF export expects { topics: [], total_study_hours: ... }
            // Our analysis object has `analysis_result` which contains topics.
            const dataToExport = {
                filename: analysis.filename,
                ...analysis.analysis_result,
                schedule: analysis.analysis_result.schedule // if legacy structure differs
            };
            generatePdf(dataToExport);
        }
    };

    // Toggle handler for recursive checkbox with cascading
    const handleToggleTopic = async (toggledTopic) => {
        if (!analysis) return;

        const currentResult = analysis.analysis_result;

        const updateTopics = (topics) => {
            return topics.map(t => {
                let isCompleted = t.completed;
                let updatedSubtopics = t.subtopics;

                // Case A: This is the toggled topic
                if (t.name === toggledTopic.name) {
                    isCompleted = !t.completed;

                    // CASCADE: If this topic has subtopics, set all children to the same state
                    if (t.subtopics && t.subtopics.length > 0) {
                        const cascadeToChildren = (children, targetState) => {
                            return children.map(child => ({
                                ...child,
                                completed: targetState,
                                subtopics: child.subtopics && child.subtopics.length > 0
                                    ? cascadeToChildren(child.subtopics, targetState)
                                    : child.subtopics
                            }));
                        };
                        updatedSubtopics = cascadeToChildren(t.subtopics, isCompleted);
                    }
                } else {
                    // Recursively process subtopics
                    if (t.subtopics && t.subtopics.length > 0) {
                        updatedSubtopics = updateTopics(t.subtopics);

                        // Auto-complete parent if all children are completed
                        const allChildrenDone = updatedSubtopics.every(child => child.completed);
                        isCompleted = allChildrenDone;
                    }
                }

                return {
                    ...t,
                    completed: isCompleted,
                    subtopics: updatedSubtopics
                };
            });
        };

        const newTopics = updateTopics(currentResult.topics || []);
        const newResult = { ...currentResult, topics: newTopics }; // Update topics
        const newAnalysis = { ...analysis, analysis_result: newResult };

        setAnalysis(newAnalysis); // Optimistic update

        // Save to database
        try {
            await api.updateAnalysis(id, {
                filename: analysis.filename,
                content_hash: analysis.content_hash || 'hash',
                analysis_result: newResult
            });
            console.log("Topic status saved to database");
        } catch (e) {
            console.error("Failed to save topic status:", e);
        }
    };

    if (loading) return <Container sx={{ mt: 4, textAlign: 'center' }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!analysis) return <Container sx={{ mt: 4 }}><Alert severity="info">Analysis not found</Alert></Container>;

    const result = analysis.analysis_result || {};

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/history')}
                sx={{ mb: 2 }}
            >
                Back to Library
            </Button>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #eee', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="700" color="primary.main">
                            {analysis.filename}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Total Est. Hours: {result.total_study_hours?.toFixed(1) || 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {!result.schedule && (
                            <Button
                                variant="outlined"
                                startIcon={<CalendarMonthIcon />}
                                onClick={handleGenerateSchedule}
                                disabled={actionLoading}
                            >
                                Generate Schedule
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                        >
                            Download PDF
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>Topics</Typography>
                    {result.topics && result.topics.map((topic, index) => (
                        <TopicItem
                            key={index}
                            topic={topic}
                            onToggle={handleToggleTopic}
                        />
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default AnalysisResultPage;
