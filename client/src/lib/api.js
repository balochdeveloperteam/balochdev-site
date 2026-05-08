/** Use empty string in dev so Vite proxy `/api` → Node (see vite.config.js). */
export const apiUrl = (path) => `${import.meta.env.VITE_API_URL || ''}${path}`;
