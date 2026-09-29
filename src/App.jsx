import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Auth from "./pages/auth/Index";
import Chat from "./pages/chat/Index";
import Profile from "./pages/profile/Index";
import Protected from "./pages/Protected";
import Home from "./pages/home/Index";
import NotFound from "./NotFoundPage";
import ServerWakeUp from "./ServerWakeUp";

const rootLoader = () => {
  console.log("Loading data ....");
};

const router = createBrowserRouter([
  {
    path: "auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Protected />,
    loader: rootLoader, // function that will run before fucntion loads
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
  {
    path: "*", // ✅ 404
    element: <NotFound/>,
  },
  {
    path: "coldstart",
    element: <ServerWakeUp />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
