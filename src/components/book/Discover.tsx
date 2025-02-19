import React from 'react';
import {BooksDropdown} from './components';
import {Page, Drawer, Header} from '../';

const Discover = () => {
	return (
    <Page>
      <Header extraButtons={
        <BooksDropdown/>
      } />
      <Drawer />
      <div className="flex h-full">
        Abc
      </div>
    </Page>
  );
};

export default Discover;