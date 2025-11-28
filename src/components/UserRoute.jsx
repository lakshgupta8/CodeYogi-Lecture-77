import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { useUser } from "../context/UserContext";

const UserRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default UserRoute;
