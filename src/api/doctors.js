import axios from "./axios";

export const getDoctorsRequest = async () => axios.get("/doctors");
export const getDoctorByIdRequest = async (id) => axios.get(`/doctors/${id}`);
export const createDoctorRequest = async (data) => axios.post("/doctors", data);
export const updateDoctorRequest = async (id, data) => axios.put(`/doctors/${id}`, data);
export const deleteDoctorRequest = async (id) => axios.delete(`/doctors/${id}`);
