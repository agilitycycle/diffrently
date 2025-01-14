import React from 'react';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import {
  Menu,
  Drawer,
  Header
} from '../../components';
import { appState } from '../../app/slices/appSlice';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const currentAppState = useSelector(appState);
  const { checkOut } = currentAppState;
  const iframeStyles = {
    base: {
      color: '#fff',
      fontSize: '16px',
      iconColor: '#fff',
      '::placeholder': {
        color: '#87bbfd'
      }
    },
    invalid: {
      iconColor: '#FFC7EE',
      color: '#FFC7EE'
    },
    complete: {
      iconColor: '#cbf4c9'
    }
  };

  const cardElementOpts = {
    iconStyle: 'solid',
    style: iframeStyles,
    hidePostalCode: true
  };
  
  const getClientSecret = () => {
    
  }

  // https://blog.logrocket.com/integrating-stripe-react-stripe-js/
  // https://docs.stripe.com/js/payment_intents/payment_method
  const handlePayment = async () => {
    const clientSecret = getClientSecret();
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Faruq Yusuff",
        },
      },
    });
    console.log(result);
  }

	return (
		<div className="flex flex-col p-5 h-screen bg-[#000423]">
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="w-[500px] h-full sm:h-auto">
          <div className="w-full rounded-lg text-[#fff] font-semibold border border-gray-200 bg-white p-4 mb-5 shadow-sm theme-dark:border-gray-700 theme-dark:bg-[#0d1026] sm:p-6 lg:max-w-xl lg:p-8">
            <div className="flex flex-rows">
              <div className="flex-auto">
                Pay as you go ${checkOut}
              </div>
              <div className="flex-auto text-right">
                ${checkOut}
              </div>
            </div>
          </div>
          <div className="w-full rounded-lg border border-gray-200 bg-white p-4 mb-5 shadow-sm theme-dark:border-gray-700 theme-dark:bg-[#0d1026] sm:p-6 lg:max-w-xl lg:p-8">
            <CardElement
              options={cardElementOpts}
              onChange={() => {}}
            />
          </div>
          <div className="flex items-center justify-center mb-3">
            <button onClick={() => {}} className="rounded-full mb-20 ml-auto mr-auto text-xl uppercase w-48 h-14 bg-[#f87341] text-[#ffffff] justify-center">
              pay ${checkOut}
            </button>
          </div>
        </div>
      </div>
	  </div>);
};

export default Payment;