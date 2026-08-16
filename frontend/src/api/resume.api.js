import apiClient from './client';

export const resumeApi = {
  getUserResumes: async () => {
    const response = await apiClient.get('/resumes');
    return response.data.data.resumes;
  },

  getResume: async (id) => {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data.data.resume;
  },

  createResume: async (data) => {
    const response = await apiClient.post('/resumes', data);
    return response.data.data.resume;
  },

  updateResume: async (id, data) => {
    const response = await apiClient.put(`/resumes/${id}`, data);
    return response.data.data.resume;
  },

  deleteResume: async (id) => {
    const response = await apiClient.delete(`/resumes/${id}`);
    return response.data;
  },

  compileResume: async (id, latex) => {
    const response = await apiClient.post(`/resumes/${id}/compile`, { latex });
    return response.data;
  },

  compileSavedLatex: async (id) => {
    const response = await apiClient.post(`/resumes/${id}/compile-saved`);
    return response.data;
  },

  generateAndCompileResume: async (id) => {
    const response = await apiClient.post(`/resumes/${id}/generate-and-compile`);
    return response.data.data;
  },

  getResumeFiles: async (id) => {
    const response = await apiClient.get(`/resumes/${id}/files`);
    return response.data.data.files;
  },

  downloadFile: async (id, fileId, filename = 'resume.pdf') => {
    const response = await apiClient.get(`/resumes/${id}/files/${fileId}/download`, {
      responseType: 'blob',
    });
    
    // Create blob link and trigger download in browser
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
