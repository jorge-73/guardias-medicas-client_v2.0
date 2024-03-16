import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDoctors } from "../contexts/DoctorContext";

export const DoctorsTr = ({ doctor, index }) => {
  const { deleteDoctor } = useDoctors();
  const navigate = useNavigate();
  const num = index + 1;

  const deleteDoc = () => {
    deleteDoctor(doctor._id);
    navigate("/doctors");
  };
  return (
    <tr>
      <td>{num}</td>
      <td>{doctor.firstName}</td>
      <td>{doctor.lastName}</td>
      <td>{doctor.activity}</td>
      <td>
        <Link
          to={`/doctors/${doctor._id}`}
          className="btn btn-info fw-bold mx-2"
        >
          Editar
        </Link>
        <Button variant="danger" className="fw-bold mx-2" onClick={deleteDoc}>
          Eliminar
        </Button>
      </td>
    </tr>
  );
};
