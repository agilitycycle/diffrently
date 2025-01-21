const Options = ({
    renderOptions,
    handleOptions,
    selectedTimeline,
    handleDelete
  }) => {
  return (<div className="w-11/12 sm:w-10/12 mx-auto">
    <div className="flex flex-col justify-between h-full">
      <div>
        <div>
          <select name="timeline" onChange={handleOptions} className="bg-transparent border border-secondary/25 theme-dark:border-secondary/15 text-secondary/60 text-base rounded-lg block w-72 p-2.5 mb-7 !outline-none">
            <option value="Select timeline" selected={!selectedTimeline}>Select Timeline</option>
            {renderOptions()}
          </select>
        </div>
        <div className="text-sm text-[#B3B5CC] mb-2">
          {`Other reads >`}
        </div>
        <ul className="text-sm text-blue-600 leading-loose mb-7">
          <li>#LeonardoDaVinci1</li>
          <li>#LeonardoDaVinci2</li>
          <li>#LeonardoDaVinci3</li>
          <li>#LeonardoDaVinci4</li>
        </ul>
        <div className="w-72 border border-dashed border-secondary/35 theme-dark:border-secondary/15 rounded-sm mb-7 p-8 text-center text-base text-secondary/70 font-light">
        Promote your book here.
        </div>
        <p className="w-72 text-sm text-[#B3B5CC] leading-loose mb-6">
          Pay a mo. subscription for no Ads, Unlimited books and more control.
        </p>
      </div>
      <button type="button" onClick={handleDelete} className="w-20 text-red-600 hover:text-white border border-red-600 hover:bg-red-700 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 mb-8 text-center me-2 mb-2 theme-dark:border-red-500 theme-dark:text-red-500 theme-dark:hover:text-white dark:hover:bg-red-600">
        Delete
      </button>
    </div>
  </div>)
}

export default Options;