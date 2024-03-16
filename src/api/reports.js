import axios from "./axios";

export const getReportMonthRequest = async (month, year) => {
  const url = `/reports/reportMonth?month=${month}&year=${year}`;
  return axios.get(url);
};
export const getReportByIdRequest = async (id) => axios.get(`/reports/${id}`);
export const createReportRequest = async (data) => axios.post("/reports", data);
export const updateReportRequest = async (id, data) => axios.put(`/reports/${id}`, data);
export const deleteReportRequest = async (id) => axios.delete(`/reports/${id}`);