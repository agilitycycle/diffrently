const Started = ({sidebar}) => {
  return (
    <>
      <div className={`${sidebar.isExpand ? 'w-4/5' : 'w-full'} mx-auto`}>
        <div className="flex flex-col sm:flex-row text-secondary/60 text-xl">
          <div className="w-48 mb-8 mx-auto sm:mb-0">
            <div className="w-48 h-60 mx-auto flex items-center justify-center bg-secondary/10 rounded p-2">
              Cover
            </div>
          </div>
          <div className="grow flex flex-col justify-center mx-auto text-center">
            <p className={`mb-12 ${sidebar.isExpand ? 'text-5xl' : 'text-4xl'} font-bold text-[#000] theme-dark:text-secondary leading-relaxed`}>
              The Perfect Sermon
            </p>
            <p className="text-xl tracking-wide">
              By James Star
            </p>
            <hr className="w-4/5 h-[1px] mx-auto my-8 bg-slate-400 border-0 theme-dark:bg-secondary"></hr>
            <div className="text-lg mb-7">
              2% complete
            </div>
            <button onClick={() => {}} type="button" className={`${sidebar.isExpand ? 'px-7 px-2 text-xl' : 'px-5 py-2 text-lg'} w-fit mx-auto font-medium inline-flex items-center justify-center text-white bg-blue-600 rounded-md`}>
              Start reading
            </button>
          </div>
        </div>
      </div>
    </>)
  }

  export default Started;