import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

const ChangePassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { sendNewPassword, errors: authErrors } = useAuth();

  const handlePassword1Toggle = () => setShowPassword1(!showPassword1);
  const handlePassword2Toggle = () => setShowPassword2(!showPassword2);

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      const res = await sendNewPassword(params.id, data);

      setValue("password1", "");
      setValue("password2", "");

      if (!authErrors.error) {
        navigate("/login");
      }
    }
  });

  return (
    <section className="vh-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div
            className="card bg-dark text-white"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-5 text-center">
              <Form onSubmit={onSubmit}>
                <h2 className="mb-4">Cambio de Contraseña</h2>
                {authErrors?.error && (
                  <div className="bg-danger p-2 text-center rounded mb-1">
                    {authErrors.error}
                  </div>
                )}
                <Form.Label>Ingrese su nueva contraseña</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type={showPassword1 ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    {...register("password1", { required: true })}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handlePassword1Toggle}
                  >
                    {showPassword1 ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputGroup>

                <Form.Label>Confirme su nueva contraseña</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type={showPassword2 ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    {...register("password2", { required: true })}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handlePassword2Toggle}
                  >
                    {showPassword2 ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputGroup>

                <Button variant="primary" type="submit">
                  Enviar
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
