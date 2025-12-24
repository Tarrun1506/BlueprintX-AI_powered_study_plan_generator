import React, { useState } from 'react';
import {
    Typography, Box, List, ListItemText, Collapse, ListItemButton,
    IconButton, Tooltip, Checkbox
} from '@mui/material';
import {
    ExpandLess, ExpandMore, Quiz as QuizIcon, Chat as ChatIcon, YouTube as YouTubeIcon, Google as GoogleIcon
} from '@mui/icons-material';
import QuizModal from './QuizModal';
import TopicChat from './TopicChat';

export const TopicItem = ({ topic, level = 0, onToggle }) => {
    const [open, setOpen] = useState(level < 1);
    const [quizOpen, setQuizOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;

    const handleClick = () => {
        if (hasSubtopics) {
            setOpen(!open);
        }
    };

    const handleQuizClick = (e) => {
        e.stopPropagation();
        setQuizOpen(true);
    };

    const handleChatClick = (e) => {
        e.stopPropagation();
        setChatOpen(true);
    };

    const handleGoogleClick = (e) => {
        e.stopPropagation();
        window.open(`https://www.google.com/search?q=${encodeURIComponent(topic.name)}`, '_blank');
    };

    const handleYoutubeClick = (e) => {
        e.stopPropagation();
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(topic.name)}`, '_blank');
    };

    const getImportanceStyle = (importance) => {
        if (!importance) return { color: 'text.secondary', fontWeight: 400 };
        switch (importance.toLowerCase()) {
            case 'high': return { color: '#7c3535', fontWeight: 500 };
            case 'medium': return { color: '#6b5c2c', fontWeight: 500 };
            case 'low': return { color: '#32633d', fontWeight: 500 };
            default: return { color: 'text.secondary', fontWeight: 400 };
        }
    };

    return (
        <>
            <ListItemButton
                sx={{
                    pl: 2 + level * 2,
                    borderLeft: level > 0 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                    ml: level > 0 ? 1 : 0,
                    borderRadius: 1,
                    mb: 0.75,
                    transition: 'all 0.2s',
                    backgroundColor: level === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                }}
                onClick={handleClick}
                dense
            >
                <ListItemText
                    disableTypography
                    primary={
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            {/* Left Side: Checkbox + Name */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                                <Checkbox
                                    checked={!!topic.completed}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onToggle) onToggle(topic);
                                    }}
                                    size="small"
                                    sx={{
                                        p: 0.5,
                                        color: level === 0 ? 'primary.main' : 'text.secondary',
                                    }}
                                />
                                <Typography
                                    variant={level === 0 ? "subtitle1" : "body1"}
                                    fontWeight={level === 0 ? 600 : 400}
                                    noWrap
                                    sx={{
                                        color: level === 0 ? 'text.primary' : 'inherit',
                                        fontSize: level === 0 ? 16 : 15,
                                        textDecoration: topic.completed ? 'line-through' : 'none',
                                        opacity: topic.completed ? 0.7 : 1
                                    }}
                                >
                                    {topic.name}
                                </Typography>
                            </Box>

                            {/* Right Side: Meta Info + Actions */}
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                minWidth: 'fit-content',
                                justifyContent: 'flex-end',
                                ml: 2
                            }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        ...getImportanceStyle(topic.importance),
                                        fontSize: 13,
                                        letterSpacing: '0.02em',
                                    }}
                                >
                                    {topic.importance}
                                </Typography>
                                {topic.estimated_hours != null && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            fontSize: 13,
                                        }}
                                    >
                                        {topic.estimated_hours.toFixed(1)} hrs
                                    </Typography>
                                )}
                                {topic.scheduled_date && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#1a237e',
                                            fontWeight: 600,
                                            fontSize: 13,
                                            bgcolor: 'rgba(26, 35, 126, 0.08)',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1
                                        }}
                                    >
                                        {topic.scheduled_date}
                                    </Typography>
                                )}
                                {level > 0 && (
                                    <>
                                        <Tooltip title="Search on YouTube">
                                            <IconButton size="small" onClick={handleYoutubeClick} sx={{ ml: 1, color: '#FF0000' }}>
                                                <YouTubeIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Search on Google">
                                            <IconButton size="small" onClick={handleGoogleClick} sx={{ color: '#4285F4' }}>
                                                <GoogleIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={topic.completed ? "Take Quiz" : "Complete topic to unlock Quiz"}>
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    onClick={handleQuizClick}
                                                    disabled={!topic.completed}
                                                >
                                                    <QuizIcon fontSize="small" color={topic.completed ? "primary" : "disabled"} />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Chat with AI">
                                            <IconButton size="small" onClick={handleChatClick}>
                                                <ChatIcon fontSize="small" color="secondary" />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>
                        </Box>
                    }
                />
                {hasSubtopics && (
                    <Box sx={{ ml: 1 }}>
                        {open ?
                            <ExpandLess sx={{ color: 'text.secondary', fontSize: 18 }} /> :
                            <ExpandMore sx={{ color: 'text.secondary', fontSize: 18 }} />
                        }
                    </Box>
                )}
            </ListItemButton>

            {hasSubtopics && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {topic.subtopics.map((subtopic, index) => (
                            <TopicItem key={index} topic={subtopic} level={level + 1} onToggle={onToggle} />
                        ))}
                    </List>
                </Collapse>
            )}

            {/* Interactive Modals */}
            {quizOpen && (
                <QuizModal
                    open={quizOpen}
                    onClose={() => setQuizOpen(false)}
                    topic={topic}
                />
            )}
            {chatOpen && (
                <TopicChat
                    open={chatOpen}
                    onClose={() => setChatOpen(false)}
                    topic={topic}
                />
            )}
        </>
    );
};
