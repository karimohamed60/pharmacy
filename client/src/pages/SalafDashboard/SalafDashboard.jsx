import { Outlet } from "react-router-dom";
import SalafList from "../../components/SalafDashboard/SalafList/SalafList";

const SalafDashboard = () => {
  return (
    <>
          <Outlet />
      {/* Sidebar */}
      <SalafList />
    </>
  );
};

export default SalafDashboard;
