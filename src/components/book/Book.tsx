import {
  Menu,
  PublicMenu,
  SubMenu,
  Content,
  Footer,
  Started,
  NotStarted,
  New,
  Edit,
  Preview
} from './components';

//
// Book
export const Book = ({children}) => <>{children}</>;

//
// Book Menu
Book.Menu = Menu;

//
// Book Public Menu
Book.PublicMenu = PublicMenu;

//
// Book SubMenu
Book.SubMenu = SubMenu;

//
// Book Content
Book.Content = Content;

//
// Book Footer
Book.Footer = Footer;

//
// Book Start
Book.Started = Started;

//
// Book Start
Book.NotStarted = NotStarted;

//
// Book Edit
Book.Edit = Edit;

//
// Book New
Book.New = New;

//
// Book Preview
Book.Preview = Preview;

export default Book;