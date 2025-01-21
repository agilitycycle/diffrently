import {getChapters} from '../utils/utils';

const Section = ({item}) => {
  const {
    content
  } = item;
  return (<div className="mb-5">
    <p className="leading-loose text-secondary/60 theme-dark:text-secondary/40 mb-2">
      {content}
    </p>
  </div>);
}

const Preview = ({
  currentSubjectState,
  selected,
  content
}) => {
  const {chapters, coverUrl} = currentSubjectState;

  let items = [];
  for (let i in content) {
    const newItem = {
      id: i,
      ...content[i]
    }
    items.push(newItem);
  }

  if (selected === 'Cover') {
    return (<div className="max-w-md py-20 h-[calc(100%-58px)] mx-auto flex items-start sm:items-center justify-center">
        <img src={coverUrl} className="max-h-full border border-secondary/20" />
      </div>);
  }

  if (selected === 'Contents') {
    return (<div className="h-[calc(100vh-174px)] relative overflow-y-auto">
      <div className="p-8">
        <h1 className="text-secondary text-3xl font-medium mb-12">Contents</h1>
        <ol className="text-secondary">
          {getChapters(chapters).map((item) => {
            return (<li className="mb-5">
                <a href={null} className="cursor-pointer text-base text-blue-600">{item}</a>
              </li>)
          })}
        </ol>
      </div>
    </div>);
  }

  if (selected.indexOf('chapter-') > -1) {
    return (<div className="h-[calc(100vh-174px)] relative overflow-y-auto">
      {items.map(item => {
        return (<Section item={item} />)
      })}
    </div>);
  }
}

export default Preview;