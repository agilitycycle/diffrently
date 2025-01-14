const NoPost = () => {
  return (<div className="flex flex-row text-white mb-5">
    <div>
      <div className="flex items-center justify-center rounded-full w-12 h-12 bg-[#40435a]">
        &nbsp;
      </div>
    </div>
    <div className="flex-1 text-left text-[#ffffff]">
      <div className="ml-5">
        <p className="text-lg font-bold">
          <span className="flex items-center text-white">Title</span>
        </p>
        <p className="text-base text-[#A9AAC5] leading-loose">
          No post avail.
        </p>
      </div>
    </div>
    <div>
      <div className="flex items-center justify-center rounded-md ml-auto w-12 h-12 border border-gray-700 bg-transparent">
        &nbsp;
      </div>
    </div>
  </div>);
}

export default NoPost;