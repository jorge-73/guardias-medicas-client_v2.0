import axios from "./axios";

export const registerRequest = (user) => axios.post("/register", user);
export const loginRequest = (user) => axios.post("/login", user);
export const loginGoogleRequest = () => axios.get("/auth/google");
export const logoutRequest = () => axios.post("/logout");
export const verifyTokenRequest = () => axios.get("/verify");
export const passwordResetRequest = (data) => axios.post("/passwordReset", data);
export const sendNewPasswordRequest = (tid, data) => axios.post(`/changePassword/${tid}`, data);