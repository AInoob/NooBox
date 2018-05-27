const DEFAULT_MAX_SEARCH = 10;
const ENGINES =['google','baidu','tinyeye','bing','yandex','iqdb','saucenao','ascii2d'];

const DEFAULT_SETTING ={ 
  google: DEFAULT_MAX_SEARCH,
  baidu:  DEFAULT_MAX_SEARCH,
  tineye: DEFAULT_MAX_SEARCH,
  bing: DEFAULT_MAX_SEARCH,
  yandex: DEFAULT_MAX_SEARCH,
  iqdb:  DEFAULT_MAX_SEARCH,
  saucenao: DEFAULT_MAX_SEARCH,
  ascii2d: DEFAULT_MAX_SEARCH
};

export const defaultValues = [
  ['userId', (Math.random().toString(36) + '00000000000000000').slice(2, 19)],
  ['imageSearch', true],
  ['imageSearchNewTabFront', true],
  ['shorcut', false],
  ['unitsConverter', false],
  ['crypter', true],
  ['webmaster', true],
  ['general', true],
  ['background', false],
  ['imageSearchUrl_google', true],
  ['imageSearchUrl_baidu', true],
  ['imageSearchUrl_tineye', true],
  ['imageSearchUrl_bing', true],
  ['imageSearchUrl_yandex', true],
  ['imageSearchUrl_saucenao', false],
  ['imageSearchUrl_iqdb', false],
  ['imageSearchUrl_sogou', false],
  ['imageSearchUrl_ascii2d', false],
  ['extractImages', true],
  ['screenshotSearch', true],
  ['videoControl', false],
  ['autoRefresh', true],
  ['displayOrder', []],
  ['checkUpdate', true],
  ['lastUpdateCheck', 0],
  ['updateHistory', []],
  ['history', true],
  ['maxSearch',DEFAULT_SETTING],
];

export const constantValues = [
  ['displayList', ['imageSearch', 'autoRefresh', 'videoControl', 'checkUpdate']],
  ['version', chrome.runtime.getManifest().version]
]