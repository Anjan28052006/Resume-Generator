import apiClient from './client';

export const versionApi = {
  getVersions: async (resumeId) => {
    const response = await apiClient.get(`/resumes/${resumeId}/versions`);
    return response.data.data.versions;
  },

  restoreVersion: async (resumeId, versionNumber) => {
    const response = await apiClient.post(`/resumes/${resumeId}/versions/${versionNumber}/restore`);
    return response.data.data.resume;
  },
};
