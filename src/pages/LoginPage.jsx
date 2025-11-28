import { Link, useNavigate } from "react-router-dom";
import { withFormik } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import { useUser } from "../context/UserContext";
import { useAlert } from "../context/AlertContext";
import { signInUser } from "../api";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
    .matches(/[0-9]/, "Password must contain at least one number"),
});

const initialValues = {
  email: "",
  password: "",
};

export const LoginPageContent = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  isValid,
}) => {
  return (
    <div
      className="flex justify-center items-center bg-cover bg-no-repeat bg-center w-full h-screen"
      style={{
        backgroundImage: 'url("/images/loginbg.svg")',
      }}
    >
      <div className="top-4 right-4 absolute">
        <Link
          to="/"
          className="text-white focus:text-gray-800 text-sm hover:underline"
        >
          Continue without login
        </Link>
      </div>

      <div className="flex flex-col gap-6 px-4 w-full max-w-md text-white">
        <img
          src="/images/awesomebuy.png"
          alt="Logo"
          className="mx-auto -mb-10"
        />
        <h1 className="font-bold text-2xl text-center">
          Login to Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={values.email}
            error={errors.email}
            touched={touched.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={values.password}
            error={errors.password}
            touched={touched.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div className="text-sm text-center">
            <Link to="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="bg-white disabled:opacity-60 py-3 rounded w-full font-semibold text-[#38A5FF] disabled:cursor-not-allowed"
          >
            LOGIN
          </button>

          <div className="text-sm text-center">
            Don't have an account?
            <Link
              to="/signup"
              className="ml-1 underline hover:underline-offset-2"
            >
              SignUp
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const EnhancedLoginPage = withFormik({
  mapPropsToValues: () => initialValues,
  validationSchema: validationSchema,
  handleSubmit: (values, { setSubmitting, props }) => {
    const { navigate, login, showAlert } = props;
    signInUser(values.email, values.password)
      .then(({ user, token }) => {
        showAlert("Login successful", "success");
        login(user, token);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorMessage = error.message || "Login failed";
        showAlert(errorMessage, "error");
      })
      .finally(() => {
        setSubmitting(false);
      });
  },
  validateOnMount: true,
})(LoginPageContent);

const LoginPage = () => {
  const { showAlert } = useAlert();
  const { user, login } = useUser();
  const navigate = useNavigate();

  return (
    <EnhancedLoginPage
      user={user}
      login={login}
      navigate={navigate}
      showAlert={showAlert}
    />
  );
};

export default LoginPage;
