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
import { Popup } from './popup';
import { AutoRefreshStore } from './stores/autoRefreshStore';
import { ImageSearchHistoryStore } from './stores/imageSearchHistoryStore';
import { ImageStore } from './stores/imageStore';
import { RouterStore } from './stores/routerStore';
import { VideoControlStore } from './stores/videoControlStore';

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
  faUpload
);

window.addEventListener('error', (e) => {
  console.error(e);
});

const autoRefreshStore = new AutoRefreshStore();
const imageStore = new ImageStore();
const imageSearchHistoryStore = new ImageSearchHistoryStore();
const optionsStore = new OptionsStore();
const routerStore = new RouterStore();
const videoControlStore = new VideoControlStore();

const stores = {
  autoRefreshStore,
  imageStore,
  imageSearchHistoryStore,
  optionsStore,
  routerStore,
  videoControlStore
};

class PopupRoot extends React.Component {
  public render() {
    return (
      <Provider {...stores}>
        <Popup />
      </Provider>
    );
  }
}

render(<PopupRoot />, document.getElementById('root'));
