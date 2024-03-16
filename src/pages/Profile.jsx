import { useEffect, useState } from "react";
import { useDoctors } from "../contexts/DoctorContext";
import { useGuards } from "../contexts/GuardContext";
import { useReports } from "../contexts/ReportContext";
import Table from "react-bootstrap/esm/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

const ProfilePage = () => {
  const { user } = useAuth();
  const { getDoctors, doctors } = useDoctors();
  const { payment, getPayment, getGuards, getGuardsDate, guards, guardsDate } =
    useGuards();
  const { createReport } = useReports();
  const [searchedDoctorProfiles, setSearchedDoctorProfiles] = useState([]);
  const [doctorsTotalHours, setDoctorsTotalHours] = useState(0);
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await getDoctors();
      await getGuards();
      await getPayment();
      // Aquí, establece una búsqueda predeterminada cuando el componente se carga
      const firstDayOfThisMonth = dayjs().startOf("month").format("YYYY-MM-DD");
      const lastDayOfThisMonth = dayjs().endOf("month").format("YYYY-MM-DD");
      const date = {
        startDate: firstDayOfThisMonth,
        endDate: lastDayOfThisMonth,
      };
      await getGuardsDate(date);
    };
    getData();
  }, []);

  useEffect(() => {
    // Iterar sobre la lista de médicos y obtener las guardias de cada uno
    const profiles = doctors.map((doctor) => {
      const doctorGuards = guardsDate.filter(
        (guard) => guard.doctor === doctor._id
      );

      // Calcular la suma total de las horas de las guardias del médico
      const totalHours = doctorGuards.reduce(
        (acc, guard) => acc + guard.hours,
        0
      );
      // Calcular el total a cobrar para cada médico
      const totalToCharge = doctorGuards.reduce((acc, guard) => {
        // Obtener el valor de pago correspondiente al día de la guardia
        const dayPayment =
          guard.weekday === "sábado" ||
          guard.weekday === "domingo" ||
          guard.holiday === true
            ? payment?.paymentHolidaysAndWeekend
            : payment?.paymentBusinessDay;

        // Calcular el monto a cobrar por esta guardia
        const guardTotal = guard.hours * dayPayment;

        return acc + guardTotal;
      }, 0);

      return {
        doctor,
        doctorGuards,
        totalHours,
        totalToCharge,
      };
    });
    const total = profiles.reduce((acc, guard) => acc + guard.totalHours, 0);
    setDoctorsTotalHours(total);
    setSearchedDoctorProfiles(profiles);
  }, [doctors, guards, guardsDate, payment]);

  const onSubmit = handleSubmit(async (data) => {
    const startDateFormatted = dayjs(data.startDate).format("YYYY-MM-DD");
    const endDateFormatted = dayjs(data.endDate).format("YYYY-MM-DD");

    const date = {
      startDate: startDateFormatted,
      endDate: endDateFormatted,
    };

    await getGuardsDate(date);

    const profiles = doctors.map((doctor) => {
      const doctorGuards = guardsDate.filter(
        (guard) => guard.doctor === doctor._id
      );

      // Calcular la suma total de las horas de las guardias del médico
      const totalHours = doctorGuards.reduce(
        (acc, guard) => acc + guard.hours,
        0
      );
      // Calcular el total a cobrar para cada médico
      const totalToCharge = doctorGuards.reduce((acc, guard) => {
        // Obtener el valor de pago correspondiente al día de la guardia
        const dayPayment =
          guard.weekday === "sábado" ||
          guard.weekday === "domingo" ||
          guard.holiday === true
            ? payment?.paymentHolidaysAndWeekend
            : payment?.paymentBusinessDay;

        // Calcular el monto a cobrar por esta guardia
        const guardTotal = guard.hours * dayPayment;

        return acc + guardTotal;
      }, 0);

      return {
        doctor,
        doctorGuards,
        totalHours,
        totalToCharge,
      };
    });
    const total = profiles.reduce((acc, guard) => acc + guard.totalHours, 0);
    setDoctorsTotalHours(total);
    setSearchedDoctorProfiles(profiles);
    setValue("startDate", "");
    setValue("endDate", "");
  });

  const generateReport = async (docProfiles) => {
    let month;
    let year;
    let doctorReports = [];
    docProfiles.map((profile) => {
      if (profile.doctorGuards.length > 0) {
        const modifiedDoctorGuards = profile.doctorGuards.map((guard) => {
          const { _id, ...guardWithoutId } = guard;
          return guardWithoutId;
        });
        // Extraer el ID del doctor
        const doctor = profile.doctor._id;

        // Crear una nueva estructura de informe
        const doctorReport = {
          doctor, // ID del doctor
          doctorGuards: modifiedDoctorGuards,
          totalHours: profile.totalHours,
          totalToCharge: profile.totalToCharge,
        };

        doctorReports.push(doctorReport);

        // Establecer el mes y el año si aún no se han establecido
        if (!month || !year) {
          month = dayjs(profile.doctorGuards[0].date).format("MMMM");
          year = dayjs(profile.doctorGuards[0].date).get("year");
        }
      }
    });

    const report = { month, year, doctorReports };

    try {
      await createReport(report);
      navigate("/reports");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="text-center text-white my-3">
        Informe Parcial Guardias Médicas
      </h1>
      {user?.role === "admin" ? (
        <Form className="d-md-inline-flex p-3" onSubmit={onSubmit}>
          <Form.Control
            type="date"
            placeholder="Search"
            className="me-2"
            name="startDate"
            {...register("startDate", { required: true })}
          />
          <Form.Control
            type="date"
            placeholder="Search"
            className="me-2"
            name="endDate"
            {...register("endDate", { required: true })}
          />
          <Button variant="outline-success" className="fw-bold" type="submit">
            Buscar
          </Button>
        </Form>
      ) : (
        ""
      )}
      {searchedDoctorProfiles.map(
        (profile, i) =>
          (user.role === "admin" || user.email === profile.doctor.email) &&
          profile.totalHours > 0 && (
            <Table
              striped
              bordered
              hover
              variant="dark"
              className="text-center"
              key={i}
            >
              <thead>
                <tr>
                  <th colSpan={6}>
                    <h4>
                      {profile.doctor.genderDoctor}. {profile.doctor.firstName}{" "}
                      {profile.doctor.lastName}
                    </h4>
                  </th>
                </tr>
              </thead>
              <tbody>
                {profile.doctorGuards.map((guard, j) => (
                  <tr key={j}>
                    <td>{j + 1}</td>
                    <td colSpan={2}>{guard.sector}</td>
                    <td>{guard.weekday}</td>
                    <td>
                      {dayjs
                        .tz(guard.date, "America/Buenos_Aires")
                        .format("DD/MM/YYYY")}
                    </td>
                    <td>{guard.hours} hs</td>
                  </tr>
                ))}
                <tr>
                  <td> </td>
                  <td colSpan={2}>Total de horas trabajadas</td>
                  <td colSpan={2}>{profile.totalHours} hs</td>
                  <td> </td>
                </tr>
                <tr>
                  <td> </td>
                  <td colSpan={2}>Total a cobrar</td>
                  <td colSpan={2}>${profile.totalToCharge.toFixed(2)}</td>
                  <td> </td>
                </tr>
              </tbody>
            </Table>
          )
      )}
      {doctorsTotalHours > 0 && user.role === "admin" && (
        <div className="pb-3">
          <Button
            variant="light"
            className="d-block mx-auto px-5"
            onClick={() => generateReport(searchedDoctorProfiles)}
          >
            Guardar Informe
          </Button>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
