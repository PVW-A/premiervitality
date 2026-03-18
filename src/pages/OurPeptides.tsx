import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OurPeptides = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/peptides", { replace: true });
  }, [navigate]);

  return null;
};

export default OurPeptides;
