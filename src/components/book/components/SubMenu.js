const SubMenu = ({
  expandCollapsePageToggle,
  handleControls,
  isLightDark,
  isExpand
  }) => {
  return (<div className={`${expandCollapsePageToggle ? 'visible' : 'hidden'} border-t border-secondary/10`}>
    <div className="flex items-center justify-center py-7">
      <div className="flex flex-row rounded-full bg-primary/50 border border-secondary/15 px-7 py-1.5">
        <div className="h-fit text-sm text-secondary/60 mr-2">
          Light/dark
        </div>
        <label className="inline-flex items-center cursor-pointer mr-5">
          <input type="checkbox" onChange={() => handleControls({sidebar: {darkMode: !isLightDark}})} className="sr-only peer" checked={isLightDark} />
          <div className="relative w-9 h-5 peer-focus:outline-none rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all theme-dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
        <div className="h-fit text-sm text-secondary/60 mr-2">
          Expand
        </div>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" onChange={() => handleControls({sidebar: {isExpand: !isExpand}})} className="sr-only peer" checked={isExpand} />
          <div className="relative w-9 h-5 peer-focus:outline-none rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all theme-dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </div>);
};

export default SubMenu;