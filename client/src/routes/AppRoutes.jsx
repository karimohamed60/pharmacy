import { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "../auth/Login";
import InventoryDashboard from "../pages/InventoryDashboard/InventoryDashboard";
import PharmacyDashboard from "../pages/PharmacyDashboard/PharmacyDashboard";
import NotFound from "../pages/NotFound";
import PrivateRoutes from "./PrivateRoutes";
import { getUserRole } from "../services/roleService";
import { isAuthenticated } from "../services/authService";
import redirectUser from "../services/redirectUser";
import AddMedicine from "../components/InventoryDashboard/Medicines/addmedicine/addmedicine";
import Medicinelist from "../components/InventoryDashboard/Medicines/medicinelist/medicinelist";
import Medicinedetails from "../components/InventoryDashboard/Medicines/medicinedetails/medicinedetails";
import LogoutButton from "../auth/LogoutButton";
import Categorylist from "../components/InventoryDashboard/Categories/categoryList/categorylist";
import Suppliers from "../components/InventoryDashboard/Suppliers/suppliers";
import TransferDetails from "../components/InventoryDashboard/Transfers/TransferDetails/TransferDetails";
import TransferList from "../components/InventoryDashboard/Transfers/TransferList/TransferList";
import UpdateDetails from "../components/InventoryDashboard/Transfers/UpdateDetails/UpdateDetails";
import InvoicesList from "../components/InventoryDashboard/Invoices/InvoicesList/InvoicesList";
import AddInvoice from "../components/InventoryDashboard/Invoices/AddInvoice/AddInvoice";
import InoviceDetails from "../components/InventoryDashboard/Invoices/InvoiceDetails/InoviceDetails";
import Addtransfer from "../components/InventoryDashboard/Transfers/addtransfer/addtransfer";
import MedicineList from "../components/PharmacyDashboard/Medicine/MedicineList/MedicineList";
import MedicineDetails from "../components/PharmacyDashboard/Medicine/MedicineDetails/MedicineDetails";
import OrderList from "../components/PharmacyDashboard/Order/OrderList/OrderList";
import OrderDetails from "../components/PharmacyDashboard/Order/OrderDetails/OrderDetails";
import AddOrder from "../components/PharmacyDashboard/Order/AddOrder/AddOrder";
import TransfersList from "../components/PharmacyDashboard/Transfer/TransfersList/TransfersList";
import TransfersDetails from "../components/PharmacyDashboard/Transfer/TransfersDetails/TransfersDetails";
import SalafRequest from "../components/PharmacyDashboard/Salaf/SalafRequest";
import StudentsList from "../components/PharmacyDashboard/Students/StudentsList/StudentsList";
import PrescriptionsList from "../components/PharmacyDashboard/Students/PrescriptionsList/ PrescriptionsList";
import PrescriptionsDetails from "../components/PharmacyDashboard/Students/PrescriptionsDetails/PrescriptionsDetails";
import SalafDashboard from "../pages/SalafDashboard/SalafDashboard";
import SalafList from "../components/SalafDashboard/SalafList/SalafList";
import SalafDetails from "../components/SalafDashboard/SalafDetails/SalafDetails";

function AppRoutes() {
  const role = getUserRole() || "default";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() && !window.location.pathname.startsWith("/")) {
      navigate("/");
    }

    if (isAuthenticated() && window.location.pathname === "/") {
      redirectUser(role, navigate);
    }
  }, [role, navigate]);

  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route
          path="/inventory-dashboard"
          element={
            role.includes("inventory_agent") ? (
              <InventoryDashboard />
            ) : (
              <Navigate to="/inventory-dashboard/medicines/add" />
            )
          }
        >
          <Route path="medicines/add" element={<AddMedicine />} />
          <Route path="medicinelist" element={<Medicinelist />} />
          <Route path="medicinedetails/:id" element={<Medicinedetails />} />
          <Route path="categorylist" element={<Categorylist />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="transferlist" element={<TransferList />} />
          <Route path="addTransfer" element={<Addtransfer />} />
          <Route path="updateDetails/:id" element={<UpdateDetails />} />
          <Route path="transferDetails" element={<TransferDetails />} />
          <Route path="invoicesList" element={<InvoicesList />} />
          <Route path="addInvoice" element={<AddInvoice />} />
          <Route path="invoiceDetails/:id" element={<InoviceDetails />} />
          {/* Redirect from /inventory-dashboard to /inventory-dashboard/medicinelist */}
          <Route path="" element={<Navigate to="medicinelist" />} />
        </Route>
        <Route
          path="/pharmacy-dashboard"
          element={
            role.includes("pharmacy_agent") ? (
              <PharmacyDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/pharmacy-dashboard/medicineList/"
          element={<MedicineList />}
        />
        <Route
          path="/pharmacy-dashboard/medicineDetails/:id"
          element={<MedicineDetails />}
        />
        <Route path="/pharmacy-dashboard/orderList/" element={<OrderList />} />
        <Route
          path="/pharmacy-dashboard/orderDetails/:order_id"
          element={<OrderDetails />}
        />
        <Route path="/pharmacy-dashboard/addOrder/" element={<AddOrder />} />
        <Route
          path="/pharmacy-dashboard/transferList/"
          element={<TransfersList />}
        />
        <Route
          path="/pharmacy-dashboard/transfersDetails/"
          element={<TransfersDetails />}
        />
        <Route
          path="/pharmacy-dashboard/SalafRequest/"
          element={<SalafRequest />}
        />
        <Route
          path="/pharmacy-dashboard/StudentsList/"
          element={<StudentsList />}
        />
        <Route
          path="/pharmacy-dashboard/students/:id/Prescriptions/"
          element={<PrescriptionsList />}
        />
        <Route
          path="/pharmacy-dashboard/students/:studentId/PrescriptionsDetails/:prescription_id"
          element={<PrescriptionsDetails />}
        />
        <Route
          path="/salaf-dashboard"
          element={
            role.includes("salaf_agent") ? (
              <SalafDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/salaf-dashboard/salafList" element={<SalafList />} />
        <Route
          path="/salaf-dashboard/salafDetails/:requestId"
          element={<SalafDetails />}
        />
      </Route>
      <Route path="/" element={!isAuthenticated() ? <Login /> : null} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<LogoutButton />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
