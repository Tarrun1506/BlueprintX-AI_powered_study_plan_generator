import React from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Button,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    History as HistoryIcon,
    Compare as CompareIcon
} from '@mui/icons-material';
import { useAnalysis } from '../context/AnalysisContext';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const { savedAnalyses, removeAnalysis, setAnalysisResult, loading, error } = useAnalysis();
    const navigate = useNavigate();

    const handleView = (analysis) => {
        setAnalysisResult(analysis.analysis_result);
        navigate('/upload'); // Redirect to view results
    };

    if (loading && savedAnalyses.length === 0) {
        return (
            <Container sx={{ mt: 10, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <HistoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h4" component="h1">
                    My Syllabi Library
                </Typography>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
            )}

            <Paper sx={{ borderRadius: 2 }}>
                {savedAnalyses.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            Your library is empty. Upload and analyze a syllabus to see it here!
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/upload')}
                        >
                            Upload Now
                        </Button>
                    </Box>
                ) : (
                    <List>
                        {savedAnalyses.map((analysis, index) => (
                            <React.Fragment key={analysis._id}>
                                <ListItem
                                    secondaryAction={
                                        <Box>
                                            <Tooltip title="View Analysis">
                                                <IconButton edge="end" onClick={() => handleView(analysis)} sx={{ mr: 1 }}>
                                                    <VisibilityIcon color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Compare Version (Coming Soon)">
                                                <IconButton edge="end" sx={{ mr: 1 }} disabled>
                                                    <CompareIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton edge="end" onClick={() => removeAnalysis(analysis._id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    }
                                >
                                    <ListItemText
                                        primary={analysis.filename}
                                        secondary={`Analyzed on ${new Date(analysis.created_at).toLocaleDateString()} at ${new Date(analysis.created_at).toLocaleTimeString()}`}
                                        primaryTypographyProps={{ fontWeight: 'bold' }}
                                    />
                                </ListItem>
                                {index < savedAnalyses.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
};

export default HistoryPage;
