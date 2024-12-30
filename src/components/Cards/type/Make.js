import React from 'react';

const Make = ({
  topic1,
  topic2,
  topic3,
  cardCount,
  imageUrl,
  handleChange,
  handleSubmit
}) => {
  return (<div className="w-11/12 relative mb-7 mx-auto bg-[#fbfbfc] theme-dark:bg-transparent border border-transparent rounded-lg theme-dark:border-gray-700">
    <div className="w-full sm:max-w-96 pt-4 pl-4 pr-4 pb-7">
      <div className="flex mb-4">
        <img src={imageUrl || 'https://placehold.co/600x400'} className="w-3/5 rounded-2xl" />
      </div>
      <div>
        <input name="topic1" value={topic1} onChange={handleChange} className="block py-1 pr-2.5 w-full text-base mb-1 text-secondary/60 bg-transparent !outline-none" placeholder="Topic 1"/>
        <input name="topic2" value={topic2} onChange={handleChange} className="block py-1 pr-2.5 w-full text-base mb-1 text-secondary/60 bg-transparent !outline-none" placeholder="Topic 2"/>
        <input name="topic3" value={topic3} onChange={handleChange} className="block py-1 pr-2.5 w-full text-base mb-4 text-secondary/60 bg-transparent !outline-none" placeholder="Topic 3"/>
        <select name="cardCount" value={cardCount === 0 ? 'How many cards?' : cardCount} onChange={handleChange} className="bg-transparent border border-gray-200 theme-dark:border-gray-700 text-secondary/60 text-base rounded-lg block w-full p-2.5 mb-6 !outline-none">
          <option selected>How many cards?</option>
          <option value="1">1</option>
          <option value="3">3 (Nearly)</option>
          <option value="5">5 (Nearly)</option>
        </select>
        <button onClick={handleSubmit} className="block rounded-full mt-4 text-xl uppercase px-7 py-1.5 bg-[#f87341] text-[#ffffff]">
          MAKE
        </button>
      </div>
    </div>
  </div>);
}

export default Make;