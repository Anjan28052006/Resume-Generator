import apiClient from './client';

export const aiApi = {
  generateStandaloneSummary: async (data) => {
    const response = await apiClient.post('/ai/summary', data);
    return response.data.data.summary;
  },

  generateResumeSummary: async (resumeId) => {
    const response = await apiClient.post(`/ai/resumes/${resumeId}/summary`);
    return response.data.data.resume;
  },

  improveText: async (resumeId, text, section) => {
    const response = await apiClient.post(`/ai/resumes/${resumeId}/improve`, {
      text,
      section,
    });
    return response.data.data; // { originalText, improvedText }
  },
};
