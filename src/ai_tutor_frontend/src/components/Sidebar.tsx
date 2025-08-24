import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav>
      <NavLink
        to="/dashboard"
        className={(isActive: boolean) =>
          isActive ? "text-blue-600 font-bold" : "text-gray-600"
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/settings"
        className={(isActive: boolean) =>
          isActive ? "text-blue-600 font-bold" : "text-gray-600"
        }
      >
        Settings
      </NavLink>
    </nav>
  );
};

export default Sidebar;
