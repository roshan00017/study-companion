import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface BackButtonProps {
  to?: string; // Optional: specify a custom back path
  label?: string; // Optional: custom label
  className?: string; // Optional: extra classes
}

export default function BackButton({
  to,
  label = "Back",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className={`flex items-center gap-2 text-indigo-500 hover:text-indigo-700 font-medium transition-colors px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 shadow ${className}`}
    >
      <ArrowLeftIcon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}