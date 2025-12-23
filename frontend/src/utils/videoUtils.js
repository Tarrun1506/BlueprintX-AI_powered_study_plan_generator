/**
 * Extracts the YouTube video ID from various URL formats.
 * @param {string} url - The YouTube URL.
 * @returns {string|null} - The video ID or null if not found.
 */
export const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Returns the thumbnail URL for a YouTube video ID.
 * @param {string} videoId - The YouTube video ID.
 * @param {string} size - The size of the thumbnail ('default', 'mqdefault', 'hqdefault').
 * @returns {string} - The thumbnail URL.
 */
export const getYouTubeThumbnail = (videoId, size = 'mqdefault') => {
    return videoId ? `https://img.youtube.com/vi/${videoId}/${size}.jpg` : '';
};
