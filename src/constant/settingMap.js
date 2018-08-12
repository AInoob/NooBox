import google from "SRC/assets/engineLogos/google.png";
import baidu  from "SRC/assets/engineLogos/baidu.png";
import ascii2d from "SRC/assets/engineLogos/ascii2d.png";
import bing from "SRC/assets/engineLogos/bing.png";
import saucenao from "SRC/assets/engineLogos/saucenao.png";
import sogou from "SRC/assets/engineLogos/sogou.png";
import tineye from "SRC/assets/engineLogos/tineye.png";
import iqdb from "SRC/assets/engineLogos/iqdb.png";
import yandex from "SRC/assets/engineLogos/yandex.png";
export const engineIcon={
  google:google,
  baidu:baidu,
  ascii2d:ascii2d,
  bing:bing,
  saucenao:saucenao,
  tineye:tineye,
  iqdb:iqdb,
  yandex:yandex,
}
export const engineMap =[
  {
    name:"google",
    icon: google,
    dbName:"imageSearchUrl_google",
    dbNameMaxSearch:"imageSearchUrl_google_max",
  },
  {
    name:"baidu",
    icon: baidu,
    dbName:"imageSearchUrl_baidu",
    dbNameMaxSearch:"imageSearchUrl_baidu_max",
  }, {
    name:"yandex",
    icon: yandex,
    dbName:"imageSearchUrl_yandex",
    dbNameMaxSearch:"imageSearchUrl_yandex_max",
  }, {
    name:"bing",
    icon: bing,
    dbName:"imageSearchUrl_bing",
    dbNameMaxSearch:"imageSearchUrl_bing_max",
  }, {
    name:"tineye",
    icon: tineye,
    dbName:"imageSearchUrl_tineye",
    dbNameMaxSearch:"imageSearchUrl_tineye_max",
  }, {
    name:"saucenao",
    icon: saucenao ,
    dbName:"imageSearchUrl_saucenao",
    dbNameMaxSearch:"imageSearchUrl_saucenao_max",
  }, {
    name:"iqdb",
    icon: iqdb,
    dbName:"imageSearchUrl_iqdb",
    dbNameMaxSearch:"imageSearchUrl_iqdb_max",
  }, {
    name:"ascii2d",
    icon: ascii2d,
    dbName:"imageSearchUrl_ascii2d",
    dbNameMaxSearch:"imageSearchUrl_ascii2d_max",
  },  
]
export const settingsMap =[
    {name:"autoRefresh",value:false},
    {name:"history",value:false},
    {name:"checkUpdate",value:false},
    {name:"videoControl",value:false},
    {name:"extractImages",value:false},
    {name:"imageSearch",value:false},
    {name:"imageSearchNewTabFront",value:false},
    {name:"screenshotSearch",value:false},
];
export const toolSettingMap = [
  {name:"autoRefresh",value:false},
  {name:"videoControl",value:false},
  {name:"extractImages",value:false},
  {name:"imageSearch",value:false},
  {name:"imageSearchNewTabFront",value:false},
  {name:"screenshotSearch",value:false},];
export const expSettingMap = [
{name:"history",value:false},
{name:"checkUpdate",value:false},];