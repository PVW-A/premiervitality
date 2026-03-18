import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HowToGetStarted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/protocols", { replace: true });
  }, [navigate]);

  return null;
};

export default HowToGetStarted;
