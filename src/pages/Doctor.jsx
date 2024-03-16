import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDoctors } from "../contexts/DoctorContext";
import { useState, useEffect } from "react";
import { DoctorTable } from "../components/DoctorTable";
import { useAuth } from "../contexts/AuthContext";
import { Payments } from "../components/Payments";

const DoctorPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    errors: doctorError,
    setErrors,
    createDoctor,
    getDoctorById,
    updateDoctor,
  } = useDoctors();
  const { user } = useAuth();
  const params = useParams();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    user.role === "user" && navigate("/calendar");
    if (params.id) {
      const getDoctor = async () => {
        const res = await getDoctorById(params.id);
        setValue("genderDoctor", res.genderDoctor);
        setValue("firstName", res.firstName);
        setValue("lastName", res.lastName);
        setValue("activity", res.activity);
        setValue("email", res.email);
      };
      getDoctor();
    }
    if (!params.id) {
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("activity", "");
      setValue("email", "");
    }
  }, [params.id]);

  useEffect(() => {
    // Si hay un nuevo error, configuramos la alerta y mostramos el mensaje
    if (doctorError) {
      const timer = setTimeout(() => {
        setShow(false);
        setErrors("");
      }, 5000);
      // Limpia el temporizador cuando el componente se desmonta
      return () => clearTimeout(timer);
    }
  }, [doctorError]); // Escucha cambios en doctorError

  const onSubmit = handleSubmit(async (data) => {
    params.id
      ? (updateDoctor(params.id, data), navigate("/doctors"))
      : createDoctor(data);
    setValue("genderDoctor", "Selección del género");
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("activity", "");
    setValue("email", "");
  });

  return (
    <Container>
      <h1 className="text-center py-1">
        Lista de médicos y precio de guardias
      </h1>
      <Row>
        <Col xs={12} md={9}>
          <Form
            className="col-md-8 offset-md-2 p-4 my-3 bg-secondary rounded-3 text-white"
            onSubmit={onSubmit}
          >
            {doctorError?.error ? (
              <Alert variant="danger" onClose={() => setShow(true)} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                <h5 className="text-center text-dark fw-bold">
                  {doctorError.error}
                </h5>
              </Alert>
            ) : (
              ""
            )}
            <Form.Group className="mb-3" controlId="genderDoctor">
              <Form.Label>Género</Form.Label>
              <Form.Select {...register("genderDoctor", { required: true })}>
                <option value="dra">Dra</option>
                <option value="dr">Dr</option>
              </Form.Select>
              {errors.genderDoctor && (
                <p className="formError fw-bold mt-1">El campo es requerido</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del médico"
                {...register("firstName", { required: true })}
                className={errors.firstName ? "error-input" : ""}
              />
              {errors.firstName && (
                <p className="formError fw-bold mt-1">El campo es requerido</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el apellido del médico..."
                {...register("lastName", { required: true })}
                className={errors.lastName ? "error-input" : ""}
              />
              {errors.lastName && (
                <p className="formError fw-bold mt-1">El campo es requerido</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="activity">
              <Form.Label>Actividad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el apellido del médico..."
                {...register("activity", { required: true })}
                className={errors.activity ? "error-input" : ""}
              />
              {errors.activity && (
                <p className="formError fw-bold mt-1">El campo es requerido</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese el email del médico..."
                {...register("email", { required: true })}
                className={errors.lastName ? "error-input" : ""}
              />
              {errors.email && (
                <p className="formError fw-bold mt-1">El campo es requerido</p>
              )}
            </Form.Group>

            {params.id ? (
              <Button variant="info" type="submit" className="mx-1">
                Actualizar
              </Button>
            ) : (
              <Button variant="success" type="submit">
                Guardar
              </Button>
            )}
          </Form>
        </Col>
        <Col xs={12} md={3}>
          <Payments />
        </Col>
      </Row>
      <Row>
        <DoctorTable />
      </Row>
    </Container>
  );
};

export default DoctorPage;
