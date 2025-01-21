import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {fbUpdate} from '../../services/firebaseService.js';
import {appState} from '../../app/slices/appSlice';
import {updateSubjectState, subjectState} from '../../app/slices/subjectSlice';
import {TagsInput} from 'react-tag-input-component';
import BooksDropdown from  './BooksDropdown';
import {HiMiniCog6Tooth} from 'react-icons/hi2';
import {
  Page,
  Drawer,
  Header
} from '../';

const api = 'https://d9mi4czmx5.execute-api.ap-southeast-2.amazonaws.com/prod/{read+}';

const NextStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId} = currentAppState;
  const {id, subject, title, tags, username} = currentSubjectState;
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(false);
  const [articles, setArticles] = useState('3');
  const [showArticles, setShowArticles] = useState(false);
  const [selected, setSelected] = useState(JSON.parse(tags));
  const [checked, setChecked] = useState({
    generateTags: true,
    generateArticles: true
  });
  const [content, setContent] = useState({
    title,
    blurb: ''
  });

  const hydrateTag = (tag) => {
    // remove space, special characters
    const hydrated = tag.replace(/\w+/g, (a) =>
    `${a.charAt(0).toUpperCase()}${a.substr(1)}`).replace(/\s/g, '').replace(/[^\w\s]/gi, '');
    return [hydrated].filter(a => a.toLowerCase() && a.length < 25)[0];
  }

  const handleChange = (e) => {
    const {target} = e;
    const {name, value} = target;
    const newContent = {...content};
    newContent[name] = value;
    setContent(newContent);
  }

  const handleCheckbox = (e) => {
    const {target} = e;
    const {name} = target;
    const newChecked = {...checked};
    newChecked[name] = !newChecked[name];
    setChecked(newChecked);
  }

  const handleCheckboxes = () => {
    if (checked.generateTags &&
      checked.generateArticles) {
        setChecked({
          generateTags: false,
          generateArticles: false
        });
        return;
    }
    setChecked({
      generateTags: true,
      generateArticles: true
    });
  }

  const handleArticles = (e) => {
    const {target} = e;
    const {value} = target;
    setArticles(value);
  }

  const handleCreate = async () => {
    const {
      generateTags,
      generateArticles
    } = checked;

    setLoading(true);

    // generate tags

    let generatedTags = [];

    if (generateTags) {
      await axios.post(api, JSON.stringify({
        option: 'zero-shot-classifier',
        data: {
          tags: JSON.parse(tags).map(item => `\n- ${item.tag}`).join(',').replace(',', ''),
          text: `${subject}\n\n${title}\n\n${content.blurb}`
        }
      })).then(resp => {
        const {data} = resp;
        const {response} = data;

        const newContent = JSON.parse(response.content);

        if(newContent.hasOwnProperty('categories')) {
          generatedTags = JSON.stringify([...newContent.categories.map(item => hydrateTag(item))]);
        }

      }).catch(error => {
        console.log(error);
      });
    }

    // `${subject}, ${topic1}, ${topic2}, ${topic3}`

    // generate articles

    let generatedArticles = [];

    if (generateArticles) {
      await axios.post(api, JSON.stringify({
        option: 'generate-articles',
        data: {
          cardCount: articles,
          text: `${subject}\n\n${title}\n\n${content.blurb}`
        }
      })).then(resp => {
        const { data } = resp;
        const { response } = data;
        const { content } = response;
    
        const newContent = JSON.parse(content);
        const {articles} = newContent;
  
        articles.map((article) => {
          const {title, body} = article;
          generatedArticles.push({
            title,
            body
          });
        });

      }).catch(error => {
        console.log(error);
      });

    }

    // lastly, update db

    const newSubjectObject = {
      title: content.title,
      blurb: content.blurb,
      generatedTags: JSON.stringify(generatedTags),
      generatedArticles: JSON.stringify(generatedArticles)
    }

    fbUpdate(`/userSubject/${userId}/subjects/${id}`, newSubjectObject);
    const newSubjectState = Object.assign({...currentSubjectState}, newSubjectObject);
    dispatch(updateSubjectState(newSubjectState));

    setLoading(false);

    navigate(`/create/${username}/${subject}`);
  }

  const goBack = () => {
    setSettings(false);
  }

  if (loading) {
    return (<Page>
			<Drawer />
      <Header extraButtons={
        <BooksDropdown/>
      } />
      <div className="flex flex-col justify-center h-3/5 sm:h-4/5">
        <div className="w-fit mx-auto" role="status">
          <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600/20 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </Page>);
  }

  if (settings) {
    return (<Page>
      <Drawer />
      <Header extraButtons={
        <BooksDropdown/>
      } />
      <div className="w-full lg:w-6/12 mx-auto flex flex-col justify-center h-3/5 sm:h-4/5 p-9 text-secondary/60">
        <div className="text-2xl px-7 mb-3 sm:mb-7">
          Settings
        </div>
        <div className="px-7 py-8 mb-5 sm:mb-9 border border-secondary/40 rounded-lg">
          <input value={content.title} name="title" onChange={handleChange} className="block py-1 pr-2.5 mb-2.5 w-full text-lg text-secondary/60 bg-transparent !outline-none" placeholder="Title"/>
          <input value={content.blurb} name="blurb" onChange={handleChange} className="block py-1 pr-2.5 mb-5 w-full text-base text-secondary/60 bg-transparent !outline-none" placeholder="Write a blurb"/>
          <div className="mb-8 w-full sm:w-6/12">
            <TagsInput
              value={selected}
              onChange={setSelected}
              placeHolder="add tags"
            />
          </div>
          <div class="flex items-center mb-3.5">
            <input onChange={handleCheckbox} name="generateTags" id="generate" checked={checked.generateTags} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
            <label for="generate" className="ms-2 text-sm font-medium text-secondary/60">Generate 30+ tags</label>
          </div>
          <div class="flex items-center">
            <input onChange={handleCheckbox} name="generateArticles" id="articles" checked={checked.generateArticles} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
            <label for="articles" className="ms-2 text-sm font-medium text-secondary/60">Generate up to 3</label>&nbsp;<a href={null} onClick={() => setShowArticles(!showArticles)} className="text-blue-600 cursor-pointer">articles</a>
          </div>
          <div className={`${showArticles ? 'flex' : 'hidden'} flex-col text-base text-secondary/60 mt-5`}>
            <div className="text-base mb-3.5">
              Update articles
            </div>
            <input type="text" name="article1" value="What is the origin of" className="w-fit bg-transparent px-2 py-1 border border-secondary/40 mb-2 rounded" />
            <input type="text" name="article2" value="What is the history of" className="w-fit bg-transparent px-2 py-1 border border-secondary/40 mb-2 rounded" />
            <input type="text" name="article3" value="What is a" className="w-fit bg-transparent px-2 py-1 border border-secondary/40 mb-2 rounded" />
          </div>
        </div>
        <div className="flex px-7">
          <button onClick={() => goBack()} type="button" className="px-3 py-1 text-base w-fit font-medium inline-flex items-center justify-center text-secondary/80 bg-secondary/10 theme-dark:bg-secondary/60 theme-dark:text-primary rounded-md">
            Back
          </button>
        </div>
      </div>
    </Page>)
  }

  return (<Page>
    <Drawer />
    <Header extraButtons={
      <BooksDropdown/>
    } />
    <div className="w-full lg:w-6/12 mx-auto flex flex-col items-center justify-center h-3/5 sm:h-4/5 py-9 text-secondary/60">
      <ol className="w-4/5 text-secondary/60 mb-12">
        <li className="flex items-top justify-center block-inline rounded-xl">
          <input type="text" name="title" onChange={handleChange} value={content.title} placeholder="Title" className="block w-full pb-2.5 bg-transparent text-2xl text-secondary/60 border-b-2 border-emerald-400 !outline-none"/>
          <HiMiniCog6Tooth onClick={() => setSettings(true)} className="cursor-pointer relative top-[1px] ml-3.5 text-secondary/60 text-2xl sm:text-3xl"/>
        </li>
      </ol>
      <div className="w-4/5 flex items-center justify-center mb-14">
        <label for="generateTagsArticles" className="text-base leading-loose">
          <input onChange={handleCheckboxes} checked={checked.generateTags && checked.generateArticles} id="generateTagsArticles" type="checkbox" value="" name="bordered-checkbox" className="w-4 h-4 mr-3 text-blue-600 border-secondary/60 rounded"/>
          Your <span onClick={() => setSettings(true)} className="cursor-pointer text-blue-600">settings</span> will generate up to <select onChange={handleArticles} className="block-inline py-1 px-2 mx-1 w-fit leading-none text-xl text-secondary/60 bg-transparent border-b-2 border-blue-600 appearance-none focus:outline-none peer">
            <option value="1" selected={articles}>1</option>
            <option value="2" selected={articles}>2</option>
            <option value="3" selected={articles}>3</option>
          </select> articles and 30+ tags.
        </label>
      </div>
      <button onClick={() => navigate(`/create/${username}/${subject}`)} className="block rounded-full mb-12 text-base w-48 bg-transparent text-blue-600">
        {`Skip >>`}
      </button>
      <button onClick={handleCreate} className="block rounded-full mb-4 text-xl uppercase w-48 h-14 bg-[#f87341] text-[#ffffff]">
        Create
      </button>
    </div>
  </Page>);
}

export default NextStep;