import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Membership = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/services", { replace: true });
  }, [navigate]);

  return null;
};

export default Membership;
