import { Outlet } from "react-router-dom";
import SalafList from "../../components/SalafDashboard/SalafList/SalafList";

const SalafDashboard = () => {
  return (
    <>
      <Outlet />
      <SalafList />
    </>
  );
};

export default SalafDashboard;
