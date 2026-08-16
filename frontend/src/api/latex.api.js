import apiClient from './client';

export const latexApi = {
  getResumeLatex: async (resumeId) => {
    const response = await apiClient.get(`/resumes/${resumeId}/latex`);
    return response.data.data; // { currentLatex, latexHash }
  },

  updateResumeLatex: async (resumeId, latex) => {
    const response = await apiClient.put(`/resumes/${resumeId}/latex`, { latex });
    return response.data.data; // { currentLatex, latexHash }
  },

  generateLatex: async (resumeId) => {
    const response = await apiClient.post(`/latex/resumes/${resumeId}/generate`);
    return response.data.data; // { resumeId, latex, latexHash }
  },

  compileRawLatex: async (latex) => {
    const response = await apiClient.post('/latex/compile', { latex });
    return response.data.data;
  },
};
