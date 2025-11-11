import "../index.css";
import "./StackDashboard.css";
import { StackMetrics } from "../../components/StackMetrics";

const StackDashboardExtension = () => {
  return (
    <div className="layout-container">
      <StackMetrics />
    </div>
  );
};

export default StackDashboardExtension;
