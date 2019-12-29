import { ajax } from '../../utils/ajax';
import { ISearchByImage } from '../searchByImage';
import { SearchByImageHelper } from './searchByImageHelper';
export class GoogleSearchByImage implements ISearchByImage {
  public imageLink: string;
  public cursor: number;
  public resultObj: any;
  public ENGINE_WEIGHT: number = 1;
  public ENGINE_NAME: string = 'google';
  public SEARCH_LINK = 'https://www.google.com/searchbyimage?&image_url=';
  constructor(imageLink: string, cursor: number, resultObj: any) {
    this.imageLink = imageLink;
    this.cursor = cursor;
    this.resultObj = resultObj;
  }

  public async generateResult() {
    console.log(this.imageLink);
    try {
      const body = await ajax({
        url: this.SEARCH_LINK + this.imageLink,
        method: 'GET'
      });
      this.processPage(body);
    } catch (err) {
      console.log(' nothing');
    }
  }

  private processPage(body: any) {
    const currentImageInfo = {
      keyword: '',
      keywordLink: '',
      engine: this.ENGINE_NAME,
      imageInfo: {
        width: 0,
        height: 0
      }
    };
    const pageContent: Document = SearchByImageHelper.HTML_PARSER.parseFromString(
      body,
      'text/html'
    );
    // get Search Imge Info
    const topstuff = pageContent.getElementById('topstuff');
    if (topstuff) {
      const infoCard = topstuff.getElementsByClassName('card-section')[0];
      const rawSizeInfo =
        infoCard.childNodes[0] &&
        infoCard.childNodes[0].childNodes[1] &&
        infoCard.childNodes[0].childNodes[1].childNodes[0]
          ? (infoCard.childNodes[0].childNodes[1].childNodes[0] as HTMLElement)
              .innerHTML
          : undefined;
      if (rawSizeInfo) {
        const sizeInfo = rawSizeInfo
          .replace(/<br>|&nbsp;|Image size|:|：|图片尺寸|圖片尺寸/g, '')
          .split('x');
        currentImageInfo.imageInfo.width = Number.parseInt(sizeInfo[0], 10);
        currentImageInfo.imageInfo.height = Number.parseInt(sizeInfo[1], 10);
      }
      const keyword = (infoCard
        .childNodes[1] as HTMLElement).getElementsByTagName('a')[0];
      if (keyword) {
        currentImageInfo.keyword = keyword.innerHTML;
        currentImageInfo.keywordLink =
          'https://www.google.com' + keyword.getAttribute('href');
      }
      this.resultObj.searchImageInfo = this.resultObj.searchImageInfo.concat(
        currentImageInfo
      );
      // this.processPageData(pageContent);
    }
  }
  //  private processPageData(pageContent:Document){
  //   let websiteList = pageContent.getElementsByClassName('srg');
  //   let list = websiteList[websiteList.length - 1].getElementsByClassName('g');
  //   let results = [];
  //   for (let i = 0; i < list.length; i++) {
  //     let singleResult:ISingleSearchResult =
  //     {
  //       title: '',
  //       thumbUrl: '',
  //       imageUrl: '',
  //       sourceUrl: '' ,
  //       imageInfo: {},
  //       searchEngine: this.ENGINE_NAME,
  //       description: '',
  //       weight: this.ENGINE_WEIGHT,
  //     };
  //     const singleItem = list[i];
  //     //console.log(singleItem);
  //     //process title,imageUrl,sourceUrl and thumbUrl
  //     //first <a> contain title and imageUrl
  //     //second <a> contain sourceUrl and thumbUrl
  //     const tagA = singleItem.getElementsByTagName('a');
  //     singleResult.sourceUrl = tagA[0].getAttribute('href');
  //     singleResult.title = (<HTMLElement>(tagA[0].childNodes[0])).innerText;
  //     //new method to dig the image Source
  //     for (let i = 2; i < tagA.length; i++) {
  //       if (tagA[i]) {
  //         let link = tagA[i].getAttribute('href');
  //         //console.log(tagA[i]);
  //         link = parseGoogleImageLink(link);
  //         if (link) {
  //           //console.log(link);
  //           singleResult.imageUrl = link;
  //           singleResult.thumbUrl = link;
  //           break;
  //         }
  //       }
  //     }
  //     const tagSpan = singleItem.getElementsByClassName('st')[0].childNodes;
  //     let description = '';
  //     for (let i = 0; i < tagSpan.length; i++) {
  //       if (i == 0) {
  //         if (tagSpan[i].innerHTML) {
  //           let size = tagSpan[i].innerHTML.split('-')[0];
  //           size = size.replace(/ /g, '').split('×');
  //           if (size) {
  //             singleResult.imageInfo.width = Number.parseInt(size[0], 10);
  //             singleResult.imageInfo.height = Number.parseInt(size[1], 10);
  //           }
  //         } else {
  //           singleResult.imageInfo.width = -1;
  //           singleResult.imageInfo.height = -1;
  //         }
  //       } else {
  //         description += tagSpan[i].innerHTML || tagSpan[i].textContent;
  //       }
  //     }
  //     singleResult.description = description;
  //     results[results.length] = singleResult;
  //   }
  //   return results;
  //  }
}
