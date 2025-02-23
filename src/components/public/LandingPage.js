import React from 'react';
import {useNavigate} from 'react-router-dom';
import Slider from 'react-slick';
import {
  Page,
  DrawerHome,
  Header
} from '../../components';

const LandingPage = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const getTags = () => {
    const tagEl = [
      'Religion', 'Christianity', 'Bible', 'Faith',
      'Spirituality', 'SacredTexts', 'ChristianLifestyle', 'Ancient',
      'Wisdom', 'Prayer', 'God', 'Jesus'
    ];
    return tagEl.map((tag, index) => {
      return <button key={`tag${index}`} className="mb-1 sm:mb-3.5">
        <span key={tag} className="theme-dark:border-2 theme-dark:border-gray-800 text-secondary bg-white theme-dark:bg-transparent text-base font-sans font-light me-3 sm:me-4 px-5 py-2.5 rounded">
          {tag}
        </span>
      </button>
    })
  }

  const renderSocialMediaIcons = () => {
    return(<div className="flex items-center justify-center">
      <svg className="opacity-85 w-[60px] h-[60px] text-secondary theme-dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
      </svg>
      <svg className="opacity-85 w-[62px] h-[62px] mr-3 text-secondary theme-dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"/>
      </svg>
      <svg className="opacity-85 w-[62px] h-[62px] mr-3 text-secondary theme-dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clip-rule="evenodd"/>
      </svg>
      <svg className="opacity-85 w-[58px] h-[58px] mr-3 text-secondary theme-dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
      </svg>
      <svg className="opacity-85 w-[66px] h-[66px] text-secondary theme-dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd"/>
        <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
      </svg>
    </div>)
  }

	return (<>
    <Page>
      <DrawerHome />
      <Header useLink="/" invisible />
      <div className="h-full w-full flex items-center justify-center h-full">
        <div className="h-full w-full">
          <div className="lg:w-9/12 mx-auto">
            <div className="pl-5 pr-5">
              <div className="saira-condensed-extrabold text-[#233ce6] text-7xl sm:text-[150px] tracking-tight w-full xl:w-9/12 mt-24 mb-20 sm:mt-32 sm:mb-36">
                NOT A BLOG, NOT A WEBSITE, NOT YOUTUBE, NOT FACEBOOK.
              </div>
              <div className="flex flex-col lg:flex-row mb-10 lg:mb-36">
                <div className="w-full sm:w-5/12 mb-7 lg:mb-0 text-5xl xl:text-7xl text-secondary font-thin">
                  <div className="w-full sm:pr-20 leading-loose text-center">
                    Write a <span className="border-b border-secondary">book</span> every 5 mins with our AI co-pilot.
                  </div>
                </div>
                <div className="w-full sm:w-7/12">
                  <div className="border border-gray-800">
                    <div className="h-[250px] sm:h-[450px]" style={{
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center',
                      backgroundImage: 'url(/404.png)'
                    }}>
                      &nbsp;
                    </div>
                    <div className="p-12 sm:pb-24 bg-white theme-dark:bg-transparent">
                      <div className="text-secondary/90 text-center text-lg sm:text-3xl font-extralight mb-10 sm:mb-16">
                        Chapter 5
                      </div>
                      <div className="text-secondary/90 text-2xl sm:text-4xl font-extralight mb-10 sm:mb-16">
                        Who Broke The Internet?
                      </div>
                      <div className="text-secondary/90 text-base sm:text-2xl font-extralight leading-loose">
                        ... The Internet has been broken for some time. It wasn't just celebrities with outrageous ideas but a series of events that ultimately led to the internet being broken.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/**
               * Showcase
               * 
               */}
              <div className="slider-container mb-10 lg:mb-36">
                <div className="mb-10 sm:mb-20 text-center text-5xl sm:text-6xl text-secondary font-sans font-thin">
                  Showcase
                </div>
                <Slider {...settings}>
                  <div className="px-4">
                    <div className="p-5 bg-primary rounded-lg">
                      <img className="rounded-md" src="https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/cover%2F-NrnSwk-t38iZWOB76Lt%2F-OEs3jR0LGwzH1oAOkma%2Fcover.png?alt=media" />
                      <div className="text-center pt-3.5 text-base text-secondary/90">The Perfect Sermon: Sermonizing</div>
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="p-5 bg-primary rounded-lg">
                      <img className="rounded-md" src="https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/cover%2F-NrnSwk-t38iZWOB76Lt%2F-OIjDZEIBWA5c91IzL-T%2Fcover.png?alt=media" />
                      <div className="text-center pt-3.5 text-base text-secondary/90">God's grace extends far beyond Israel</div>
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="p-5 bg-primary rounded-lg">
                      <img className="rounded-md" src="https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/cover%2F-NrnSwk-t38iZWOB76Lt%2F-OIsgCa7YfuVM3JN8ZZN%2Fcover.png?alt=media" />
                      <div className="text-center pt-3.5 text-base text-secondary/90">TypeScript Essentials: Comprehensive...</div>
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="p-5 bg-primary rounded-lg">
                      <img className="rounded-md" src="https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/cover%2F-NrnSwk-t38iZWOB76Lt%2F-OIxVS8S3pZbTa08zwMJ%2Fcover.png?alt=media" />
                      <div className="text-center pt-3.5 text-base text-secondary/90">ReactJS BEST Practices: Tips and Tricks...</div>
                    </div>
                  </div>
                </Slider>
                <button type="button" onClick={() => navigate('/signin')} className="block mt-12 mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-base px-5 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Sign in to Read
                </button>
              </div>
              <div className="flex flex-col text-center mb-10 text-4xl text-secondary font-sans font-thin">
                <div className="mb-10 sm:mb-20 text-center text-5xl sm:text-6xl text-secondary font-sans font-thin">
                  Power at your fingertips...
                </div>
                <iframe className="w-11/12 h-[300px] sm:h-[450px] xl:w-8/12 xl:h-450px] mx-auto mb-10 shadow" src="https://www.youtube.com/embed/sT2UDxVLJ4k?si=H78ibRRvivVAc5sg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
            </div>
          </div>
          {/**
           * Generate images
           * 
           */}
          <div className="flex flex-col text-center mb-16 text-4xl text-secondary font-sans font-thin">
            <div className="mb-10 sm:mb-20 text-center text-5xl sm:text-6xl text-secondary font-sans font-thin">
              Generate images
            </div>
            <div>
              <img className="w-full" referrerpolicy="no-referrer" src="/moses.png" />
            </div>
          </div>
          <div className="lg:w-9/12 mx-auto">
            <div className="pl-5 pr-5 pb-5">
              <div className="flex flex-col mb-16 text-5xl text-secondary font-sans font-thin">
                <div className="text-center mb-10 sm:mb-16">
                  Generate tags
                </div>
                <div className="w-full sm:w-7/12 mx-auto text-center">
                  {getTags()}
                </div>
              </div>
              <div className="flex flex-col mb-16 text-5xl text-secondary font-sans font-thin">
                <div className="mb-8 sm:mb-12 leading-relaxed text-center">
                  Share on
                </div>
                <div>
                  {renderSocialMediaIcons()}
                </div>
              </div>
              <div className="mb-10 text-center text-base text-secondary theme-dark:text-gray-400 font-sans font-extralight leading-relaxed">
                Want to use Diffrently. commercially, PM james@agilitycycle.com to purchase a one-time commercial license.
              </div>
              <div className="mb-16 text-center text-base text-secondary theme-dark:text-gray-400 font-sans font-extralight leading-relaxed">
                Diffrently. is 99.99% of the time in sync with the cloud database.
              </div>
              <div className="mb-10 sm:mb-20 text-center text-5xl sm:text-6xl text-secondary font-sans font-thin">
                Pricing
              </div>
              <div className="mb-8 lg:mb-16">
                <div className="w-full md:w-2/4 block mx-auto border border-gray-800 bg-white theme-dark:bg-transparent text-secondary theme-dark:text-gray-400 font-sans font-extralight">
                  <div className="pt-10 pl-9 pr-9 text-center">
                    <div className="mb-3.5 text-5xl font-medium">Author</div>
                    <div className="mb-3.5 text-base">Write a book every 5 mins with our AI co-pilot.</div>
                    <div className="mb-6 text-3xl font-light">$25 USD</div>
                    <button type="button" onClick={() => navigate('/signin')} className="block mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-base px-8 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                      Sign up
                    </button>
                  </div>
                  <hr className="h-px mt-12 mb-9 bg-gray-800 border-0"/>
                  <div className="pl-9 pr-9 pb-11">
                    <ol className="mb-5 list-decimal list-inside leading-loose text-base">
                      <li>Write unlimited books</li>
                      <li>Create unlimited pages</li>
                      <li>X generated topics</li>
                      <li>X generated tags</li>
                      <li>Usernames</li>
                      <li>Book covers</li>
                    </ol>
                    <div className="text-sm leading-loose">* All benefits of AI included.</div>
                    <div className="text-sm leading-loose">** Generate images are purchaseable upon additional credit.</div>
                  </div>
                </div>
              </div>
              <div className="text-secondary theme-dark:text-gray-400 text-sm text-center mb-10 pb-10 font-sans font-extralight">
                © Copyright Diffrently. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  </>);
};

export default LandingPage;