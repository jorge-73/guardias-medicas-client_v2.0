import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { useForm } from "react-hook-form";
import { useGuards } from "../contexts/GuardContext";

export const Payments = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    payment,
    getPayment,
    createPayment,
    updatePayment,
    errors: paymentError,
  } = useGuards();
  const [show, setShow] = useState(false);

  useEffect(() => {
    getPayment();
  }, [handleSubmit]);

  const onSubmit = handleSubmit(async (data) => {
    // Parsear los valores de pago como números con decimales (si corresponde)
    const paymentHolidaysAndWeekend = parseFloat(
      data.paymentHolidaysAndWeekend
    );
    const paymentBusinessDay = parseFloat(data.paymentBusinessDay);

    // const existingPayment = await getPayment();
    payment
      ? updatePayment(payment._id, {
          paymentHolidaysAndWeekend,
          paymentBusinessDay,
        })
      : createPayment({ paymentHolidaysAndWeekend, paymentBusinessDay });
    setValue("paymentHolidaysAndWeekend", "");
    setValue("paymentBusinessDay", "");
  });

  return (
    <div>
      <Form
        className="p-4 my-3 bg-secondary rounded-3 text-white"
        onSubmit={onSubmit}
      >
        {paymentError?.error ? (
          <Alert variant="danger" onClose={() => setShow(true)} dismissible>
            <Alert.Heading>Error!</Alert.Heading>
            <h5 className="text-center text-dark fw-bold">
              {paymentError.error}
            </h5>
          </Alert>
        ) : (
          ""
        )}
        <Form.Group className="mb-3" controlId="paymentHolidaysAndWeekend">
          <Form.Label>Feriados y Fin de Semana</Form.Label>
          <Form.Control
            type="number"
            placeholder="Valor hs guardias feriados y fin de Semanas..."
            {...register("paymentHolidaysAndWeekend", { required: true })}
          />
          {errors.paymentHolidaysAndWeekend && (
            <p className="formError fw-bold mt-1">El campo es requerido</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="paymentBusinessDay">
          <Form.Label>Dias Hábiles</Form.Label>
          <Form.Control
            type="number"
            placeholder="Valor hs guardias dias Hábiles..."
            {...register("paymentBusinessDay", { required: true })}
          />
          {errors.paymentBusinessDay && (
            <p className="formError fw-bold mt-1">El campo es requerido</p>
          )}
        </Form.Group>

        <Button variant="success" type="submit" className="d-block mx-auto">
          Guardar
        </Button>
      </Form>

      <Table striped bordered hover variant="dark" className="text-center">
        <thead>
          <tr>
            <th>Feriados y Fin de Semana</th>
            <th>Dias Hábiles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$ {payment?.paymentHolidaysAndWeekend || 0}</td>
            <td>$ {payment?.paymentBusinessDay || 0}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
