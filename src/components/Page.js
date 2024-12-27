import React from 'react';

// https://colorffy.com/dark-theme-generator?colors=000423-121212
const Page = (props) => {
  const { children } = props;
  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-[#000423]">
      {children}
    </div>
  )
}

export default Page;