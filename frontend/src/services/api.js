const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (!isMultipart) {
        headers["Content-Type"] = "application/json";
    }
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

/**
 * Uploads a syllabus file to the backend for analysis.
 */
export const uploadSyllabus = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_BASE_URL}/syllabus/upload`, {
            method: "POST",
            headers: getHeaders(true),
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in uploadSyllabus:', error);
        throw error;
    }
};

/**
 * Saves an analysis result to the database.
 */
export const saveAnalysis = async (analysisData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(analysisData),
        });

        if (!response.ok) {
            throw new Error(`Failed to save analysis: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in saveAnalysis:', error);
        throw error;
    }
};

/**
 * Fetches all saved analyses.
 */
export const fetchAnalyses = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/`, {
            headers: getHeaders()
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch analyses: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in fetchAnalyses:', error);
        throw error;
    }
};

/**
 * Deletes a saved analysis.
 */
export const deleteAnalysis = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        if (!response.ok) {
            throw new Error(`Failed to delete analysis: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error in deleteAnalysis:', error);
        throw error;
    }
};

/**
 * Updates an existing analysis.
 */
export const updateAnalysis = async (id, analysisData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(analysisData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update analysis: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in updateAnalysis:', error);
        throw error;
    }
};

/**
 * Generates a study schedule for a saved analysis.
 */
export const generateSchedule = async (id, params) => {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/${id}/schedule`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Schedule generation failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in generateSchedule:', error);
        throw error;
    }
};
