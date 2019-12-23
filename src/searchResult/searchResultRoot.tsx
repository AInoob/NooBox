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
import { useChrome } from '../utils/useChrome';

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

const stores = {};

class PopupRoot extends React.Component {
  public render() {
    return <Provider {...stores}></Provider>;
  }
}

render(<PopupRoot />, document.getElementById('root'));
