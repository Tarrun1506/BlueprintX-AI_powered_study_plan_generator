import React, { useState } from 'react';
import {
    Typography, Box, List, ListItemText, Collapse, ListItemButton
} from '@mui/material';
import {
    ExpandLess, ExpandMore
} from '@mui/icons-material';

export const TopicItem = ({ topic, level = 0 }) => {
    const [open, setOpen] = useState(level < 1);

    const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;

    const handleClick = () => {
        if (hasSubtopics) {
            setOpen(!open);
        }
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
                            <Typography
                                variant={level === 0 ? "subtitle1" : "body1"}
                                fontWeight={level === 0 ? 600 : 400}
                                sx={{
                                    color: level === 0 ? 'text.primary' : 'inherit',
                                    fontSize: level === 0 ? 16 : 15,
                                }}
                            >
                                {topic.name}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                minWidth: '120px',
                                justifyContent: 'flex-end'
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
                            <TopicItem key={index} topic={subtopic} level={level + 1} />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};
