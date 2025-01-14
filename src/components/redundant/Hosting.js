import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { appState } from '../../app/slices/appSlice';
import { fbdb } from '../../app/firebase';
import { ref, query, get } from 'firebase/database';
import {
  fbSet,
  fbOnValueOrderByKeyLimitToLast
} from '../../services/firebaseService';
import {
  Page,
  Drawer,
  Header,
  SecondaryActionButton
} from '../../components';
import DeployToNetlify from '../../assets/deploy-to-netlify.svg';

const isDomain = urlString => {
  const regex = new RegExp(/^([a-zA-Z0-9]([-a-zA-Z0-9]{0,61}[a-zA-Z0-9])?\.)?([a-zA-Z0-9]{1,2}([-a-zA-Z0-9]{0,252}[a-zA-Z0-9])?)\.([a-zA-Z]{2,63})$/);
  return regex.test(urlString);
};

// https://www.creative-tim.com/twcomponents/component/group-list

const Site = () => {;
  const navigate = useNavigate();
  const currentAppState = useSelector(appState);
  const {photoUrl, displayName, userId} = currentAppState;
  const [domain, setDomain] = useState(undefined);
  const [itemSelected, setItemSelected] = useState(undefined);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [toggleOptions, setToggleOptions] = useState(false);
  const [dropzonesLoaded, setDropzonesLoaded] = useState(false);
  const [dropzones, setDropzones] = useState(undefined);

  /**
   * Needs to be added to redux / saga
   */
  const getDropzones = async () => {
    const result = await fbOnValueOrderByKeyLimitToLast(`/userDropzones/${userId}/dropzones/`, 100);
    setDropzones(result);
    setDropzonesLoaded(true);
  }

  const handleChange = (e) => {
    const { value } = e.target;
    setDomain(value);
  }

  const handleOptions = (item) => {
    setItemSelected(item);
    setToggleDropdown(false);
    setToggleOptions(true);
  }

  const handleSubmit = async () => {
    if(!isDomain(domain)) return;
    const siteId = 'agility-cycle-blog';
    fbSet(`/userHost/${siteId}`, {
      siteTitle: itemSelected.title,
      authorizedDomain: domain,
    });
    const result = await fbOnValueOrderByKeyLimitToLast(`/userDropzoneTimeline/${itemSelected.id}/post`, 100);
    for (let i in result) {
      fbSet(`/userHost/${siteId}/post/${i}`, {
        photoUrl,
        displayName,
        ...result[i]
      });
    }
  }

  const updatePost = async (siteId) => {
    const dropzoneId = '-OAWqqD04fzmh4N_k_Y-';
    const path = `/userDropzoneTimeline/${dropzoneId}/post`;
    const userRef = ref(fbdb, path);
    const q = query(userRef);
    const result = await get(q)
      .then((snapshot) => {
        if (snapshot.val() !== null) {
          return snapshot.val();
        }
        return undefined;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(result)
    if (result) {
      // when does this stop working??
      for (let i in result) {
        fbSet(`/userHost/${siteId}/post/${i}`, {
          photoUrl,
          displayName,
          ...result[i]
        });
      }
    }
  }

  const renderDropzones = () => {
    if (!dropzones) return;
    const items = [];
    for (let i in dropzones) {
      items.push({id: i, ...dropzones[i]});
    }
    return items.map(item => {
      const { id, title, image } = item;
      return (<li key={id}>
          <a href={null} onClick={() => handleOptions(item)} className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/30 dark:hover:text-white">
            <img className="w-6 h-6 me-2 rounded-full" src={image && 'data:image/jpeg;base64,' + image || 'https://picsum.photos/id/18/300/200'} alt="Jese image"/>
            {title}
          </a>
        </li>)
    })
  }

  useEffect(() => {
    if (dropzonesLoaded) return;
    getDropzones();
  })

	return (<>
		<Page>
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full w-full max-w-[1200px]">
          <div className="min-w-80 pb-7 text-white font-sm">
            <div className="mt-9">
              <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row max-w-6xl">
                <div className="flex-1 px-2 sm:px-0">
                  <div className="flex flex-col sm:flex-row flex-inbetween space-x-0 sm:space-x-10">
                    <div className="grow">
                      <button id="dropdownDropzoneButton" onClick={() => setToggleDropdown(!toggleDropdown)} data-dropdown-toggle="dropdownDropzone" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Dropzones <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                      </button>
                      <div id="dropdownDropzone" className={`z-10 absolute ${toggleDropdown ? 'block' : 'hidden'} bg-white rounded-lg border border-gray-700 shadow w-60 dark:bg-[#000423]`}>
                        <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDropzoneButton">
                          {renderDropzones()}
                        </ul>
                      </div>
                      <div className={`transition-all duration-700 w-full sm:w-4/5 overflow-hidden ${toggleOptions ? 'h-[150px] mt-5' : 'h-0'} rounded-lg bg-gray-700/30`}>
                        <div className="p-5">
                          <input value={domain} onChange={handleChange} maxlength="25" className="block py-2.5 pr-2.5 mb-1.5 w-full text-lg text-white bg-transparent !outline-none" placeholder="Your domain"/>
                          <span className="text-blue-500 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-transparent dark:text-blue-500 border border-blue-500">
                            <svg className="w-3 h-3 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                              <path fill-rule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z" clip-rule="evenodd"/>
                            </svg>
                            agility-cycle-blog
                          </span>
                          <SecondaryActionButton onClick={handleSubmit} css="ml-auto block" label="Add" />
                        </div>
                      </div>
                      <h4 className="mt-10 text-2xl font-extralight text-white/50">Active sites</h4>
                      <div className="sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <div className="relative group border border-gray-700 bg-transparent py-10 px-4 flex flex-col space-y-4 items-center cursor-pointer rounded-md">
                          <button onClick={() => updatePost('agility-cycle-blog')} className="absolute top-4 right-4 dark:bg-gray-700/30 dark:text-gray-300 rounded font-medium text-xs px-2 py-1">
                            Update
                          </button>
                          <img className="w-20 h-20 object-cover object-center rounded-full" src="https://picsum.photos/id/18/300/200"
                            alt=""
                          />
                          <h4 className="text-white text-xl font-bold capitalize text-center">Agility Cycle Blog</h4>
                          <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-700/30 dark:text-gray-300">
                            agility-cycle-blog
                          </span>
                          <SecondaryActionButton onClick={() => navigate(`/h/agility-cycle-blog`)} label="View" />
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-60 mt-4 sm:mt-0">
                      <div className="relative group border border-gray-700 bg-transparent py-8 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
                        <img src={DeployToNetlify} className="mb-5" />
                        <div className="flex mb-4 text-sm text-white/50 bg-transparent dark:bg-transparent dark:text-white/50" role="alert">
                          <span className="sr-only">Info</span>
                          <div>
                            <span className="font-medium">Instructions:</span>
                              <ul className="mt-1.5 list-disc list-inside">
                                <li>Deploy code to Netlify</li>
                                <li>Update .env</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
		    </div>
		  </div>
	  </Page>
  </>);
};

export default Site;