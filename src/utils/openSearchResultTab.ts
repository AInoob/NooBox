import { createNewTab } from './createNewTab';
import { get } from './db';
import { generateNewTabUrl } from './generateNewTabUrl';

export const openSearchResultTab = async (cursor: number) => {
  const url = await generateNewTabUrl('searchResult.html');
  await createNewTab({
    active: await get('imageSearchNewTabFront'),
    url: url + '#/' + cursor
  });
};
