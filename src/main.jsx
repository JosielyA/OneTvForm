import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import { Toaster } from "react-hot-toast";
import { IconContext } from "react-icons";

import "./index.css";

import Navbar from "./components/Navbar";

const router = createBrowserRouter([
  {
    element: <Navbar />,
    errorElement: (
      <div>
        <h1>404 Error</h1>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <IconContext.Provider
      value={{ color: "black", size: "25px", className: "global-class-name" }}
    >
      <div>
        <Toaster />
      </div>
      <RouterProvider router={router} />
    </IconContext.Provider>
  </div>
);
