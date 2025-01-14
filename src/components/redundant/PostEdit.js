import React from 'react';
import {
  Page,
  Drawer,
  Header
} from '../../components';

const PostEdit = () => {

	return (<>
		<Page>
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full w-full max-w-[500px] sm:w-8/12">
          <div className="min-w-80 pb-7 text-white font-sm">
            Post edit
          </div>
		    </div>
		  </div>
	  </Page>
  </>);
};

export default PostEdit;