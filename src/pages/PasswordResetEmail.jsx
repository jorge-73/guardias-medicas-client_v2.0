import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PasswordResetEmail = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { passwordReset, errors: authErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const res = await passwordReset(data);

    if (res) {
      navigate("/login");
    }

    setValue("email", "");
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
              <form className="mb-md-5 mt-md-4 pb-3" onSubmit={onSubmit}>
                <h2 className="fw-bold mb-5">Restablecimiento de Contraseña</h2>
                {authErrors?.error && (
                  <div className="bg-danger p-2 text-center rounded mb-1">
                    {authErrors.error}
                  </div>
                )}
                <div className="form-outline form-white mb-3">
                  <input
                    type="email"
                    id="email"
                    className={`form-control form-control-lg mb-1`}
                    placeholder="... gmail@gmail.com"
                    {...register("email", { required: true })}
                  />
                  <label className="form-label fw-bold" htmlFor="email">
                    Email
                  </label>
                </div>
                <button
                  className="btn btn-outline-light btn-lg px-5"
                  type="submit"
                >
                  Enviar
                </button>
              </form>
              <div className="d-flex justify-content-center text-center">
                <h5>
                  Escribe tu correo electrónico para enviarte el enlace de
                  recuperación de contraseña
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordResetEmail;
