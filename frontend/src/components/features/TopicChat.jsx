import React, { useState, useRef, useEffect } from 'react';
import {
    Drawer, Box, Typography, TextField, IconButton,
    List, ListItem, Paper, CircularProgress
} from '@mui/material';
import { Send, Close, SmartToy, Person } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const TopicChat = ({ open, onClose, topic }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (open && topic) {
            setMessages([{
                sender: 'ai',
                text: `Hello! I'm your study assistant. Ask me anything about "${topic.name}".`
            }]);
        }
    }, [open, topic]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/interactive/chat', {
                topic_context: JSON.stringify(topic),
                user_query: userMsg
            });

            setMessages(prev => [...prev, { sender: 'ai', text: response.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error responding to that." }]);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
        >
            <Box display="flex" flexDirection="column" height="100%">
                {/* Header */}
                <Box p={2} borderBottom="1px solid #eee" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                        Chat: {topic?.name}
                    </Typography>
                    <IconButton onClick={onClose} edge="end">
                        <Close />
                    </IconButton>
                </Box>

                {/* Messages Area */}
                <Box flex={1} p={2} sx={{ overflowY: 'auto', bgcolor: '#f5f5f5' }}>
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 1
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '85%',
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                                        borderRadius: 2
                                    }}
                                >
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </Paper>
                            </ListItem>
                        ))}
                        {loading && (
                            <ListItem sx={{ justifyContent: 'flex-start' }}>
                                <Paper elevation={0} sx={{ p: 1, bgcolor: 'white', borderRadius: 2 }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <SmartToy fontSize="small" color="action" />
                                        <Typography variant="caption" color="text.secondary">Thinking...</Typography>
                                    </Box>
                                </Paper>
                            </ListItem>
                        )}
                        <div ref={bottomRef} />
                    </List>
                </Box>

                {/* Input Area */}
                <Box p={2} borderTop="1px solid #eee" bgcolor="white">
                    <Box display="flex" gap={1}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={loading}
                        />
                        <IconButton
                            color="primary"
                            disabled={!input.trim() || loading}
                            onClick={handleSend}
                        >
                            <Send />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
};

export default TopicChat;
