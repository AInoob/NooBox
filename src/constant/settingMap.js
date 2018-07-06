import google from "SRC/assets/engineLogos/google.png";
import baidu  from "SRC/assets/engineLogos/baidu.png";
import ascii2d from "SRC/assets/engineLogos/ascii2d.png";
import bing from "SRC/assets/engineLogos/bing.png";
import saucenao from "SRC/assets/engineLogos/saucenao.png";
import sogou from "SRC/assets/engineLogos/sogou.png";
import tineye from "SRC/assets/engineLogos/tineye.png";
import iqdb from "SRC/assets/engineLogos/iqdb.png";
import yandex from "SRC/assets/engineLogos/yandex.png";
export const engineMap =[
  {
    name:"google",
    icon: google,
    dbName:"imageSearchUrl_google",
  },
  {
    name:"baidu",
    icon: baidu,
    dbName:"imageSearchUrl_baidu",
  }, {
    name:"yandex",
    icon: yandex,
    dbName:"imageSearchUrl_yandex",
  }, {
    name:"bing",
    icon: bing,
    dbName:"imageSearchUrl_bing",
  }, {
    name:"tineye",
    icon: tineye,
    dbName:"imageSearchUrl_tineye",
  }, {
    name:"saucenao",
    icon: saucenao ,
    dbName:"imageSearchUrl_saucenao",
  }, {
    name:"iqdb",
    icon: iqdb,
    dbName:"imageSearchUrl_iqdb",
  }, {
    name:"ascii2d",
    icon: ascii2d,
    dbName:"imageSearchUrl_ascii2d",
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