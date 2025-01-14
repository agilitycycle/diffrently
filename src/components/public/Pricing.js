import React from 'react';
import {
  Page,
  DrawerHome,
  Header
} from '../../components';

const Pricing = () => {

	return (<>
		<Page>
      <DrawerHome/>
      <Header useLink="/" />
      <div className="flex items-center justify-center h-full">
        <div className="h-full w-full sm:w-7/12">
          <div className="p-5">
            <div className="flex flex-col md:flex-row justify-between mt-6 text-4xl text-secondary font-sans font-extralight">
              <div className="flex items-center mb-10">
                Pricing
              </div>
            </div>
            <p className="mb-4 text-2xl text-secondary md:text-xl theme-dark:text-gray-400 font-extralight leading-relaxed">
              Diffrently is different than most apps and so is the pricing.
            </p>
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-relaxed">
              Because each feature is built using AI, its virtually impossible to offer a FREE trial.
            </p>
            <div className="flex flex-col mt-9 mb-9 text-3xl text-secondary font-sans font-extralight">
              Subscription
            </div>
            <p className="mb-4 text-2xl text-secondary md:text-xl theme-dark:text-gray-400 font-extralight leading-relaxed">
              Subscribe monthy with no fixed terms.
            </p>
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-relaxed">
              Diffrently offers a single subscription cost e.g $25 USD per mo.
            </p>
            <div className="flex flex-col mt-9 mb-9 text-3xl text-secondary font-sans font-extralight">
              API services
            </div>
            <p className="mb-4 text-2xl text-secondary md:text-xl theme-dark:text-gray-400 font-extralight leading-relaxed">
              Our API service is free providing you are on a mo. subscription.
            </p>
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-relaxed">
              If you would prefer to host your own Diffrently app than we can help lend a hand with us.
              Contact james@agilitycycle.com
            </p>
            <div className="flex flex-col mt-9 mb-9 text-3xl text-secondary font-sans font-extralight">
              Commercial or Open Source
            </div>
            <p className="mb-4 text-2xl text-secondary md:text-xl theme-dark:text-gray-400 font-extralight leading-relaxed">
              Purchase a one-time commercial licence or use our free <a href="https://github.com/agilitycycle/Diffrently" target="_blank" className="underline">Open Source</a> code.
            </p>
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-loose">
              Diffrently offers two types of licenses; our FREE to use under GPLv3 license minus backend code or a commercial license in which all code is available (front-end and back-end code).
            </p>
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-relaxed">
              Note: If new feats become available after purchase of a commercial license, you can opt to pay for the new code.
            </p>  
            <p className="text-secondary theme-dark:text-gray-400 mb-4 font-extralight leading-relaxed">
              Learning organisations such as schools can benefit from a reduced cost while introducing the benefits of AI in the classroom.
            </p>
            <p>&nbsp;</p>
          </div>
        </div>
      </div>
    </Page>
  </>);
};

export default Pricing;