import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
// import LogoGoogle from "../assets/google.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    signIn,
    // signInGoogle,
    isAuthenticated,
    errors: loginError,
  } = useAuth();

  const onSubmit = handleSubmit(async (data) => {
    await signIn(data);

    setValue("email", "");
    setValue("password", "");
  });

 /*  const handleSignInGoogle = async () => {
    await signInGoogle();
  }; */

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
                <h2 className="fw-bold mb-5">Formulario de Acceso</h2>
                {loginError?.error && (
                  <div className="bg-danger p-2 text-center rounded mb-1">
                    {loginError.error}
                  </div>
                )}
                <div className="form-outline form-white mb-3">
                  <input
                    type="email"
                    id="email"
                    className={`form-control form-control-lg mb-1 ${
                      loginError?.error && "border border-danger"
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
                      loginError?.error && "border border-danger"
                    }`}
                    placeholder="*******"
                    {...register("password", { required: true })}
                  />
                  <label className="form-label fw-bold" htmlFor="password">
                    Password
                  </label>
                </div>

                <p className="small mb-5 pb-lg-2">
                  <Link className="text-white h6 fw-bold" to={"/passwordReset"}>
                    Olvidaste tu contraseña ?
                  </Link>
                </p>

                <button
                  className="btn btn-outline-light btn-lg px-5"
                  type="submit"
                >
                  Ingresar
                </button>

                {/* <p className="d-block text-center mt-4">O Ingresar con: </p> */}
                {/* <div className="d-flex justify-content-center text-center pt-1">
                  <button
                    onClick={handleSignInGoogle}
                    className="btn btn-light fw-bold text-dark mx-1 d-flex"
                  >
                    <img
                      src={LogoGoogle}
                      style={{ width: "1.5rem" }}
                      alt="logo google"
                    />{" "}
                    Google
                  </button>
                </div> */}
              </form>

              <div>
                <p className="mb-0">
                  No tienes una cuenta?{" "}
                  <Link to={"/register"} className="text-white-50 fw-bold">
                    Registrate
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

export default LoginPage;
