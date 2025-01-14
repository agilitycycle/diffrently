import React, {useState} from 'react';
import Content from '../components/Content';
import SocialMediaIcons from '../components/SocialMediaIcons';
import MenuOverlay from '../components/MenuOverlay';
import MoreMenu from '../components/MoreMenu';

const Simple = (props) => {
  const {
    id,
    title,
    dateCreated,
    photoUrl,
    displayName,
    body,
    handleAction,
    switchPage,
    type,
    tags,
    menuOptions,
  } = props;
  const [openMenu, setOpenMenu] = useState(false);

  const toggleSubmenu = () => {
    setOpenMenu(!openMenu);
  }

  const moreMenuProps = {
    title,
    body,
    tags,
    toggleSubmenu,
    handleAction,
    openMenu,
    menuOptions
  }

  const showHide = openMenu ? 'opacity-0 pointer-events-none' : 'opacity-100';

  const contentProps = {
    photoUrl,
    displayName,
    showHide,
    id,
    title,
    body,
    dateCreated,
    tagCount: type === 'ROOT' || type === 'TAGS' ? false : true,
    tags,
    switchPage,
  }

  return (<div className="relative mb-7 mx-auto bg-transparent border border-gray-200 rounded-lg shadow dark:bg-transparent dark:border-gray-700">
    <div>
      {openMenu && (<MenuOverlay toggleSubmenu={toggleSubmenu}/>)}
      <MoreMenu {...moreMenuProps}/>
      <Content {...contentProps} />
      <div className="pb-5">
        {SocialMediaIcons()}
      </div>
    </div>
  </div>);
} 

export default Simple;