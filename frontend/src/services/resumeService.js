import api from "./api";

export const uploadResume = (formData) =>
    api.post("/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
