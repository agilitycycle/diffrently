import { X } from 'react-feather';

/**
 * 
 * https://medium.com/@constgenius/modal-component-purely-in-reactjs-and-tailwindcss-build-a-modal-component-aa124145b702
 * https://gist.github.com/constgenius/eac305a93feeece5be317304caf0d28b
 * 
 */

const Modal = ({ open, onClose, children }) => {
  return (
    <div onClick={onClose}
      className={`fixed z-50 inset-0 flex justify-center items-center transition-colors ${open ? 'visible bg-black/40' : 'invisible'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-w-[400px] w-9/12 bg-white rounded-xl shadow p-6 transition-all ease-in-out ${open ? 'transform translate-y opacity-100 duration-500' : 'transform translate-y-[-50px] opacity-0 duration-300'}`}>

        <button
          onClick={onClose}
          className='absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600'>
          <X />
        </button>

        {children}
      </div>
    </div>
  )
}

export default Modal;