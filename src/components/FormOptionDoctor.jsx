export const FormOptionDoctor = ({ doctor }) => {
  return (
    <>
      <option value={doctor._id}>
        {doctor.genderDoctor}. {doctor.firstName} {doctor.lastName}
      </option>
    </>
  );
};
