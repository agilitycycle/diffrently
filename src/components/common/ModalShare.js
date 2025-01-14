import { useEffect, useState } from 'react';
import Modal from '../common/Modal';

/**
 * 
 * https://react-select.com/home
 * 
 */

const ModalShare = ({open, setOpen, postItem}) => {
  const [output, setOutput] = useState(undefined);

  useEffect(() => {
    if (!postItem) return;
    let text = `<b>${postItem.title || 'No title'}</b>\n\n${postItem.body}\n\n`;
    for(let i in postItem) {
      if (i.indexOf('tag') > -1) {
        text += `<b>#${i.replace('tag','')}</b>&nbsp;`;
      }
    }
    setOutput(text);
  }, [postItem])

  return(<Modal open={open} onClose={() => setOpen(false)}>
    <div className="w-full">
      <div className="mx-auto mt-3 mb-4 w-full">
        <p className="text-sm text-gray-500">
          <div
            dangerouslySetInnerHTML={{__html: output}}
            className="resize-none block whitespace-pre-line break-words overflow-scroll overflow-x-hidden py-2.5 pr-2.5 mb-7 w-full h-[250px] text-lg text-lg text-gray-500 bg-transparent !outline-none">
          </div>
        </p>
      </div>
      <div className="flex gap-4 justify-end">
        <button type="button"
          onClick={() => {}}
          className="group inline-flex items-center justify-center whitespace-nowrap rounded-lg py-2 align-middle text-xs font-semibold leading-none disabled:cursor-not-allowed bg-gray-300 hover:bg-gray-400 dark:gray-400 dark:hover:gray-400 stroke-white text-gray-800 h-[32px] gap-2 w-16 disabled:bg-slate-100 disabled:stroke-slate-400 disabled:text-slate-400 disabled:hover:bg-slate-100">
          <span>Copy</span>
        </button>
        <button type="button"
          onClick={() => {}}
          className="group inline-flex items-center justify-center whitespace-nowrap rounded-lg py-2 align-middle text-xs font-semibold leading-none disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 stroke-white text-white h-[32px] gap-2 w-16 disabled:bg-slate-100 disabled:stroke-slate-400 disabled:text-slate-400 disabled:hover:bg-slate-100">
          <span>Done</span>
        </button>
      </div>
    </div>
  </Modal>);
}

export default ModalShare;