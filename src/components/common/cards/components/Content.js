import { useSelector } from 'react-redux';
import moment from 'moment';
import {appState} from '../../../../app/slices/appSlice';
import {profilePhotoStyle} from '../helper/fn';
import {Modular} from '../type/Modular';

const Content = (props) => {
  const currentAppState = useSelector(appState);
  const {cardComponent} = currentAppState;
  const {type, tagid} = cardComponent;
  const {
    photoUrl,
    displayName,
    showHide,
    id,
    title,
    body,
    dateCreated,
    tagCount,
    tags,
    switchPage,
  } = props;

  const renderTags = (tags, tagid) => {
    return tags.map((tag, index) => {
      const highlightStyles = tagid === tag ? 'border border-emerald-600 text-emerald-600' : 'opacity-40 border border-[#A9AAC5] text-[#A9AAC5]';
      return <button key={`tag${index}`} className="mb-4" onClick={() => switchPage(tag)}>
        <span key={tag} className={`${highlightStyles} bg-transparent text-sm font-medium me-2 px-2.5 py-0.5 rounded`}>
          {tag}
        </span>
      </button>
    })
  }

  return (<Modular className={`transition-all ease-in-out ${showHide}`}>
    <div className="flex justify-between mt-4 ml-5"></div>
    <div className="pt-5 pl-5 pr-5">
      <Modular.Text>
        <div className="flex justify-between">
          <h5 onClick={() => switchPage(tags[0], id)} className="cursor-pointer mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title || 'No title'}
          </h5>
        </div>
      </Modular.Text>
      <Modular.Body>
        <p onClick={() => switchPage(tags[0], id)} className="cursor-pointer mb-8 font-normal text-base text-[#A9AAC5] leading-9" style={{wordBreak: 'break-word'}}>
          {type === 'ROOT' || type === 'TAG' ? `${body.slice(0, 150 - 1)}...` : body}
        </p>
      </Modular.Body>
      <p className="mb-4 text-sm text-[#A9AAC5]">
        <div className="flex mb-3">
          <div className="rounded-full w-[40px] h-[40px] bg-[#40435a]" style={profilePhotoStyle(photoUrl)}>
            &nbsp;
          </div>
          <div className="flex items-center justify-center ml-4 text-lg font-medium">
            <h5>{displayName}</h5>
          </div>
        </div>
        <div className="mb-8 opacity-60 text-[#A9AAC5]">
          {moment(dateCreated).fromNow()}
        </div>
        <Modular.Footer>
          {tagCount && (
            renderTags(tags, tagid)
          )}
          {!tagCount && (
            <>
              <button className="mb-4"  onClick={() => switchPage(tags[0])}>
                <span className="opacity-40 border border-[#A9AAC5] text-[#A9AAC5] bg-transparent text-sm font-medium me-2.5 px-2.5 py-0.5 rounded">
                  {tags.length} tags
                </span>
              </button>
              <button className="mb-4">
                <span className="opacity-40 border border-[#A9AAC5] text-[#A9AAC5] bg-transparent text-sm font-medium me-2.5 px-2.5 py-0.5 rounded">
                  Media
                </span>
              </button>
            </>
          )}
        </Modular.Footer>
      </p>
    </div>
  </Modular>);
}

export default Content;