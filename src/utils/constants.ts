export const BELLO_URL = 'https://ainoob.com/bello/noobox';

export const NOOBOX_VERSION = chrome.runtime.getManifest().version;

export const HTML5_VIDEO_CONTROL_OPTION_KEY_PREFIX = 'videoControl_website_';

export const HISTORY_DB_KEY = 'history_records';

export type EngineType =
  | 'google'
  | 'baidu'
  | 'yandex'
  | 'bing'
  | 'saucenao'
  | 'ascii2d'
  | 'iqdb';

export const ENGINE_LIST: EngineType[] = [
  'google',
  'baidu',
  'yandex',
  'bing',
  'saucenao',
  'ascii2d',
  'iqdb'
];

export const getEngineImageUrl = (engine: EngineType) => {
  return 'images/engineLogos/' + engine + '.png';
};

export const ENGINE_OPTION_KEY_PREFIX = 'imageSearchUrl_';

export const getEngineOptionKey = (engine: EngineType) => {
  return ENGINE_OPTION_KEY_PREFIX + engine;
};

export const ENGINE_DONE = {
  ASCII2D_DONE: 'ascii2dDone',
  BAIDU_DONE: 'baiduDone',
  BING_DONE: 'bingDone',
  GOOGLE_DONE: 'googleDone',
  IQDB_DONE: 'iqdb',
  SAUCENAO_DONE: 'saucenaoDone',
  TINEYE_DONE: 'tineyeDone',
  YANDEX_DONE: 'yandexDone'
};

export const ENGINE_WEIGHTS = {
  ascii2d: -69,
  baidu: 28,
  bing: 28,
  google: 30,
  iqdb: -100,
  saucenao: 10,
  tineye: 28,
  yandex: 25
};
