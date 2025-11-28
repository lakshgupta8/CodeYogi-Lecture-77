import { Link, useNavigate } from "react-router-dom";
import { withFormik } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import { signupUser } from "../api";
import { useUser } from "../context/UserContext";
import { useAlert } from "../context/AlertContext";

const validationSchema = Yup.object().shape({
  Name: Yup.string().required("Name is required"),
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const initialValues = {
  Name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const SignUpPageContent = ({
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
        <h1 className="font-bold text-2xl text-center">Create Your Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="Name"
            name="Name"
            type="text"
            placeholder="Name"
            autoComplete="Name"
            value={values.Name}
            error={errors.Name}
            touched={touched.Name}
            onChange={handleChange}
            onBlur={handleBlur}
          />

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
            autoComplete="new-password"
            value={values.password}
            error={errors.password}
            touched={touched.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <Input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            value={values.confirmPassword}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="bg-white disabled:opacity-60 py-3 rounded w-full font-semibold text-[#38A5FF] disabled:cursor-not-allowed"
          >
            CREATE
          </button>

          <div className="text-sm text-center">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 underline hover:underline-offset-2"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const EnhancedSignUpPage = withFormik({
  mapPropsToValues: () => initialValues,
  validationSchema: validationSchema,
  handleSubmit: (values, { setSubmitting, props }) => {
    const { navigate, login, showAlert } = props;

    signupUser(values.Name.split(" ")[0], values.email, values.password)
      .then(({ user, token }) => {
        showAlert("Account created successfully", "success");
        login(user, token);
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorMessage = error.message || "Signup failed";
        showAlert(errorMessage, "error");
      })
      .finally(() => {
        setSubmitting(false);
      });
  },
  validateOnMount: true,
})(SignUpPageContent);

const SignUpPage = () => {
  const { showAlert } = useAlert();
  const { user, login } = useUser();
  const navigate = useNavigate();

  return (
    <EnhancedSignUpPage
      user={user}
      login={login}
      navigate={navigate}
      showAlert={showAlert}
    />
  );
};

export default SignUpPage;
