import * as api from "../services/api";

// This hook provides access to the API service functions.
export const useApi = () => {
    return {
        uploadSyllabus: api.uploadSyllabus,
    };
};
