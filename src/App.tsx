import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import ForegroundNotification from "./components/ForegroundNotification";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ForegroundNotification />
    </>
  );
}

export default App;
