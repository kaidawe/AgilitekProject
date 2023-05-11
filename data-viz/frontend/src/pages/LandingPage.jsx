import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState.jsx";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const navigate = useNavigate();
  const { customers, setLoggedUser } = useContext(GlobalContext);
  const [users, setUsers] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    if (customers.length > 0) {
      const userOptions = [
        { id: 0, name: "Choose a user" },
        { id: 1, name: "Administrator" },
      ];
      const allCustomers = customers.map((customer, index) => ({
        id: index + userOptions.length,
        name: customer,
      }));
      setUsers([...userOptions, ...allCustomers]);
    }

    if (localStorage.getItem("user") !== null) {
      setLoggedUser(localStorage.getItem("user"));
      navigate("/home");
    }
  }, [customers]);

  const handleLogIn = (e) => {
    e.preventDefault();

    if (selectedUser !== "") {
      setLoggedUser(selectedUser);
      localStorage.setItem("user", selectedUser);
      navigate("/home");
    }
  };
  return (
    <>
      {!users || !users.length ? (
        <p className="text-center font-bold text-gray-300 text-2xl">
          Getting Users...
        </p>
      ) : (
        <div>
          <select
            id="customer-button"
            onChange={(e) => {
              setSelectedUser(e.target.value);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 hover:cursor-pointer"
          >
            {users.map((user, index) => (
              <option key={index} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            className="shadow-md rounded-md px-2 py-1 text-white bg-blue-500 hover:scale-105 transition-all"
            onClick={(e) => {
              handleLogIn(e);
            }}
          >
            Log In
          </button>
        </div>
      )}
    </>
  );
};

export default LandingPage;
