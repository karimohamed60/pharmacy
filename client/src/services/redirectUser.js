const redirectUser = (role, navigate, path = "") => {
  switch (role) {
    case "inventory_agent":
      navigate(`/inventory-dashboard${path}`, { state: { role } });
      break;
    case "pharmacy_agent":
      navigate(`/pharmacy-dashboard${path}`, { state: { role } });
      break;
    case "salaf_requests_agent":
      navigate(`/salaf-requests-dashboard${path}`, { state: { role } });
      break;
    default:
      break;
  }
};

export default redirectUser;
