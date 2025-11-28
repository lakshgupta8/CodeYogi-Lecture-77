import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { useUser } from "../context/UserContext";

const AuthRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AuthRoute;
