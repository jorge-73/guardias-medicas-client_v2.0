import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signUp, errors: registerError, isAuthenticated } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    const res = await signUp(data);
    console.log(res);
    setValue("userName", "");
    setValue("email", "");
    setValue("password", "");

    if (res === undefined) navigate("/login");
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/calendar");
  }, [isAuthenticated]);

  return (
    <section className="vh-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div
            className="card bg-dark text-white"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-5 text-center">
              <form className="mb-md-5 mt-md-4 pb-5" onSubmit={onSubmit}>
                <h2 className="fw-bold mb-5">Formulario de Registro</h2>
                {registerError?.error && (
                  <div className="bg-danger p-2 text-center rounded mb-1">
                    {registerError.error}
                  </div>
                )}
                <div className="form-outline form-white mb-3">
                  <input
                    type="text"
                    id="userName"
                    className={`form-control form-control-lg mb-1 ${
                      registerError?.error && "border border-danger"
                    }`}
                    placeholder="nombre de usuario ..."
                    {...register("userName", { required: true })}
                  />
                  <label className="form-label fw-bold" htmlFor="email">
                    Nombre de Usuario
                  </label>
                </div>

                <div className="form-outline form-white mb-3">
                  <input
                    type="email"
                    id="email"
                    className={`form-control form-control-lg mb-1 ${
                      registerError?.error && "border border-danger"
                    }`}
                    placeholder="... gmail@gmail.com"
                    {...register("email", { required: true })}
                  />
                  <label className="form-label fw-bold" htmlFor="email">
                    Email
                  </label>
                </div>

                <div className="form-outline form-white mb-3">
                  <input
                    type="password"
                    id="password"
                    className={`form-control form-control-lg mb-1 ${
                      registerError?.error && "border border-danger"
                    }`}
                    placeholder="*******"
                    {...register("password", { required: true })}
                  />
                  <label className="form-label fw-bold" htmlFor="password">
                    Password
                  </label>
                </div>

                <button
                  className="btn btn-outline-light btn-lg px-5"
                  type="submit"
                >
                  Registrarse
                </button>
              </form>

              <div>
                <p className="mb-0">
                  Ya tienes una cuenta?{" "}
                  <Link to={"/login"} className="text-white-50 fw-bold">
                    Accede
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
