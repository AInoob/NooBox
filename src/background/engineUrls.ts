import { ajax } from '../utils/ajax';
import { EngineType } from '../utils/constants';

const GOOGLE_SEARCH_URL = 'https://www.google.com/searchbyimage';
const YANDEX_SEARCH_URL = 'https://yandex.com/images/search';
const BING_SEARCH_URL = 'https://www.bing.com/images/search';
const SAUCENAO_SEARCH_URL = 'https://saucenao.com/search.php';
const TINEYE_SEARCH_URL = 'https://tineye.com/search';
const ASCII2D_SEARCH_URL = 'https://ascii2d.net/search/url';
const IQDB_SEARCH_URL = 'https://iqdb.org/';

const encode = (value: string) => encodeURIComponent(value);

const buildGoogleUrl = (imageUrl: string) => {
  const params = new URLSearchParams();
  params.set('image_url', imageUrl);
  return `${GOOGLE_SEARCH_URL}?${params.toString()}`;
};

const buildYandexUrl = (imageUrl: string) => {
  const params = new URLSearchParams();
  params.set('url', imageUrl);
  params.set('rpt', 'imageview');
  return `${YANDEX_SEARCH_URL}?${params.toString()}`;
};

const buildBingUrl = (imageUrl: string) => {
  const params = new URLSearchParams();
  params.set('view', 'detailv2');
  params.set('iss', 'sbi');
  params.set('FORM', 'SBIIRP');
  params.set('q', `imgurl:${imageUrl}`);
  params.set('idpbck', '1');
  return `${BING_SEARCH_URL}?${params.toString()}`;
};

const buildSauceNaoUrl = (imageUrl: string) => {
  const params = new URLSearchParams();
  params.set('db', '999');
  params.set('url', imageUrl);
  return `${SAUCENAO_SEARCH_URL}?${params.toString()}`;
};

const buildTineyeUrl = (imageUrl: string) => {
  const params = new URLSearchParams();
  params.set('url', imageUrl);
  return `${TINEYE_SEARCH_URL}?${params.toString()}`;
};

const buildAscii2dUrl = (imageUrl: string) => {
  return `${ASCII2D_SEARCH_URL}/${encode(imageUrl)}`;
};

const buildIqdbUrl = (imageUrl: string) => {
  return `${IQDB_SEARCH_URL}?url=${encode(imageUrl)}`;
};

const buildBaiduUrl = async (imageUrl: string) => {
  const formData = new FormData();
  formData.append('image', imageUrl);
  const { body } = await ajax({
    url: 'https://graph.baidu.com/upload',
    method: 'POST',
    body: formData,
    debugTag: 'baidu:upload',
    debugBody: true
  });
  const parsed = JSON.parse(body);
  const redirectUrl = parsed?.data?.url;
  if (!redirectUrl) {
    throw new Error('Baidu search did not return redirect URL');
  }
  return redirectUrl;
};

export const buildEngineUrl = async (
  engine: EngineType,
  imageUrl: string
): Promise<string> => {
  switch (engine) {
    case 'google':
      return buildGoogleUrl(imageUrl);
    case 'yandex':
      return buildYandexUrl(imageUrl);
    case 'bing':
      return buildBingUrl(imageUrl);
    case 'saucenao':
      return buildSauceNaoUrl(imageUrl);
    case 'tineye':
      return buildTineyeUrl(imageUrl);
    case 'ascii2d':
      return buildAscii2dUrl(imageUrl);
    case 'iqdb':
      return buildIqdbUrl(imageUrl);
    case 'baidu':
      return buildBaiduUrl(imageUrl);
    default:
      throw new Error(`Unsupported engine ${engine}`);
  }
};
