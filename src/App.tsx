import './App.css'
import {Outlet, RouterProvider, createBrowserRouter} from 'react-router-dom';
import NavBar from './components/NavBar';
import {useState} from 'react';
import LoginComponent from "./components/LoginComponents.tsx";
import {AuthService} from "./services/AuthService.ts";
import {DataService} from "./services/DataService.tsx";
import CreateSpace from "./components/spaces/CreateSpace.tsx";

const authService = new AuthService()
const dataService = new DataService(authService)

function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

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
          element: <CreateSpace dataService={dataService}/>,
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
