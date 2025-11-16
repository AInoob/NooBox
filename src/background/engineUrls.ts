import { ajax } from '../utils/ajax';
import { EngineType } from '../utils/constants';
import { logDebug } from '../utils/debugReporter';

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

const getFilenameFromUrl = (url: string, fallbackExt = 'jpg') => {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname || '';
    const name = pathname.split('/').pop() || '';
    if (name && name.includes('.')) {
      return name;
    }
  } catch {
    // ignore parse failure
  }
  return `noobox.${fallbackExt}`;
};

const guessExtensionFromType = (type?: string | null) => {
  if (!type) {
    return 'jpg';
  }
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
  };
  return map[type.toLowerCase()] || 'jpg';
};

const fetchImageBlob = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl, {
      credentials: 'omit',
      mode: 'cors'
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer], { type: contentType });
    const filename = getFilenameFromUrl(
      imageUrl,
      guessExtensionFromType(contentType)
    );
    return { blob, filename };
  } catch (error) {
    await logDebug({
      event: 'baidu:image_download_error',
      error: error instanceof Error ? error.message : String(error),
      extra: {
        imageUrl
      }
    }).catch(() => undefined);
    return null;
  }
};

const uploadToBaidu = async (formData: FormData, hint: string) => {
  const response = await ajax({
    url: 'https://graph.baidu.com/upload',
    method: 'POST',
    body: formData,
    debugTag: `baidu:upload:${hint}`,
    debugBody: true
  });
  return JSON.parse(response.body);
};

const buildBaiduUrl = async (imageUrl: string) => {
  const attempts: Array<{ data: FormData; hint: string }> = [];
  const downloaded = await fetchImageBlob(imageUrl);
  if (downloaded) {
    const formData = new FormData();
    formData.append('image', downloaded.blob, downloaded.filename);
    attempts.push({ data: formData, hint: 'file' });
  }
  const urlForm = new FormData();
  urlForm.append('image', imageUrl);
  attempts.push({ data: urlForm, hint: downloaded ? 'url_fallback' : 'url' });

  for (const attempt of attempts) {
    try {
      const parsed = await uploadToBaidu(attempt.data, attempt.hint);
      const redirectUrl = parsed?.data?.url;
      if (parsed?.status === 0 && redirectUrl) {
        return redirectUrl;
      }
      await logDebug({
        event: 'baidu:upload_retry',
        extra: {
          hint: attempt.hint,
          status: parsed?.status,
          message: parsed?.msg
        }
      }).catch(() => undefined);
    } catch (error) {
      await logDebug({
        event: 'baidu:upload_error',
        error: error instanceof Error ? error.message : String(error),
        extra: {
          hint: attempt.hint
        }
      }).catch(() => undefined);
    }
  }

  throw new Error('Baidu search did not return redirect URL');
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
