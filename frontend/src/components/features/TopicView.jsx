import React, { useState, useEffect } from 'react';
import {
    Typography, Box, List, ListItemText, Collapse, ListItemButton,
    Card, CardContent, CardActions, Button, CircularProgress, Alert
} from '@mui/material';
import {
    ExpandLess, ExpandMore, Article as ArticleIcon,
    UploadFile as UploadFileIcon, PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { useApi } from '../../hooks/useApi';
import { getYouTubeId, getYouTubeThumbnail } from '../../utils/videoUtils';

// Helper component to display recommended resources
const RecommendedResourceItem = ({ resource }) => {
    const youtubeId = resource.type === 'video' ? getYouTubeId(resource.url) : null;
    const thumbnailUrl = youtubeId ? getYouTubeThumbnail(youtubeId) : null;

    return (
        <Card variant="outlined" sx={{
            mb: 1,
            boxShadow: 'none',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            transition: 'all 0.2s',
            overflow: 'hidden',
            '&:hover': {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                borderColor: 'rgba(25, 118, 210, 0.3)',
            }
        }}>
            {thumbnailUrl && (
                <Box sx={{ position: 'relative', pt: '56.25%', bgcolor: '#000' }}>
                    <img
                        src={thumbnailUrl}
                        alt={resource.title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <PlayArrowIcon />
                    </Box>
                </Box>
            )}
            <CardContent sx={{ pb: 1, pt: 1.5 }}>
                <Typography variant="subtitle2" component="div" fontWeight={600} gutterBottom>
                    {resource.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {resource.explanation}
                </Typography>
            </CardContent>
            <CardActions sx={{ pt: 0, justifyContent: 'flex-end', pb: 1 }}>
                <Button
                    size="small"
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={youtubeId ? <ArticleIcon /> : <UploadFileIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: 12,
                    }}
                >
                    {youtubeId ? 'Watch Video' : 'Read Article'}
                </Button>
            </CardActions>
        </Card>
    );
};

export const TopicItem = ({ topic, level = 0 }) => {
    const [open, setOpen] = useState(level < 1);
    const [loadingResources, setLoadingResources] = useState(false);
    const [resourceError, setResourceError] = useState(null);
    const [resources, setResources] = useState(null);
    const { getCuratedResourcesForTopic } = useApi();

    const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
    const isLeafTopic = !hasSubtopics;

    useEffect(() => {
        const autoFetch = async () => {
            if (isLeafTopic && !resources && !loadingResources && (topic.importance?.toLowerCase() === 'high' || topic.isPriority)) {
                setLoadingResources(true);
                setResourceError(null);
                try {
                    const result = await getCuratedResourcesForTopic(topic.name);
                    if (result.error) throw new Error(result.error);
                    setResources(result);
                    if (level === 0) setOpen(true);
                } catch (err) {
                    setResourceError(err.message || 'Failed to fetch resources.');
                } finally {
                    setLoadingResources(false);
                }
            }
        };
        autoFetch();
    }, [isLeafTopic, topic.name, topic.importance, topic.isPriority, getCuratedResourcesForTopic]);

    const handleClick = async () => {
        if (isLeafTopic) {
            if (!resources && !loadingResources) {
                setLoadingResources(true);
                setResourceError(null);
                try {
                    const result = await getCuratedResourcesForTopic(topic.name);
                    if (result.error) throw new Error(result.error);
                    setResources(result);
                } catch (err) {
                    setResourceError(err.message || 'Failed to fetch resources.');
                } finally {
                    setLoadingResources(false);
                }
            }
        } else {
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
            {isLeafTopic && open && (
                <Box sx={{
                    pl: 4 + level * 2,
                    pr: 2,
                    pb: 2,
                    ml: level > 0 ? 1 : 0,
                    mt: 1,
                    borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
                    borderBottomLeftRadius: 4,
                }}>
                    {loadingResources && <CircularProgress size={16} sx={{ color: 'text.secondary', ml: 1 }} />}
                    {resourceError && (
                        <Alert severity="error" variant="outlined" sx={{ mt: 1 }}>
                            {resourceError}
                        </Alert>
                    )}
                    {resources && (
                        <Box sx={{ mt: 1 }}>
                            {resources.videos.length > 0 && (
                                <>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ mt: 1, mb: 1, fontWeight: 500, color: '#455a64' }}
                                    >
                                        Recommended Videos
                                    </Typography>
                                    {resources.videos.map((video, index) => (
                                        <RecommendedResourceItem key={index} resource={video} />
                                    ))}
                                </>
                            )}
                            {resources.articles.length > 0 && (
                                <>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ mt: 1, mb: 1, fontWeight: 500, color: '#455a64' }}
                                    >
                                        Recommended Articles
                                    </Typography>
                                    {resources.articles.map((article, index) => (
                                        <RecommendedResourceItem key={index} resource={article} />
                                    ))}
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </>
    );
};
