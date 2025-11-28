import {
  HiCheckCircle,
  HiXCircle,
  HiInformationCircle,
  HiExclamation,
  HiX,
} from "react-icons/hi";

const themeClasses = {
  success: "bg-green-500 text-white",
  error: "bg-primary-dark text-white",
  info: "bg-blue-500 text-white",
  warning: "bg-yellow-500 text-white",
};

const icons = {
  success: <HiCheckCircle className="w-5 h-5" />,
  error: <HiXCircle className="w-5 h-5" />,
  info: <HiInformationCircle className="w-5 h-5" />,
  warning: <HiExclamation className="w-5 h-5" />,
};

function Alert({ type = "info", message, onDismiss, fading }) {
  if (!message) return null;

  const typeClass = themeClasses[type];
  const icon = icons[type];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded shadow-md transition-opacity duration-500 ease-in-out ${
        fading ? "opacity-0" : "opacity-100"
      } ${typeClass}`}
      role="alert"
    >
      <span className="opacity-90">{icon}</span>
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onDismiss} className="opacity-80 hover:opacity-100 ml-2">
        <HiX className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Alert;
