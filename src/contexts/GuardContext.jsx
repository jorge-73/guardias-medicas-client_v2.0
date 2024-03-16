import { createContext, useContext, useState } from "react";
import {
  createGuardRequest,
  createPaymentRequest,
  deleteGuardRequest,
  getGuardsByIdRequest,
  getGuardsDateRequest,
  getGuardsRequest,
  getPaymentRequest,
  updateGuardRequest,
  updatePaymentRequest,
} from "../api/guards";

const GuardsContext = createContext();

export const useGuards = () => {
  const context = useContext(GuardsContext);
  if (!context)
    throw new Error("useGuards must be used within a GuardProvider");
  return context;
};

const GuardProvider = ({ children }) => {
  const [guards, setGuards] = useState([]);
  const [guardsDate, setGuardsDate] = useState([]);
  const [payment, setPayment] = useState({});
  const [errors, setErrors] = useState([]);

  const getGuards = async () => {
    try {
      const res = await getGuardsRequest();
      setGuards(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const getGuardsDate = async (data) => {
    try {
      const res = await getGuardsDateRequest(data);
      setGuardsDate(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const getGuardById = async (id) => {
    try {
      const res = await getGuardsByIdRequest(id);
      return res.data.payload;
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const createGuard = async (data) => {
    try {
      await createGuardRequest(data);
      const res = await getGuardsRequest();
      setGuards(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const updateGuard = async (id, data) => {
    try {
      await updateGuardRequest(id, data);
      const res = await getGuardsRequest();
      setGuards(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const deleteGuard = async (id) => {
    try {
      await deleteGuardRequest(id);
      const res = await getGuardsRequest();
      setGuards(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const getGuardsByDoctorId = async (doctorId) => {
    try {
      // Filtra las guardias por el id del medico
      const filteredGuards = guards.filter(
        (guard) => guard.doctor === doctorId
      );
      return filteredGuards;
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
  };

  const getPayment = async () => {
    try {
      const res = await getPaymentRequest();
      setPayment(res.data.payload);
      return res.data.payload;
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  const createPayment = async (data) => {
    try {
      await createPaymentRequest(data);
      const res = await getPaymentRequest();
      setPayment(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  const updatePayment = async (id, data) => {
    try {
      await updatePaymentRequest(id, data);
      const res = await getPaymentRequest();
      setPayment(res.data.payload);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  return (
    <GuardsContext.Provider
      value={{
        guards,
        guardsDate,
        errors,
        setErrors,
        getGuards,
        getGuardsDate,
        getGuardById,
        createGuard,
        updateGuard,
        deleteGuard,
        getGuardsByDoctorId,
        payment,
        getPayment,
        createPayment,
        updatePayment,
      }}
    >
      {children}
    </GuardsContext.Provider>
  );
};

export default GuardProvider;