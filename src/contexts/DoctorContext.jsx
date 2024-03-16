import { createContext, useContext, useState } from "react";
import {
  getDoctorsRequest,
  getDoctorByIdRequest,
  createDoctorRequest,
  deleteDoctorRequest,
  updateDoctorRequest,
} from "../api/doctors";

const DoctorsContext = createContext();

export const useDoctors = () => {
  const context = useContext(DoctorsContext);
  if (!context)
    throw new Error("useDoctors must be used within a DoctorProvider");
  return context;
};

const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState("");

  const getDoctors = async () => {
    try {
      const res = await getDoctorsRequest();
      setDoctors(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const getDoctorById = async (id) => {
    try {
      const res = await getDoctorByIdRequest(id);
      return res.data.payload;
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const createDoctor = async (data) => {
    try {
      await createDoctorRequest(data);
      const res = await getDoctorsRequest();
      setDoctors(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const updateDoctor = async (id, data) => {
    try {
      await updateDoctorRequest(id, data);
      const res = await getDoctorsRequest();
      setDoctors(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await deleteDoctorRequest(id);
      const res = await getDoctorsRequest();
      setDoctors(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  return (
    <DoctorsContext.Provider
      value={{
        doctors,
        errors,
        setErrors,
        getDoctors,
        getDoctorById,
        createDoctor,
        updateDoctor,
        deleteDoctor,
      }}
    >
      {children}
    </DoctorsContext.Provider>
  );
};

export default DoctorProvider;