import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx'
import * as sessionActions from './store/session';
import SpotTilesList from './components/SpotTiles/SpotTilesList.jsx';
import SpotDetails from './components/SpotDetails/SpotDetails.jsx';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm.jsx';
import { useParams } from 'react-router-dom';


function Layout() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots.allSpots)
  const [isLoaded, setIsLoaded] = useState(false);
  console.log("sessionUser: ", sessionUser)
  

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <div className="nav-bar">
        <Navigation isLoaded={isLoaded}/>
      </div>
        {isLoaded && <Outlet />}
    </>
  );
}

function SpotDeatailsWrapper() {
  const sessionUser = useSelector((state) => state.session.user)
  const {spotId} = useParams();
  return <SpotDetails spotId={spotId} user={sessionUser}/>
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotTilesList />,
      },
      {
        path: '/spots/:spotId',
        element: <SpotDeatailsWrapper />
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />
      }
      
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
