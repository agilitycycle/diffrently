import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Page,
  DrawerHome,
  Header
} from '../../components';

const WhyDiffrently = () => {
  const navigate = useNavigate();

	return (<>
		<Page>
      <DrawerHome />
      <Header useLink="/" />
      <div className="flex items-center justify-center h-full">
        <div className="h-full w-full sm:w-7/12">
          <div className="p-5">
            <div className="flex flex-col md:flex-row justify-between mt-6 text-4xl text-secondary font-sans font-extralight">
              <div className="flex items-center mb-10">
                Why Diffrently?
              </div>
            </div>
            <p className="mb-4 text-2xl text-secondary md:text-xl theme-dark:text-gray-400 font-extralight leading-relaxed">
              Diffrently is a Game Changer when writing books.
            </p>
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-relaxed">
              Diffrently can categorise and classify your book in the first 5 mins.
            </p>
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-relaxed">
              Once Diffrently has the preliminary requirements, you can begin creating new content for your book.
            </p>
            <div className="flex flex-col mt-9 mb-9 text-3xl text-secondary font-sans font-extralight">
              Stunning AI performance
            </div>
            <p className="mb-4 text-2xl text-secondary md:text-xl theme-dark:text-gray-400 font-extralight leading-relaxed">
              Learn how our AI technology can help you
            </p>
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-relaxed">
              Diffrently is your AI co-pilot for each new book you write.
            </p>
            <p className="text-secondary theme-dark:text-gray-400 font-extralight leading-relaxed">
              Start writing from anywhere, our AI can automatically re-order your book.
            </p>
            <div className="flex flex-col mt-9 mb-9 text-3xl text-secondary font-sans font-extralight">
              Sharing
            </div>
            <p className="mb-4 text-2xl text-secondary md:text-xl theme-dark:text-gray-400 font-extralight leading-relaxed">
              Learn how to share your e-books with others
            </p>
            <p className="text-secondary theme-dark:text-gray-400 font-extralight leading-relaxed">
              You can share your e-book with other diffrently readers or share a snippet of your book on any of the popular Social Media Platforms.
            </p>
            <div className="flex flex-col mt-9 mb-9 text-3xl text-secondary font-sans font-extralight">
              For Developers
            </div>
            <p className="mb-4 text-2xl text-secondary md:text-xl theme-dark:text-gray-400 font-extralight leading-relaxed">
              Learn how to use our API and embed your books onto any site
            </p>
            <p className="text-secondary theme-dark:text-gray-400 font-extralight leading-loose">
              Our friendly read-only API service allows you to drop a list of books onto any site. Alternatively, you can choose to purchase our commercial license - <a href={null} className="cursor-pointer" onClick={() => navigate('/pricing')}>pricing page</a>.
            </p>
            <p>&nbsp;</p>
          </div>
        </div>
      </div>
    </Page>
  </>);
};

export default WhyDiffrently;