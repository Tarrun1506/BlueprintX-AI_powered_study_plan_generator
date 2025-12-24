import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Paper, Grid, Button, Divider
} from '@mui/material';
import {
    Assessment, CheckCircle, Schedule, LibraryBooks, UploadFile, TrendingUp
} from '@mui/icons-material';
import { useAnalysis } from '../context/AnalysisContext';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const { savedAnalyses } = useAnalysis();

    // Aggregate statistics
    const stats = useMemo(() => {
        let completed = 0;
        let pending = 0;
        let totalHours = 0;
        const courseStats = [];

        savedAnalyses.forEach(analysis => {
            const result = analysis.analysis_result;
            if (!result || !result.topics) return;

            let courseCompleted = 0;
            let coursePending = 0;

            const countTopics = (topics) => {
                topics.forEach(topic => {
                    const hours = topic.estimated_hours || 0;
                    totalHours += hours;

                    if (topic.completed) {
                        completed++;
                        courseCompleted++;
                    } else {
                        pending++;
                        coursePending++;
                    }

                    if (topic.subtopics && topic.subtopics.length > 0) {
                        countTopics(topic.subtopics);
                    }
                });
            };

            countTopics(result.topics);

            const displayName = analysis.filename.length > 15
                ? analysis.filename.substring(0, 15) + '...'
                : analysis.filename;

            courseStats.push({
                name: displayName,
                fullName: analysis.filename,
                completed: courseCompleted,
                pending: coursePending,
                total: courseCompleted + coursePending,
                percentage: courseCompleted + coursePending > 0
                    ? Math.round((courseCompleted / (courseCompleted + coursePending)) * 100)
                    : 0
            });
        });

        const total = completed + pending;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            completed,
            pending,
            total,
            totalHours: totalHours.toFixed(1),
            completionRate,
            courseStats,
            totalCourses: savedAnalyses.length
        };
    }, [savedAnalyses]);

    const COLORS = ['#4caf50', '#ff9800'];

    const pieData = [
        { name: 'Completed', value: stats.completed },
        { name: 'Pending', value: stats.pending },
    ];

    return (
        <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header */}
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                                Dashboard
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Track your learning progress and stay organized
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<UploadFile />}
                            onClick={() => navigate('/upload')}
                        >
                            New Upload
                        </Button>
                    </Box>
                </Box>
            </Container>

            {stats.total > 0 ? (
                <Container maxWidth="lg">
                    <Grid container spacing={3}>
                        {/* Left Column */}
                        <Grid item xs={12} lg={4}>
                            {/* Stats Card */}
                            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                                    Quick Stats
                                </Typography>

                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LibraryBooks sx={{ mr: 1.5, color: 'primary.main', fontSize: 22 }} />
                                            <Typography variant="body1" color="text.secondary">
                                                Total Topics
                                            </Typography>
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {stats.total}
                                        </Typography>
                                    </Box>
                                    <Divider />

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CheckCircle sx={{ mr: 1.5, color: 'success.main', fontSize: 22 }} />
                                            <Typography variant="body1" color="text.secondary">
                                                Completed
                                            </Typography>
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold" color="success.main">
                                            {stats.completed}
                                        </Typography>
                                    </Box>
                                    <Divider />

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Schedule sx={{ mr: 1.5, color: 'warning.main', fontSize: 22 }} />
                                            <Typography variant="body1" color="text.secondary">
                                                Pending
                                            </Typography>
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold" color="warning.main">
                                            {stats.pending}
                                        </Typography>
                                    </Box>
                                    <Divider />

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Assessment sx={{ mr: 1.5, color: 'info.main', fontSize: 22 }} />
                                            <Typography variant="body1" color="text.secondary">
                                                Study Hours
                                            </Typography>
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold" color="info.main">
                                            {stats.totalHours}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Pie Chart */}
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
                                    Progress Overview
                                </Typography>
                                <Box sx={{ height: 280 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                                    <Typography variant="h3" fontWeight="bold" color="primary">
                                        {stats.completionRate}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Overall Completion
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} lg={8}>
                            <Paper sx={{ p: 4, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                    <TrendingUp sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
                                    <Typography variant="h6" fontWeight="600">
                                        Course Progress Breakdown
                                    </Typography>
                                </Box>

                                <Box sx={{ height: 450, mb: 4 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={stats.courseStats}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                            layout="vertical"
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={150}
                                                tick={{ fontSize: 13 }}
                                            />
                                            <RechartsTooltip />
                                            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '20px' }} />
                                            <Bar dataKey="completed" name="Completed" fill="#4caf50" radius={[0, 4, 4, 0]} />
                                            <Bar dataKey="pending" name="Pending" fill="#ff9800" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>

                                {/* Detailed Breakdown */}
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                                        Detailed Breakdown
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {stats.courseStats.map((course, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                                                    <Typography variant="body2" fontWeight="600" noWrap sx={{ mb: 1.5 }}>
                                                        {course.fullName}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {course.completed} of {course.total} topics
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight="700" color="primary">
                                                            {course.percentage}%
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            ) : (
                <Container maxWidth="sm">
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
                        <LibraryBooks sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
                        <Typography variant="h5" fontWeight="600" gutterBottom>
                            No Data Yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            Upload your first syllabus to start tracking your progress
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<UploadFile />}
                            onClick={() => navigate('/upload')}
                        >
                            Upload Syllabus
                        </Button>
                    </Paper>
                </Container>
            )}
        </Box>
    );
};

export default Dashboard;
