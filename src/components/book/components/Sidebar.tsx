import {useDispatch, useSelector} from 'react-redux';
import {bookStates} from '../../../configs/constants';
import {controlState} from '../../../app/slices/controlSlice';
import {updateSubjectState, subjectState} from '../../../app/slices/subjectSlice';
import {MdOutlineLightMode} from 'react-icons/md';
import {BiFontSize} from 'react-icons/bi';
import {IoExpand} from 'react-icons/io5';
import {MdEdit} from 'react-icons/md';
import {IoMdEye} from 'react-icons/io';

// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser

const Sidebar = ({
  book,
  previewEditToggle,
  handleControls
}) => {
  const dispatch = useDispatch();
  const currentControlState = useSelector(controlState);
  const currentSubjectState = useSelector(subjectState);
  const {bookControls} = currentControlState;
  const {resize} = currentSubjectState;
  const isEdit = book.editMode === bookStates.EDIT;
  const resizeArray = [
    '',
    'resize-2',
    'resize-3'
  ]

  const handleResize = () => {
    const newIndex = resize.index !== 2 ? resize.index + 1 : 0;
    const newSubjectState = Object.assign({...currentSubjectState}, {
      resize: {
        className: resizeArray[newIndex],
        index: newIndex
      }
    });
    dispatch(updateSubjectState(newSubjectState));
  }

  const isDisabled = () => {
    if (!book.selected) {
      return true;
    }
    return false;
  }

  return (<div className="w-[75px] sm:w-auto flex-1 grow">
    <div className="w-[55px] h-full sm:h-[calc(100%-20px)] sm:ml-[10px] sm:mt-[10px] border border-secondary/10 shadow bg-page/section">
      <ul className="w-[35px] mt-4 mx-auto">
        <li className="mb-2.5">
          {isEdit && (
            <button title="Click to preview" disabled={isDisabled()} onClick={() => previewEditToggle('preview')} className="bg-primary/50 border border-secondary/15 text-secondary mr-2 sm:mr-4 w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg disabled:opacity-50">
              <IoMdEye />
            </button>
          )}
          {!isEdit && (
            <button title="Click to edit" disabled={isDisabled()} onClick={() => previewEditToggle('edit')} className="bg-primary/50 border border-secondary/15 text-secondary mr-2 sm:mr-4 w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg disabled:opacity-50">
              <MdEdit />
            </button>
          )}
        </li>
        <li className="mb-2.5">
          <button onClick={handleResize} className="bg-primary/50 border border-secondary/15 text-secondary w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg disabled:opacity-50">
            <BiFontSize />
          </button>
        </li>
        <li className="mb-2.5">
          <button onClick={() => handleControls({bookControls: {isExpand: !bookControls.isExpand}})} className="hidden sm:flex bg-primary/50 border border-secondary/15 text-secondary w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg disabled:opacity-50">
            <IoExpand />
          </button>
          <button disabled className="sm:hidden bg-primary/50 border border-secondary/15 text-secondary w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg disabled:opacity-50">
            <IoExpand />
          </button>
        </li>
        <li>
          <button onClick={() => handleControls({bookControls: {darkMode: !bookControls.darkMode}})} className="bg-primary/50 border border-secondary/15 text-secondary w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg disabled:opacity-50">
            <MdOutlineLightMode />
          </button>
        </li>
      </ul>
    </div>
  </div>);
}

export default Sidebar;