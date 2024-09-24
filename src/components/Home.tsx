import React, { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      navigate("/tasks");
    } else {
      navigate("/login");
    }
  }, [auth?.user, navigate]);

  return <div>Loading...</div>;
};

export default Home;
