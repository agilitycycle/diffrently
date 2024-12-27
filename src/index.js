import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { updateAppState, appState } from './app/slices/appSlice';
import { fbdb } from './app/firebase';
import { ref, query, get, orderByChild, equalTo } from 'firebase/database';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from 'react-router-dom';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { CategoryContextHOC } from './context/CategoryContext';
import {
  Payment,
  Subscriptions,
  ActiveSubscriptions
} from './screens/subscriptions';
import {
	LandingPage,
	WhyDiffrently,
	Pricing,
	Dashboard,
	Profile,
	Timeline,
	TimelineV2,
	Post,
  Tag,
  PostDetails,
  DropzoneTimeline,
  CreateDropzone,
  Parachute,
  Subject,
  AddSettings,
  Site,
  Hosting,
  SignIn
} from './screens/general';
import './index.css';
import reportWebVitals from './reportWebVitals';

const getUserAuthSession = async () => {
  const auth = getAuth();
  let userId = undefined;

  return await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email } = user;
        const userRef = ref(fbdb, 'users/');
        const q = query(userRef, orderByChild('email'), equalTo(email));
        
        get(q)
          .then((snapshot) => {
            const node = snapshot.val();
            if (node !== null) {
              userId = Object.keys(node)[0];
              const {
                email,
                admin,
                photoUrl,
                displayName,
                activeSubscriptions,
                freeTrial,
                credit
              } = node[userId]
              resolve({
                loggedIn: true,
                userId,
                email,
                admin,
                photoUrl,
                displayName,
                activeSubscriptions,
                freeTrial,
                credit
              });
            }
          })
          .catch((error) => {
            console.log('Error:', error);
          });
      }

      if (!user) {
        resolve(undefined);
      }
    });
  })
}

const ProtectedRoute = (props) => {
  const { children } = props;
	const currentAppState = useSelector(appState);
  const { loggedIn } = currentAppState;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAuthSess = async () => {
      const resp = await getUserAuthSession();
      if (resp) {
        const newAppState = Object.assign({...currentAppState}, {...resp});
        dispatch(updateAppState(newAppState));
      } else {
        return navigate('/');
      }
    }

    if (!loggedIn) {
      getAuthSess();
    }
  }, [loggedIn])

  return loggedIn ? children : null;
}

const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);

const CategoryContextComponent = (BaseComponent) => {
  const Component = CategoryContextHOC(BaseComponent);

  return <ProtectedRoute>
      <Elements stripe={stripePromise}>
        <Component />
      </Elements>
    </ProtectedRoute>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/why-diffrently',
    element: <WhyDiffrently />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/dashboard',
    element: CategoryContextComponent(Dashboard),
  },
  {
    path: '/profile',
    element: CategoryContextComponent(Profile),
  },
  {
    path: '/timeline',
    element: CategoryContextComponent(Timeline),
  },
  {
    path: '/timeline/:tag',
    element: CategoryContextComponent(Tag),
  },
  {
    path: '/timeline/:tag/:postdetails',
    element: CategoryContextComponent(PostDetails),
  },
  {
    path: '/timeline-v2/:username/:subject',
    element: CategoryContextComponent(TimelineV2),
  },
  {
    path: '/post',
    element: CategoryContextComponent(Post),
  },
  {
    path: '/subscriptions',
    element: CategoryContextComponent(Subscriptions),
  },
  {
    path: '/subscriptions/active-subscriptions',
    element: CategoryContextComponent(ActiveSubscriptions),
  },
  {
    path: '/subscriptions/payment',
    element: CategoryContextComponent(Payment),
  },
  {
    path: '/dz/:dzid',
    element: CategoryContextComponent(DropzoneTimeline),
  },
  {
    path: '/dz/:dzid/:tag',
    element: CategoryContextComponent(Tag),
  },
  {
    path: '/create-dropzone',
    element: CategoryContextComponent(CreateDropzone),
  },
  {
    path: '/parachute',
    element: CategoryContextComponent(Parachute),
  },
  {
    path: '/subject',
    element: CategoryContextComponent(Subject),
  },
  {
    path: '/add-settings',
    element: CategoryContextComponent(AddSettings),
  },
  {
    path: '/hosting',
    element: CategoryContextComponent(Hosting),
  },
  {
    path: '/h/:siteid',
    element: <Site/>,
  },
  {
    path: '/h/:siteid/:tag',
    element: <Site/>,
  },
  {
    path: '/h/:siteid/:tag/:postdetails',
    element: <Site/>,
  },
  {
    path: '/signin',
    element: <SignIn />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
