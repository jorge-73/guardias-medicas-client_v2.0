import { createContext, useContext, useState } from "react";
import {
  getReportMonthRequest,
  getReportByIdRequest,
  createReportRequest,
  updateReportRequest,
  deleteReportRequest,
} from "../api/reports";

const ReportsContext = createContext();

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context)
    throw new Error("useReports must be used within a ReportProvider");
  return context;
};

const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [errors, setErrors] = useState([]);

  const getReportMonth = async (month, year) => {
    try {
      const res = await getReportMonthRequest(month, year);
      setReports(res.data.payload);
    } catch (error) {
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  const getReportById = async (id) => {
    try {
      const res = await getReportByIdRequest(id);
      return res.data.payload;
    } catch (error) {
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  const createReport = async (data) => {
    try {
      await createReportRequest(data);
      // setGuards(res.data.payload);
    } catch (error) {
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  const updateReport = async (id, data) => {
    try {
      const res = await updateReportRequest(id, data);
      setReports(res.data.payload);
    } catch (error) {
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  const deleteReport = async (id) => {
    try {
      await deleteReportRequest(id);
    } catch (error) {
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        errors,
        getReportMonth,
        getReportById,
        createReport,
        updateReport,
        deleteReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export default ReportProvider;