const PublicOptions = () => {
  return (<div className="w-11/12 sm:w-10/12 mx-auto">
    <div className="flex flex-col justify-between h-full">
      <div>
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
    </div>
  </div>)
}

export default PublicOptions;