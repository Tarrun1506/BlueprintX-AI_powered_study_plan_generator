import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, CircularProgress, Typography, Box, Alert, Paper, List,
    ListItemText, Collapse, ListItemButton, Card, CardContent,
    CardActions, Grid, Divider, Snackbar, Tooltip
} from '@mui/material';
import {
    UploadFile as UploadFileIcon, ExpandLess, ExpandMore,
    Article as ArticleIcon, CloudUpload as CloudUploadIcon,
    CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { useAnalysis } from '../../context/AnalysisContext';
import { TopicItem } from './TopicView.jsx';

// Main component
const SyllabusUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const { analysisResult, setAnalysisResult, saveCurrentAnalysis, refreshHistory } = useAnalysis();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { uploadSyllabus, generateSchedule, saveAnalysis } = useApi();
    const navigate = useNavigate();

    // Use context state as local state
    const analysis = analysisResult;
    const setAnalysis = setAnalysisResult;

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setError(null);
            setSnackbarMessage(`File "${selectedFile.name}" selected successfully`);
            setSnackbarOpen(true);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError(null);
        setAnalysis(null);

        try {
            console.log(`Uploading file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
            const response = await uploadSyllabus(file);
            console.log('Upload successful, response:', response);

            // Auto-save immediately to get ID
            const savedDoc = await saveAnalysis({
                filename: response.filename || file.name,
                content_hash: response.content_hash || 'temp',
                analysis_result: response
            });

            console.log('Analysis saved:', savedDoc);

            // Refresh "My Library" context
            await refreshHistory();

            setSnackbarMessage('Analysis completed and saved!');
            setSnackbarOpen(true);

            // Redirect to result page
            navigate(`/analysis/${savedDoc._id}`);

        } catch (err) {
            console.error('Upload failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload and analyze syllabus';
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleGenerateSchedule = async () => {
        if (!analysis) return;
        setUploading(true); // Reuse loading state or add new one
        try {
            let id = analysis._id;
            if (!id) {
                // Auto-save if not saved
                const saved = await saveCurrentAnalysis();
                if (!saved || !saved._id) throw new Error("Failed to save analysis before scheduling.");
                id = saved._id;
            }

            const updatedAnalysis = await generateSchedule(id, {
                start_date: new Date().toISOString(),
                daily_hours: 2.0
            });

            // Normalize result
            const result = updatedAnalysis.analysis_result || updatedAnalysis;
            setAnalysis(result);
            setSnackbarMessage('Study Schedule Generated!');
            setSnackbarOpen(true);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleToggleTopic = async (toggledTopic) => {
        if (!analysis) return;

        // Recursive updater
        const updateTopics = (topics) => {
            return topics.map(t => {
                if (t.name === toggledTopic.name) {
                    return { ...t, completed: !t.completed };
                }
                if (t.subtopics && t.subtopics.length > 0) {
                    return { ...t, subtopics: updateTopics(t.subtopics) };
                }
                return t;
            });
        };

        const newTopics = updateTopics(analysis.topics);
        // Also update priority_topics if they exist by mapping name
        let newPriorityTopics = analysis.priority_topics;
        if (newPriorityTopics) {
            newPriorityTopics = newPriorityTopics.map(pt => {
                if (pt.name === toggledTopic.name) return { ...pt, completed: !pt.completed };
                return pt;
            });
        }

        const newAnalysis = {
            ...analysis,
            topics: newTopics,
            priority_topics: newPriorityTopics
        };

        setAnalysis(newAnalysis);

        // Auto-save logic
        try {
            // We need to match the structure expected by saveAnalysis
            // The context `saveCurrentAnalysis` uses state, which might be stale here.
            // So we call the API directly for the background save.
            await saveAnalysis({
                filename: newAnalysis.filename || 'Untitled',
                content_hash: newAnalysis.content_hash || 'hash',
                analysis_result: newAnalysis
            });
            console.log("Topic status saved.");
        } catch (e) {
            console.error("Failed to auto-save topic status", e);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}
            >
                <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: '#2c3e50' }}>
                    Upload Syllabus
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Upload your syllabus file (.pdf, .docx, .txt) to get an AI-powered analysis and study plan tailored to your course material.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2.5,
                        alignItems: { xs: 'stretch', sm: 'center' },
                        mb: 3,
                        mt: 4
                    }}
                >
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        sx={{
                            borderRadius: 2.5,
                            py: 1.5,
                            px: 3,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                            }
                        }}
                    >
                        Select File
                        <input
                            type="file"
                            hidden
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileChange}
                        />
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                        sx={{
                            borderRadius: 2.5,
                            py: 1.5,
                            px: 3,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            background: !file || uploading ? undefined : 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                transform: !file || uploading ? undefined : 'translateY(-2px)',
                                boxShadow: !file || uploading ? undefined : '0 6px 12px rgba(0,0,0,0.15)',
                            }
                        }}
                    >
                        {uploading ? 'Analyzing...' : 'Upload & Analyze'}
                    </Button>
                </Box>

                {file && (
                    <Paper
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            p: 2,
                            gap: 1,
                            alignItems: 'center',
                            borderRadius: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            borderColor: 'primary.light',
                            mb: 2
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'primary.main',
                            mr: 1.5,
                            '& svg': {
                                fontSize: 40
                            }
                        }}>
                            <ArticleIcon fontSize="large" color="primary" />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="500">
                                {file.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {(file.size / 1024).toFixed(1)} KB · {file.type || 'Unknown type'}
                            </Typography>
                        </Box>
                    </Paper>
                )}

                {error && (
                    <Alert
                        severity="error"
                        variant="filled"
                        sx={{
                            mt: 2,
                            borderRadius: 2,
                            '& .MuiAlert-icon': {
                                alignItems: 'center'
                            }
                        }}
                    >
                        <Box>
                            <Typography fontWeight="bold">Upload failed</Typography>
                            <Typography variant="body2">{error}</Typography>
                        </Box>
                    </Alert>
                )}
            </Paper>

            {/* Inline result display removed - redirects to AnalysisResultPage */}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Box >
    );
};

export default SyllabusUpload;
