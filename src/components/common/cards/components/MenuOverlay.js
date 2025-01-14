const MenuOverlay = (props) => {
  const {toggleSubmenu} = props;
  return(<a href={null} onClick={toggleSubmenu} className="cursor-pointer z-20 absolute right-0 w-full h-full">
    <div className="flex flex-col justify-between h-full">
      <h5 className="cursor-pointer pl-9 pt-11 w-[60%] leading-loose text-3xl font-light tracking-wide text-gray-900 dark:text-white">
        What would you like to do?
      </h5>
    </div>
  </a>)
}

export default MenuOverlay;