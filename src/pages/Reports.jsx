import { useEffect, React } from "react";
import { useReports } from "../contexts/ReportContext";
import { useGuards } from "../contexts/GuardContext";
import Table from "react-bootstrap/esm/Table";
import Button from "react-bootstrap/Button";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";
dayjs.extend(utc);
dayjs.locale("es");

const ReportsPage = () => {
  const { reports, getReportMonth } = useReports();
  const { payment, getPayment } = useGuards();

  useEffect(() => {
    const currentMonth = dayjs().format("MMMM");
    const currentYear = dayjs().year();

    const fetchMonthlyReport = async () => {
      try {
        await getReportMonth(currentMonth, currentYear);
      } catch (error) {
        console.error("Error al obtener el informe mensual:", error);
      }
    };
    fetchMonthlyReport();
    getPayment();
  }, []);

  const exportToExcel = () => {
    // Tu tabla de datos
    const data = [];

    // Agrega el título que abarque toda la tabla
    data.push([
      `Informe Mensual mes de ${reports[0].month} del ${reports[0].year}`,
    ]); // Esto crea una fila con solo el título

    // Agrega los encabezados de columna
    const headers = [
      "Médico",
      "Actividad",
      "Horas Días Hábiles",
      "Total Días Hábiles",
      "Horas fin de sem. y feriados",
      "Total fin de sem. y feriados",
      "Total Horas",
      "Total a Cobrar",
    ];

    data.push(headers);

    // Agrega los datos de la tabla
    reports[0]?.doctorReports.forEach((report) => {
      const preHolidaysAndWeekend = report.doctorGuards.filter((guard) => {
        return guard.holiday || ["sábado", "domingo"].includes(guard.weekday);
      });
      const holidaysAndWeekend = preHolidaysAndWeekend.reduce(
        (total, guard) => total + guard.hours,
        0
      );

      const preBusinessDay = report.doctorGuards.filter((guard) => {
        return !guard.holiday && !["sábado", "domingo"].includes(guard.weekday);
      });
      const businessDay = preBusinessDay.reduce(
        (total, guard) => total + guard.hours,
        0
      );

      const totalHolidaysAndWeekend =
        holidaysAndWeekend * payment?.paymentHolidaysAndWeekend;
      const totalBusinessDay = businessDay * payment?.paymentBusinessDay;

      const row = [
        `${report.doctor.firstName} ${report.doctor.lastName}`,
        "",
        businessDay,
        totalBusinessDay,
        holidaysAndWeekend,
        totalHolidaysAndWeekend,
        report.totalHours,
        report.totalToCharge,
      ];

      data.push(row);
    });

    // Crea una hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();

    // Agrega la hoja de cálculo al libro
    XLSX.utils.book_append_sheet(wb, ws, "Informe Mensual");

    // Crea un archivo XLSX
    XLSX.writeFile(wb, "informe-mensual.xlsx");
  };

  return (
    <>
      <h1 className="text-center text-white my-3">Informe Mensual</h1>
      <Table striped bordered hover variant="dark" className="text-center">
        <thead>
          <tr>
            <th>Médico</th>
            <th>Actividad</th>
            <th>Horas Días Hábiles</th>
            <th>Total $ Días Hábiles</th>
            <th>Horas fin de sem. y feriados</th>
            <th>Total $ fin de sem. y feriados</th>
            <th>Total Horas</th>
            <th>Total a Cobrar</th>
          </tr>
        </thead>
        <tbody>
          {reports[0]?.doctorReports.map((report, index) => {
            const preHolidaysAndWeekend = report.doctorGuards.filter(
              (guard) => {
                return (
                  guard.holiday || ["sábado", "domingo"].includes(guard.weekday)
                );
              }
            );
            const holidaysAndWeekend = preHolidaysAndWeekend.reduce(
              (total, guard) => total + guard.hours,
              0
            );

            const preBusinessDay = report.doctorGuards.filter((guard) => {
              return (
                !guard.holiday && !["sábado", "domingo"].includes(guard.weekday)
              );
            });
            const businessDay = preBusinessDay.reduce(
              (total, guard) => total + guard.hours,
              0
            );

            const totalholidaysAndWeekend =
              holidaysAndWeekend * payment?.paymentHolidaysAndWeekend;

            const totalBusinessDay = businessDay * payment?.paymentBusinessDay;

            return (
              <tr key={index}>
                <td>
                  {report.doctor.firstName} {report.doctor.lastName}
                </td>
                <td>{report.doctor.activity}</td>
                <td>{businessDay}</td>
                <td>${totalBusinessDay}</td>
                <td>{holidaysAndWeekend}</td>
                <td>${totalholidaysAndWeekend}</td>
                <td>{report.totalHours}</td>
                <td>${report.totalToCharge}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="text-center">
        {/* <Button variant="primary" className="fw-bold col-md-2 offset-md-1">
          Enviar por Email
        </Button> */}
        <Button
          variant="success"
          className="fw-bold col-md-2 offset-md-1"
          onClick={exportToExcel}
        >
          Exportar a Excel
        </Button>
        {/* <Button variant="secondary" className="fw-bold col-md-2 offset-md-1">
          Exportar a PDF
        </Button> */}
      </div>
    </>
  );
};

export default ReportsPage;
