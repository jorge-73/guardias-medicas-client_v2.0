import axios from "./axios";

export const getGuardsRequest = async () => axios.get("/guards");
export const getGuardsDateRequest = async (data) => {
  const url = `/guards?startDate=${data.startDate}&endDate=${data.endDate}`;
  return axios.get(url);
};
export const getGuardsByIdRequest = async (id) => axios.get(`/guards/${id}`);
export const createGuardRequest = async (data) => axios.post("/guards", data);
export const updateGuardRequest = async (id, data) => axios.put(`/guards/${id}`, data);
export const deleteGuardRequest = async (id) => axios.delete(`/guards/${id}`);

export const getPaymentRequest = async () => axios.get("/payments");
export const createPaymentRequest = async (data) => axios.post("/payments", data);
export const updatePaymentRequest = async (id, data) => axios.put(`/payments/${id}`, data);