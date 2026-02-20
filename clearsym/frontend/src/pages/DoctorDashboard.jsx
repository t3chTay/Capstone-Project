// same dashboard styling, no log tab, only overview and analytics
// mode = doctor, patientCode = localstorage...
import AppDashboard from "../AppDashboard";

export default function DoctorDashboard() {
  return <AppDashboard mode="doctor" />;
}
