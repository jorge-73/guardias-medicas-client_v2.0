import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NavbarPage = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav
      className="navbar navbar-expand-md bg-dark border-bottom border-body"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link to={"/"} className="navbar-brand">
          Inicio
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMarkup"
          aria-controls="navbarMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMarkup">
          <div className="navbar-nav w-100 justify-content-between">
            <div className="d-flex flex-column flex-md-row">
              {isAuthenticated && (
                <>
                  <NavLink to={"/calendar"} className={"nav-link fw-bold"}>
                    Calendario
                  </NavLink>
                  {user.role === "admin" && (
                    <NavLink to={"/doctors"} className={"nav-link fw-bold"}>
                      Médicos
                    </NavLink>
                  )}

                  <NavLink to={"/profile"} className={"nav-link fw-bold"}>
                    {user.role !== "admin" ? "Mi Perfil" : "Perfiles"}
                  </NavLink>
                </>
              )}
              {user && isAuthenticated && (
                <span className="nav-link p-2 fw-bold">{`Bienvenido ${
                  user?.user?.userName || user?.userName
                }`}</span>
              )}
            </div>

            <div className="d-flex flex-sm-column flex-md-row">
              {!isAuthenticated && (
                <>
                  <NavLink to={"/login"} className={"nav-link fw-bold"}>
                    Acceder
                  </NavLink>
                  <NavLink to={"/register"} className={"nav-link fw-bold"}>
                    Registrar
                  </NavLink>
                </>
              )}
              {isAuthenticated && (
                <Link
                  className="nav-link text-danger fw-bold"
                  onClick={() => logout()}
                >
                  Salir
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPage;
