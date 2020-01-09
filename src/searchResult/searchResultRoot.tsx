import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowsAltH,
  faBars,
  faCog,
  faDonate,
  faGenderless,
  faHistory,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faMars,
  faQuestion,
  faRetweet,
  faSearchPlus,
  faSync,
  faToolbox,
  faTrash,
  faUpload,
  faVenus,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { render } from 'react-dom';
import { OptionsStore } from '../shared/stores/optionsStore';
import { useChrome } from '../utils/useChrome';
import { SearchResult } from './searchResult';
import { SearchResultStore } from './stores/searchResultStore';

useChrome();

library.add(
  fab,
  faSync,
  faArrowsAltH,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faBars,
  faTrash,
  faGenderless,
  faMars,
  faVenus,
  faDonate,
  faToolbox,
  faHistory,
  faCog,
  faQuestion,
  faVideo,
  faUpload,
  faRetweet,
  faSearchPlus
);

window.addEventListener('error', (e) => {
  console.error(e);
});

const optionsStore = new OptionsStore();
const searchResultStore = new SearchResultStore(optionsStore);

const stores = {
  searchResultStore,
  optionsStore
};

class SearchResultRoot extends React.Component {
  public render() {
    return (
      <Provider {...stores}>
        <SearchResult />
      </Provider>
    );
  }
}

render(<SearchResultRoot />, document.getElementById('root'));
