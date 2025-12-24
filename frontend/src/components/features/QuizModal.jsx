import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Radio, RadioGroup, FormControlLabel,
    Box, CircularProgress, Alert
} from '@mui/material';
import axios from 'axios';

const QuizModal = ({ open, onClose, topic }) => {
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && topic) {
            generateQuiz();
        } else {
            // Reset state on close
            setQuizData(null);
            setCurrentQuestion(0);
            setScore(0);
            setShowResult(false);
            setLoading(false);
        }
    }, [open, topic]);

    const generateQuiz = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8000/api/interactive/quiz', {
                topic_name: topic.name,
                topic_context: JSON.stringify(topic), // Send minimal context
                difficulty: "Medium"
            });

            if (response.data && response.data.questions) {
                setQuizData(response.data);
            } else {
                setError("Failed to generate valid quiz data.");
            }
        } catch (err) {
            setError("Error generating quiz. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = () => {
        const question = quizData.questions[currentQuestion];
        if (selectedAnswer === question.correct_answer) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < quizData.questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer('');
        } else {
            setShowResult(true);
        }
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Quiz: {topic?.name}
            </DialogTitle>
            <DialogContent dividers>
                {loading && (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                )}

                {error && <Alert severity="error">{error}</Alert>}

                {!loading && !showResult && quizData && (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                            Question {currentQuestion + 1} of {quizData.questions.length}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {quizData.questions[currentQuestion].text}
                        </Typography>
                        <RadioGroup
                            value={selectedAnswer}
                            onChange={(e) => setSelectedAnswer(e.target.value)}
                        >
                            {quizData.questions[currentQuestion].options.map((option, idx) => (
                                <FormControlLabel
                                    key={idx}
                                    value={option}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                )}

                {showResult && (
                    <Box textAlign="center" p={2}>
                        <Typography variant="h4" color="primary" gutterBottom>
                            Score: {score} / {quizData?.questions.length}
                        </Typography>
                        <Typography variant="body1">
                            {score === quizData?.questions.length ? "Excellent!" : "Good effort! Review the material and try again."}
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                {!loading && !showResult && quizData && (
                    <Button
                        variant="contained"
                        onClick={handleAnswer}
                        disabled={!selectedAnswer}
                    >
                        {currentQuestion + 1 === quizData.questions.length ? "Finish" : "Next"}
                    </Button>
                )}
                {showResult && (
                    <Button variant="contained" onClick={generateQuiz}>
                        Try Again
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default QuizModal;
