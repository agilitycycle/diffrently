const Footer = () => {
  return (<>
    <div className="bg-gray-100 theme-dark:bg-secondary/5 text-secondary">
      <div className="flex justify-between w-full px-6">
        <div className="py-3 flex inline-flex items-center">
          <button onClick={() => {}} type="button" className="px-5 mr-3 h-[35px] text-base font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Update
          </button>
          {/*<button onClick={() => {}} type="button" className="px-5 mr-3 h-[35px] text-base font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Save
          </button>*/}
          <button onClick={() => {}} type="button" className="px-5 mr-3 h-[35px] text-base font-medium text-center inline-flex items-center text-secondary border border-blue-700 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>)
}

export default Footer;