import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDoctors } from "../contexts/DoctorContext";
import { useEffect } from "react";
import { DoctorsTr } from "./DoctorsTr";

export const DoctorTable = () => {
  const { doctors, getDoctors } = useDoctors();
  useEffect(() => {
    getDoctors();
  }, []);
  return (
    <Row>
      <Col></Col>
      <Col xs={12}>
        <Table striped bordered hover variant="dark" className="text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Actividad</th>
              <td>Acciones</td>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 &&
              doctors.map((doctor, i) => (
                <DoctorsTr key={i} doctor={doctor} index={i} />
              ))}
          </tbody>
        </Table>
      </Col>
      <Col></Col>
    </Row>
  );
};
