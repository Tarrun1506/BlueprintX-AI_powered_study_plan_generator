import React from 'react';
import { Container, Alert } from '@mui/material';
import StudyPlan from '../components/features/StudyPlan';
import { useAnalysis } from '../context/AnalysisContext';

const StudyPlanPage = () => {
    const { analysisResult } = useAnalysis();

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            {!analysisResult && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Please upload and analyze a syllabus first to generate a study plan.
                </Alert>
            )}
            <StudyPlan />
        </Container>
    );
};

export default StudyPlanPage;
