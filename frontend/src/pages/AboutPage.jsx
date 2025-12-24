import React from 'react';
import {
    Typography,
    Container,
    Box,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Card,
    CardContent,
    useTheme,
} from '@mui/material';
import {
    Info,
    AutoAwesome,
    AssignmentTurnedIn,
    Search,
    Timeline,
    Psychology,
    Lightbulb,
    Schedule,
    TrendingUp,
    Rocket,
    BarChart,
    CloudUpload,
    MenuBook,
    VideoLibrary,
    Article,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const AboutPage = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Our Mission */}
            <Paper sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Info sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h4" component="h2">
                        Our Mission
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                    At BlueprintX, we believe that every student deserves clarity and focus in their academic journey.
                    By simply uploading your syllabus, our local AI provides a comprehensive analysis,
                    identifying key concepts, assessing topic importance, and estimating required study effort.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                    Our platform is built to help you prioritize your learning, making your exam preparation
                    more efficient and data-driven without your data ever leaving your machine.
                </Typography>
            </Paper>

            {/* How It Works Section */}
            <Paper sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 2 }}>
                <Typography variant="h4" component="h2" gutterBottom
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4,
                        color: theme.palette.primary.main,
                        fontWeight: 'bold'
                    }}
                >
                    <Timeline sx={{ mr: 2, fontSize: 40 }} /> How BlueprintX Works
                </Typography>

                <Box sx={{ position: 'relative', mb: 6 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 6, md: 2 },
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <CloudUpload sx={{ fontSize: 50, color: theme.palette.secondary.main }} />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Upload</Typography>
                            <Card elevation={3} sx={{ width: '100%', height: '100%', borderRadius: 2 }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography color="text.secondary">
                                        Upload your syllabus document (PDF, DOCX, or TXT) to our secure platform for instant analysis.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Psychology sx={{ fontSize: 50, color: theme.palette.secondary.main }} />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Analyze</Typography>
                            <Card elevation={3} sx={{ width: '100%', height: '100%', borderRadius: 2 }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography color="text.secondary">
                                        Our AI identifies key topics, assesses their importance, and estimates required study time.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <BarChart sx={{ fontSize: 50, color: theme.palette.secondary.main }} />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Prioritize</Typography>
                            <Card elevation={3} sx={{ width: '100%', height: '100%', borderRadius: 2 }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography color="text.secondary">
                                        Focus on high-impact topics identified by AI and organize your study sessions effectively.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Rocket sx={{ fontSize: 50, color: theme.palette.secondary.main }} />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Execute</Typography>
                            <Card elevation={3} sx={{ width: '100%', height: '100%', borderRadius: 2 }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography color="text.secondary">
                                        Use the generated insights to master your complex subjects and achieve academic excellence.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Core Features Section - Enhanced */}
            <Paper sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 2 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AutoAwesome sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} /> Core Features
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: { md: 1 }, minWidth: { md: '45%' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                                <AssignmentTurnedIn sx={{ color: theme.palette.secondary.main, fontSize: 30 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" gutterBottom>AI Syllabus Analysis</Typography>
                                <Typography color="text.secondary">
                                    Upload your syllabus to automatically extract topics, assess their importance, and estimate required study time. Our advanced AI identifies key concepts and helps you understand what to prioritize.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: { md: 1 }, minWidth: { md: '45%' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                                <Psychology sx={{ color: theme.palette.secondary.main, fontSize: 30 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" gutterBottom>Local Privacy First</Typography>
                                <Typography color="text.secondary">
                                    All syllabus analysis is performed locally on your machine using advanced Llama and Gemma models. Your data never touches the cloud.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: { md: 1 }, minWidth: { md: '45%' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                                <TrendingUp sx={{ color: theme.palette.secondary.main, fontSize: 30 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" gutterBottom>Priority Weighting</Typography>
                                <Typography color="text.secondary">
                                    Our AI detects "priority topics" across your syllabus, highlighting the sections that require the most attention or carry the most weight.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Benefits Section */}
            <Paper sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 2 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Lightbulb sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} /> Benefits for Students
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Box sx={{ flex: { md: 1 } }}>
                        <Card elevation={1} sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                                    <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} /> Improved Efficiency
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Save valuable time by focusing on what matters most. Our AI helps you prioritize topics based on importance and complexity.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: { md: 1 } }}>
                        <Card elevation={1} sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                                    <BarChart sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} /> Structured Approach
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Transform overwhelming syllabi into manageable, organized study plans. Follow a clear path to exam success with logical learning sequences.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: { md: 1 } }}>
                        <Card elevation={1} sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                                    <Psychology sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} /> Data Privacy
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Your syllabus stayed on your computer. We use local AI models to ensure total privacy for your documents.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Paper>

            {/* Future Roadmap */}
            <Paper sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 2 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Rocket sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} /> Future Roadmap
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    We're constantly working to improve BlueprintX. Here's what's coming next:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon><AutoAwesome sx={{ color: theme.palette.secondary.main }} /></ListItemIcon>
                        <ListItemText
                            primary="Deeper Topic Extraction"
                            secondary="More granular breakdown of sub-topics for even better planning."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><AutoAwesome sx={{ color: theme.palette.secondary.main }} /></ListItemIcon>
                        <ListItemText
                            primary="Export to PDF/CSV"
                            secondary="Download your analysis results to keep them handy for offline study."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><AutoAwesome sx={{ color: theme.palette.secondary.main }} /></ListItemIcon>
                        <ListItemText
                            primary="Integrated Notes"
                            secondary="Take notes directly against each topic while you study."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><AutoAwesome sx={{ color: theme.palette.secondary.main }} /></ListItemIcon>
                        <ListItemText
                            primary="Mobile Application"
                            secondary="Access BlueprintX on-the-go with our upcoming mobile app."
                        />
                    </ListItem>
                </List>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        component={RouterLink}
                        to="/"
                        size="large"
                    >
                        Start Your Study Journey Today
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AboutPage;
