import React from 'react';
import { Container } from '@mui/material';
import SyllabusUpload from '../components/features/SyllabusUpload';

const SyllabusUploadPage = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <SyllabusUpload />
        </Container>
    );
};

export default SyllabusUploadPage;
