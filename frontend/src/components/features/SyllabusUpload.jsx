import React, { useState, useEffect } from 'react';
import {
    Button, CircularProgress, Typography, Box, Alert, Paper, List,
    ListItemText, Collapse, ListItemButton, Card, CardContent,
    CardActions, Grid, Divider, Snackbar
} from '@mui/material';
import {
    UploadFile as UploadFileIcon, ExpandLess, ExpandMore,
    Article as ArticleIcon, CloudUpload as CloudUploadIcon,
    PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { useAnalysis } from '../../context/AnalysisContext';
import { TopicItem } from './TopicView.jsx';

// Main component
const SyllabusUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const { analysisResult, setAnalysisResult } = useAnalysis();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { uploadSyllabus } = useApi();

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

            // Mark priority topics for auto-fetching
            if (response.priority_topics) {
                const priorityNames = new Set(response.priority_topics.map(t => t.name));
                const markPriority = (topics) => {
                    topics.forEach(t => {
                        if (priorityNames.has(t.name)) t.isPriority = true;
                        if (t.subtopics) markPriority(t.subtopics);
                    });
                };
                markPriority(response.topics);
            }

            setAnalysis(response);
            setSnackbarMessage('Syllabus analysis completed successfully!');
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Upload failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload and analyze syllabus';
            setError(errorMessage);
        } finally {
            setUploading(false);
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

            {analysis && (
                <Paper
                    elevation={4}
                    sx={{
                        p: { xs: 2, sm: 3, md: 4 },
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            mb: 1.5
                        }}>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    color: '#2c3e50',
                                    fontSize: { xs: '1.75rem', md: '2.125rem' }
                                }}
                            >
                                Syllabus Analysis
                            </Typography>
                            {analysis.total_study_hours && (
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                        fontSize: { xs: '1rem', md: '1.125rem' },
                                        backgroundColor: 'rgba(0,0,0,0.04)',
                                        px: 2,
                                        py: 0.75,
                                        borderRadius: 2
                                    }}
                                >
                                    Total Study Time: {analysis.total_study_hours.toFixed(1)} hours
                                </Typography>
                            )}
                        </Box>
                        <Divider sx={{
                            mb: 4,
                            borderColor: 'rgba(0,0,0,0.1)',
                            borderBottomWidth: 2
                        }} />
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: { xs: 2, md: 2.5 },
                                            borderRadius: 2,
                                            height: '100%',
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            borderColor: 'rgba(0,0,0,0.08)',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            fontWeight={600}
                                            gutterBottom
                                            sx={{
                                                color: '#2c3e50',
                                                mb: 2,
                                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                                pb: 1,
                                                fontSize: { xs: '1.25rem', md: '1.5rem' }
                                            }}
                                        >
                                            Course Topics
                                        </Typography>
                                        <Box sx={{ maxHeight: '600px', overflowY: 'auto', pr: 1 }}>
                                            <List sx={{ pt: 0 }}>
                                                {analysis.topics.map((topic, index) => (
                                                    <TopicItem key={index} topic={topic} />
                                                ))}
                                            </List>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: { xs: 2, md: 2.5 },
                                            borderRadius: 2,
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            borderColor: 'rgba(0,0,0,0.08)',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            fontWeight={600}
                                            gutterBottom
                                            sx={{
                                                color: '#2c3e50',
                                                mb: 2,
                                                borderBottom: '1px solid rgba(0,0,0,0.05)',
                                                pb: 1,
                                                fontSize: { xs: '1.25rem', md: '1.5rem' }
                                            }}
                                        >
                                            Priority Topics
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 2.5,
                                                color: '#455a64',
                                                fontWeight: 500,
                                                backgroundColor: 'rgba(66, 165, 245, 0.08)',
                                                px: 1.5,
                                                py: 1,
                                                borderRadius: 1,
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Focus on these high-impact topics first
                                        </Typography>
                                        <List sx={{ pt: 0 }}>
                                            {analysis.priority_topics && analysis.priority_topics.length > 0 ? (
                                                analysis.priority_topics.map((topic, index) => (
                                                    <TopicItem key={index} topic={topic} />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                                                    No priority topics identified
                                                </Typography>
                                            )}
                                        </List>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default SyllabusUpload;
