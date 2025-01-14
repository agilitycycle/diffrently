const listCss = 'transition-all duration-300 ease-in-out group inline-block cursor-pointer px-3 py-.5 mb-3 rounded font-medium text-gray-800 bg-gray-400 hover:bg-gray-300';

const MoreMenu = (props) => {
  const {
    title,
    body,
    tags,
    toggleSubmenu,
    handleAction,
    openMenu,
    menuOptions
  } = props;
  const {hideEdit, hideParachute, hideDelete} = menuOptions;
  return(<>
    <div className={`${openMenu ? 'flex' : 'hidden'} items-center justify-center absolute top-[65px] right-[23px] z-30 w-[120px]`}>
      <ul className="text-sm leading-relaxed text-right">
        <li>
          <a href={null} onClick={() => handleAction('SHARE_MODAL', {title, body, tags})} className={listCss}>Share</a>
        </li>
        {!hideEdit && (<li className={listCss}>
          Edit
        </li>)}
        {!hideParachute && (<li>
          <a href={null} onClick={() => handleAction('PRACHUTE_MODAL')} className={listCss}>Parachute</a>
        </li>)}
        {!hideDelete && (<li>
          <a href={null} onClick={() => handleAction('DELETE')} className={listCss}>Delete</a>
        </li>)}
      </ul>
    </div>
    <a href={null} onClick={toggleSubmenu} className={`transition-all duration-100 ease-in-out flex items-center justify-center cursor-pointer absolute top-[22px] right-[22px] z-40 w-8 h-8 rounded-full ${openMenu ? 'fill-gray-400' : 'fill-[#A9AAC5]/50'} bg-transparent`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
        <path d="M256 232C242.7 232 232 242.7 232 256S242.7 280 256 280c13.26 0 24-10.74 24-24S269.3 232 256 232zM256 344c-13.25 0-24 10.74-24 24s10.75 24 24 24c13.26 0 24-10.74 24-24S269.3 344 256 344zM256 120c-13.25 0-24 10.74-24 24S242.7 168 256 168c13.26 0 24-10.74 24-24S269.3 120 256 120zM256 0c-141.4 0-255.1 114.6-255.1 256S114.6 511.1 256 511.1s256-114.6 256-255.1S397.4 0 256 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480z"/>
      </svg>
    </a>
  </>)
}
  
export default MoreMenu;