import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/notes", label: "Notes" },
  { to: "/dashboard/tasks", label: "Tasks" },
  { to: "/dashboard/flashcards", label: "Flashcards" },
  { to: "/dashboard/study-groups", label: "Study Groups" },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">📚 Study Companion</h2>
      <nav className="space-y-2">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
