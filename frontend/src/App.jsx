import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
//import LoginFormPage from './components/LoginFormPage/LoginFormPage.jsx';
import SignupFormPage from './components/SignupFormModal/SignupFormModal.jsx';
import Navigation from './components/Navigation/Navigation.jsx'
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <div className ="main-content">
        {isLoaded && <Outlet />}
        <h1>Welcome, {sessionUser ? sessionUser.firstName : "Guest"}!</h1>
      </div>
    </>
  );
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: null,
      },
      {
        path: '/signup',
        element: <SignupFormPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
