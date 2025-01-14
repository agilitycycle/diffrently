import SignIn from './auth/SignIn';
import Profile from './profile/Profile';
import {
  LandingPage,
  Pricing,
  WhyDiffrently,
} from './public';
import {
  AddSettings,
  Post,
  Subject
} from './subject';
import {
  CreateBook,
  ViewBook
} from './book';
import Drawer from './common/Drawer';
import DrawerHome from './common/DrawerHome';
import Header from './common/Header';
import Page from './common/Page';
import Highlights from './highlights/Highlights';
import {
  Full,
  Compact
} from './common/cards';
import ModalShare from './common/ModalShare'; // redundant
import ModalShareV2 from './common/ModalShareV2'; // redundant
import ModalParachute from './common/ModalParachute'; // redundant
import SecondaryActionButton from './common/SecondaryActionButton'; // redundant
import Fullscreen from './common/Fullscreen'; // redundant

export {
  /**
   * Page components
   */
  SignIn,
  Profile,
  CreateBook,
  ViewBook,
  AddSettings,
  Post,
  Subject,
  LandingPage,
  Pricing,
  WhyDiffrently,
  /**
   * Smaller components
   */
  Highlights,
  Drawer,
  DrawerHome,
	Header,
  Page,
  SecondaryActionButton, // redundant
  Full, // redundant
	Compact, // redundant
	ModalShare, // redundant
	ModalShareV2, // redundant
  ModalParachute, // redundant
  Fullscreen // redundant
}