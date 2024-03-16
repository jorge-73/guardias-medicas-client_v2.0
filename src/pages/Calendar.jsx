import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timegridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useForm } from "react-hook-form";
import { FormOptionDoctor } from "../components/FormOptionDoctor";
import { useAuth } from "../contexts/AuthContext";
import { useDoctors } from "../contexts/DoctorContext";
import { useGuards } from "../contexts/GuardContext";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");
dayjs.extend(weekday);

const CalendarPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [clickedDayOfWeek, setClickedDayOfWeek] = useState(null);
  const { doctors, getDoctors, getDoctorById } = useDoctors();
  const { user } = useAuth();
  const {
    guards,
    errors: guardError,
    setErrors,
    getGuards,
    getGuardById,
    createGuard,
    updateGuard,
    deleteGuard,
  } = useGuards();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getData = async () => {
      await getDoctors();
      await getGuards();
    };
    getData();
  }, []);

  useEffect(() => {
    // Mapear las guardias y obtener los detalles del médico
    const formattedEvents = guards.map(async (guard) => {
      const doctorDetails = await getDoctorById(guard.doctor);
      return {
        id: guard._id,
        title: `${doctorDetails.genderDoctor} ${doctorDetails.firstName} ${doctorDetails.lastName}`,
        hours: `${guard.hours}`,
        sector: `${guard.sector}`,
        start: guard.date,
        end: guard.date,
      };
    });

    // Una vez que se obtienen los detalles de los médicos, establecer los eventos
    Promise.all(formattedEvents).then((eventData) => {
      setEvents(eventData);
    });
  }, [guards, getDoctorById]);

  const onSubmit = handleSubmit(async (data) => {
    // Formatear la fecha en el formato deseado sin información de zona horaria
    const formatDate = data.date
      ? dayjs(data.date).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD"); // Si no se proporciona una fecha, usa la fecha actual
    const dataValid = {
      ...data,
      date: formatDate,
      weekday: clickedDayOfWeek || data.weekday,
    };
    dataValid.hours = parseInt(dataValid.hours);
    let res;
    try {
      params.id
        ? (res = await updateGuard(params.id, dataValid))
        : (res = await createGuard(dataValid));

      if (res?.error?.length > 0 || res?.error?.length > 0) {
        setShow(true);
      } else {
        setValue("date", "");
        setValue("doctor", "");
        setValue("hours", "");
        setValue("sector", "");
        setShow(false);
        setShowModal(false);
        setErrors([]); // Limpia guardError
        navigate("/calendar");
      }
    } catch (error) {
      console.error(error.response.data);
    }
  });
  
  const handleDateClick = (e) => {
    if (user.role === "admin") {
      setValue("date", e.dateStr);
      setValue("hours", 1);
      setShowModal(true);
      const getDayName = (date) => {
        return dayjs(date).format("dddd");
      };
      setClickedDayOfWeek(getDayName(e.dateStr));
    }
  };

  const handleCloseModal = () => {
    setValue("date", "");
    setValue("doctor", "");
    setValue("hours", "");
    setValue("sector", "");

    navigate("/calendar");
    setShow(false);
    setShowModal(false);
  };

  // Define una función para manejar la edición de eventos según el rol
  const handleEventEdit = (eventInfo) => {
    if (user.role === "admin") {
      // Permite editar eventos si el usuario es un administrador
      eventClick(eventInfo);
    }
  };
  // Restringe las capacidades de edición según el rol del usuario
  const editable = user.role === "admin";

  const eventClick = async (eventInfo) => {
    navigate(`/calendar/${eventInfo.event._def.publicId}`);
    const res = await getGuardById(eventInfo.event._def.publicId);
    // Convertir la fecha a la zona horaria correcta antes de mostrarla
    const fechaConvertida = dayjs(res.date).utc();
    setValue("date", fechaConvertida.format("YYYY-MM-DD"));
    setValue("doctor", res.doctor._id);
    setValue("hours", res.hours);
    setValue("sector", res.sector);
    setShowModal(true);
  };

  const onDelete = async (id) => {
    await deleteGuard(id);
    navigate("/calendar");
    setShowModal(false);
  };

  return (
    <Container fluid className="text-white mt-1 p-3">
      <FullCalendar
        plugins={[dayGridPlugin, timegridPlugin, interactionPlugin]}
        locale={esLocale}
        timeZone="America/Buenos_Aires"
        headerToolbar={{
          left: "prev next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventDisplay="block"
        displayEventTime={false}
        events={events}
        editable={editable} // Define si el calendario es editable según el rol
        eventClick={(eventInfo) => handleEventEdit(eventInfo)}
        eventContent={(eventInfo) => {
          eventInfo.borderColor = "transparent";
          return (
            <div
              className={`text-center my-1 py-1 event-container
            ${
              eventInfo.event.extendedProps.sector === "Habitaciones Comunes"
                ? "bg-success"
                : "bg-primary"
            }`}
              id={eventInfo.event.id}
              style={{ cursor: "pointer" }}
            >
              <span className="event-title">{eventInfo.event.title}</span>
              <br />
              <span className="event-hours">
                {eventInfo.event.extendedProps.hours} horas
              </span>
              <br />
              <span className="event-sector">
                {eventInfo.event.extendedProps.sector}
              </span>
            </div>
          );
        }}
      />

      {/* Modal de Bootstrap */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark fw-bold">
            Guardias Médicas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {guardError?.error?.length > 0 && (
            <Alert variant="danger" onClose={() => setShow(true)} dismissible>
              <Alert.Heading>Error!</Alert.Heading>
              <p className="error-message">{guardError.error}</p>
            </Alert>
          )}
          <Form
            className="p-4 bg-secondary rounded-3 text-white"
            onSubmit={onSubmit}
          >
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="date" {...register("date")} />
              {errors.date && (
                <p className="error-message">{errors.date.message}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="doctor">
              <Form.Label>Selección del médico</Form.Label>
              <Form.Select
                {...register("doctor")}
                style={{ cursor: "pointer" }}
                required
              >
                {doctors.map((doctor, i) => (
                  <FormOptionDoctor key={i} doctor={doctor} />
                ))}
              </Form.Select>
              {errors.doctor && (
                <p className="error-message">{errors.doctor.message}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="hours">
              <Form.Label>Horas</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={24}
                {...register("hours")}
                placeholder="Ingrese la cantidad de horas..."
              ></Form.Control>
              {errors.hours && (
                <p className="error-message">{errors.hours.message}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="sector">
              <Form.Label>Selección del sector</Form.Label>
              <Form.Select
                {...register("sector")}
                style={{ cursor: "pointer" }}
              >
                <option value="Unidades Cerradas">Unidades Cerradas</option>
                <option value="Habitaciones Comunes">
                  Habitaciones Comunes
                </option>
              </Form.Select>
              {errors.sector && (
                <p className="error-message">{errors.sector.message}</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="holiday">
              <Form.Check
                type="switch"
                id="holiday"
                label="Dia feriado"
                {...register("holiday")}
              />
            </Form.Group>
            {params.id ? (
              <>
                <Button variant="info" type="submit" className="mx-1">
                  Actualizar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(params.id)}
                  className="mx-1"
                >
                  Eliminar
                </Button>
              </>
            ) : (
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CalendarPage;