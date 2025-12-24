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
    Avatar
} from '@mui/material';
import {
    Info,
    AutoAwesome,
    AssignmentTurnedIn,
    Timeline,
    Psychology,
    Lightbulb,
    TrendingUp,
    Rocket,
    BarChart,
    CloudUpload,
    School,
    Schedule,
    Insights
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const AboutPage = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Mission Section */}
            <Paper sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Info sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h4" component="h2" fontWeight="bold">
                        Our Mission
                    </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                    We believe that success isn't just about working hard—it's about working smart.
                    BlueprintX transforms the overwhelming chaos of raw syllabi into a clear, actionable roadmap.
                    By harnessing the power of local AI (Llama 3.2), we provide a personalized study schedule
                    that respects your time and adapts to your learning pace, ensuring you walk into every exam with confidence.
                </Typography>
            </Paper>

            {/* How It Works Section */}
            <Paper sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 2 }}>
                <Typography variant="h4" component="h2" gutterBottom
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 6,
                        color: theme.palette.primary.main,
                        fontWeight: 'bold'
                    }}
                >
                    <Timeline sx={{ mr: 2, fontSize: 40 }} /> How BlueprintX Works
                </Typography>

                <Box sx={{ position: 'relative', mb: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: { xs: 6, md: 2 },
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {/* Step 1: Upload */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'secondary.main' }}>
                                <CloudUpload sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>1. Upload</Typography>
                            <Card elevation={3} sx={{ width: '100%', height: '100%', borderRadius: 2, textAlign: 'center' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography color="text.secondary">
                                        Drag & drop your syllabus (PDF, DOCX, TXT). Our system instantly processes the text.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Step 2: Analyze */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'secondary.main' }}>
                                <Psychology sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>2. Analyze</Typography>
                            <Card elevation={3} sx={{ width: '100%', height: '100%', borderRadius: 2, textAlign: 'center' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography color="text.secondary">
                                        AI breaks it down into granular topics, identifying key concepts and estimating study hours.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Step 3: Schedule */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'secondary.main' }}>
                                <Schedule sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>3. Schedule</Typography>
                            <Card elevation={3} sx={{ width: '100%', height: '100%', borderRadius: 2, textAlign: 'center' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography color="text.secondary">
                                        We generate a day-by-day calendar plan based on your exam date and daily availability.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* Step 4: Master */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'secondary.main' }}>
                                <School sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>4. Master</Typography>
                            <Card elevation={3} sx={{ width: '100%', height: '100%', borderRadius: 2, textAlign: 'center' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography color="text.secondary">
                                        Chat with AI tutors for each topic and take quizzes to verify your knowledge.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Core Features Section */}
            <Paper sx={{ p: { xs: 3, md: 4 }, mb: 5, borderRadius: 2 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <AutoAwesome sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} /> Core Features
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap', gap: 4 }}>
                    <Box sx={{ flex: { md: 1 }, minWidth: { md: '45%' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                                <AssignmentTurnedIn sx={{ color: theme.palette.secondary.main, fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Smart Scheduling</Typography>
                                <Typography color="text.secondary">
                                    Don't just get a list. Get a plan. Our algorithmic scheduler distributes topics evenly, ensuring you cover everything without burnout before the big day.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: { md: 1 }, minWidth: { md: '45%' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                                <Psychology sx={{ color: theme.palette.secondary.main, fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Interactive AI Tutor</Typography>
                                <Typography color="text.secondary">
                                    Stuck on "Thermodynamics"? Click "Chat" to ask specific questions. Finished "Calculus"? Take an AI-generated quiz to prove your mastery.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: { md: 1 }, minWidth: { md: '45%' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                                <TrendingUp sx={{ color: theme.palette.secondary.main, fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Progress Tracking</Typography>
                                <Typography color="text.secondary">
                                    Watch your completion stats grow. Our Dashboard gives you a bird's-eye view of your progress across all your courses with beautiful charts.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: { md: 1 }, minWidth: { md: '45%' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
                                <Insights sx={{ color: theme.palette.secondary.main, fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Privacy First</Typography>
                                <Typography color="text.secondary">
                                    We use local LLMs (Llama 3.2 via Ollama) for analysis. Your personal documents are analyzed securely on your machine, not the cloud.
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
                        <Card elevation={1} sx={{ height: '100%', borderColor: 'primary.light', borderTop: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                    <TrendingUp sx={{ mr: 1, fontSize: 24 }} /> Efficiency
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Stop wasting time planning *what* to study. Open your dashboard and see exactly what needs to be done today.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: { md: 1 } }}>
                        <Card elevation={1} sx={{ height: '100%', borderColor: 'secondary.light', borderTop: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                    <BarChart sx={{ mr: 1, fontSize: 24 }} /> Clarity
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Turn a 50-page PDF into a clean checklist. Know exactly how many hours are left and track your velocity.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ flex: { md: 1 } }}>
                        <Card elevation={1} sx={{ height: '100%', borderColor: 'warning.light', borderTop: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ color: 'warning.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                                    <Psychology sx={{ mr: 1, fontSize: 24 }} /> Mastery
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Don't just read—interact. Our AI tutors ensure you actually understand the concepts before moving on.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Paper>

            {/* Call to Action */}
            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Ready to ace your exams?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                    Join thousands of students who are reclaiming their time and optimizing their grades with BlueprintX.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/"
                    size="large"
                    sx={{ px: 5, py: 1.5, borderRadius: 50, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                    Get Started Now
                </Button>
            </Paper>
        </Container>
    );
};

export default AboutPage;
