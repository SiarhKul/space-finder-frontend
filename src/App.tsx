import './App.css'
import {Outlet, RouterProvider, createBrowserRouter} from 'react-router-dom';
import NavBar from './components/NavBar';
import {useState} from 'react';
import LoginComponent from "./components/LoginComponents.tsx";
import {AuthService} from "./services/AuthService.ts";

function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  const authService = new AuthService()

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar userName={userName}/>
          <Outlet/>
        </>
      ),
      children: [
        {
          path: "/",
          element: <div>Hello world!</div>,
        },
        {
          path: "/login",
          element: <LoginComponent setUserNameCb={setUserName} authService={authService}/>,
        },
        {
          path: "/profile",
          element: <div>Profile page</div>,
        },
        {
          path: "/createSpace",
          element: <div>Create space page</div>,
        },
        {
          path: "/spaces",
          element: <div>Spaces page </div>,
        },
      ]
    },
  ]);

  return (
    <div className="wrapper">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
