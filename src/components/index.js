import SignIn from './auth/SignIn';
import Profile from './profile/Profile';
import {
  LandingPage,
  Pricing,
  WhyDiffrently,
} from './public';
import {
  Subject,
  NextStep
} from './subject';
import {
  CreateBook,
  Discover,
  ViewBook
} from './book';
import Drawer from './common/Drawer';
import DrawerHome from './common/DrawerHome';
import Header from './common/Header';
import Page from './common/Page';
import Highlights from './highlights/Highlights';

export {
  /**
   * Page components
   * 
   */
  SignIn,
  Profile,
  CreateBook,
  Discover,
  ViewBook,
  Subject,
  NextStep,
  LandingPage,
  Pricing,
  WhyDiffrently,
  /**
   * Smaller components
   * 
   */
  Highlights,
  Drawer,
  DrawerHome,
	Header,
  Page
}