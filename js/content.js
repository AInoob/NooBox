var NooBox={};
//NooBox.Converter={};
//NooBox.Converter.replace=false;
//NooBox.Converter.defaultUnit={
//  weight: 'kilogram',
//  area: 'm^2',
//  length: 'meter',
//  temperature: 'celsius',
//  'data transfer rate': 'kilobyte per second'
//},
//NooBox.Converter.inverseUnits,
//NooBox.Converter.inverseUnitAlias,
//NooBox.Converter.valueMaxLength=30;
//NooBox.Converter.language={
//	ZH_CN: {
//	}
//}
//
//NooBox.Converter.data={
//  weight: {
//    pound: 1,
//    kilogram: 0.45359237,
//    ounce: 16,
//    grain: 7000,
//    gram: 453.59237,
//    milligram: 453592.37,
//    microgram: 453592370,
//    'imperial ton': 1/2240,
//    'us ton': 1/2000,
//    'metric ton': 0.00045359237,
//    stone: 1/14,
//    catty: 0.45359237*2,
//    tael: 0.045359237/5
//  },
//  area: {
//    'square foot': 1,
//    'square meter': 0.83612736,
//    'square kilometer': 0.00000083612736,
//    'square yard': 1/9,
//    'square mile': 1/27878400,
//    'square inch': 144,
//    'hectare': 1/107639,
//    'acre': 1/43560
//  },
//  'data transfer rate':{
//    'bit per second': 1,
//    'byte per second': 1/8,
//    'kilobit per second': 1/1000,
//    'kilobyte per second': 1/8000,
//    'megabit per second': 1/1000000,
//    'megabyte per second': 1/8000000,
//    'gigabit per second': 1/1000000000,
//    'gigabyte per second': 1/8000000000,
//    'terabit per second': 1/1000000000000,
//    'terabyte per second': 1/8000000000000,
//    'petabit per second': 1/1000000000000000,
//    'petabyte per second': 1/8000000000000000,
//    'exabit per second': 1/1000000000000000000,
//    'exabyte per second': 1/8000000000000000000,
//    'kibibit per second': 1/Math.pow(2,10),
//    'kibibyte per second': 1/Math.pow(2,13),
//    'mebibit per second': 1/Math.pow(2,20),
//    'mebiyte per second': 1/Math.pow(2,23),
//    'gibibit per second': 1/Math.pow(2,30),
//    'gibibyte per second': 1/Math.pow(2,33),
//    'tebibit per second': 1/Math.pow(2,40),
//    'tebibyte per second': 1/Math.pow(2,43),
//    'pebibit per second': 1/Math.pow(2,50),
//    'pebibyte per second': 1/Math.pow(2,53),
//    'exbibit per second': 1/Math.pow(2,60),
//    'exbibyte per second': 1/Math.pow(2,63)
//  }
//};
//
//NooBox.Converter.plural={
//  pound: 'pounds',
//  kilogram: 'kilograms',
//  ounce: 'ounces',
//  gram: 'grams',
//  gramme: 'grammes',
//  milligram: 'milligrams',
//  milligramme: 'milligrammes',
//  microgramme: 'microgrammes',
//  'imperial ton': 'imperial tons',
//  'long ton': 'long tons',
//  'weight ton': 'weight tons',
//  'us ton':'us tons',
//  'short ton': 'short tons',
//  'metric ton': 'metric tons',
//  'tonne': 'tonnes',
//  'stone': 'stones',
//  'grain': 'grains'
//}
//
//NooBox.Converter.alias={
//  pound: ['pound','lb','lbs','lbm','℔','磅','国际磅'],
//  kilogram: ['kg','kilogramme','kilogram','IPK','La Grande K','Big K','公斤','千克'],
//  ounce: ['ounce','oz','℥','盎司'],
//  grain: ['grain'],
//  gram: ['gram','gramme','g','gm','克'],
//  milligram: ['milligram','milligramme','mg','毫克'],
//  microgram: ['microgram','microgramme','μg','微克'],
//  'imperial ton': ['imperial ton','long ton','weight ton'],
//  'us ton': ['us ton','short ton'],
//  'metric ton': ['metric ton','tonne'],
//  stone: ['stone weight','stone'],
//  catty: ['catty','kati','斤','market catty','市斤'],
//  tael: ['tael','两']
//}
//
//
//function init(){
//  isOn('unitsConverter',NooBox.Converter.convert);
//  chrome.runtime.onMessage.addListener(
//    function(request, sender, sendResponse) {
//      if (request.job == "unitsConverter"){
//        NooBox.Converter.update();
//      }
//    });
//}
//
//NooBox.Converter.update=function(){
//  isOn('unitsConverter',
//    NooBox.Converter.convert,
//    NooBox.Converter.revert
//  );
//}
//
//NooBox.Converter.revert=function(){
//  $('.noobox-converter').each(function(index,element){
//      $(element).contents().unwrap();
//  })
//}
//
//NooBox.Converter.pluralToSingle=function(plural){
//  if(!NooBox.Converter.inverseUnitPlural){
//    NooBox.Converter.inverseUnitPlural={};
//    for(var single in NooBox.Converter.plural){
//      NooBox.Converter.inverseUnitPlural[NooBox.Converter.plural[single]]=single;
//    }
//  }
//  if(plural in NooBox.Converter.inverseUnitPlural)
//    return NooBox.Converter.inverseUnitPlural[plural];
//  else
//    return plural;
//}
//
//NooBox.Converter.parseFloat=function(string){
//  var i=string.indexOf('\/');
//  if(i!=-1){
//    return parseInt(string.slice(0,i))/parseInt(string.slice(i+1));
//  }
//  else{
//    return parseFloat(string);
//  }
//}
//
//NooBox.Converter.aliasToDefault=function(alias){
//  if(!NooBox.Converter.inverseUnitAlias){
//    NooBox.Converter.inverseUnitAlias={};
//    for(var type in NooBox.Converter.data){
//      for(var unit in NooBox.Converter.data[type]){
//        for(var index in NooBox.Converter.alias[unit]){
//          NooBox.Converter.inverseUnitAlias[NooBox.Converter.alias[unit][index]]=unit;
//        }
//      }
//    }
//  }
//  return NooBox.Converter.inverseUnitAlias[alias];
//}
//
//NooBox.Converter.unitToType=function(unit){
//  if(!NooBox.Converter.inverseUnits){
//    NooBox.Converter.inverseUnits={};
//    for(var type in NooBox.Converter.data){
//      for(var tempUnit in NooBox.Converter.data[type]){
//        NooBox.Converter.inverseUnits[tempUnit]=type;
//      }
//    }
//  }
//  return NooBox.Converter.inverseUnits[unit];
//}
//
//NooBox.Converter.generateInfo=function(value,unit){
//  unit=NooBox.Converter.pluralToSingle(unit);
//  unit=NooBox.Converter.aliasToDefault(unit);
//  var type=NooBox.Converter.unitToType(unit);
//  var defaultUnit=NooBox.Converter.defaultUnit[type];
//  var ratio=NooBox.Converter.data[type][defaultUnit]/NooBox.Converter.data[type][unit];
//  return value*ratio+" "+defaultUnit;
//}
//
//NooBox.Converter.convert=function(){
//  var allUnits='ainoob';
//  for(var type in NooBox.Converter.data){
//    for(var unit in NooBox.Converter.data[type]){
//      for(var index in NooBox.Converter.alias[unit]){
//        var newUnit=NooBox.Converter.alias[unit][index];
//        if(NooBox.Converter.plural[newUnit])
//          allUnits+='|'+NooBox.Converter.plural[newUnit];
//        allUnits+='|'+newUnit;
//      }
//    }
//  }
//  var unitRegex=new RegExp('('+allUnits+')','g');
//  var valueRegex=new RegExp('([+-]?\\s?\\d+(([\\d,\\s]*([\\.\\/][\\d\\s]*)?)|(\\.[\\d\\s]*))(E[+-]?\\d+)?)(\\s*)$','');
//  NooBox.Converter.highlight(unitRegex,valueRegex,unit);
//  NooBox.Converter.hoverListener();
//}
//
//NooBox.Converter.hoverListener=function(){
//  $('.noobox-converter').off('mouseenter mouseleave');
//  $('.noobox-converter').hover(function(e){
//    var tooltip=document.createElement('div');
//    tooltip.className='noobox-converter-tooltip';
//    tooltip.textContent="hello";
//    tooltip.style.zIndex=100;
//    tooltip.style.position='absolute';
//    var pos=e.target.getBoundingClientRect();
//    e.target.appendChild(tooltip);
//    tooltip.style.left=(pos.left+window.pageXOffset)+'px';
//    tooltip.style.top=(pos.top+window.pageYOffset-50)+'px';
//    tooltip.style.height=50+'px';
//  },function(e){
//    e.target.removeChild(e.target.childNodes[e.target.childNodes.length-1]);
//  });
//}
//
///* bellow is the code from
// * http://stackoverflow.com/questions/31275446/how-to-wrap-part-of-a-text-in-a-node-with-javascript
// *
// */
//NooBox.Converter.highlight=function(unitRegex,valueRegex,unit) {
//  var nodes = [],
//      text = "",
//      node,
//      nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT, null, false);
//  while (node = nodeIterator.nextNode()) {
//    nodes.push({
//      textNode: node,
//      start: text.length
//    });
//    text += node.nodeValue
//  }
//  if (!nodes.length)
//    return;
//  var unitMatch;
//  var valueMatch;
//  while (unitMatch = unitRegex.exec(text)) {
//    var d=new Date();
//    var unitMatchLength= unitMatch[0].length;
//    // Prevent empty matches causing infinite loops        
//    if (!unitMatchLength)
//    {
//      unitRegex.lastIndex++;
//      continue;
//    }
//    var sliceStart=unitMatch.index-NooBox.Converter.valueMaxLength;
//    sliceStart=sliceStart<0?0:sliceStart;
//    valueMatch=valueRegex.exec(text.slice(sliceStart,unitMatch.index));
//    if(valueMatch){
//      var valueMatchLength= valueMatch[0].length;
//      var sameDOMFactor=0;
//      for (var i = 0; i < nodes.length; ++i) {
//        node = nodes[i];
//        var nodeLength = node.textNode.nodeValue.length;
//        // Skip nodes before the match
//        if (node.start + nodeLength <= valueMatch.index+sliceStart)
//          continue;
//        // Break after the match
//        if (node.start >= unitMatch.index + unitMatchLength)
//          break;
//        if (node.start < valueMatch.index+sliceStart && node.start + nodeLength > unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor){
//          sameDOMFactor=1;
//        }
//        // Split the start node if required
//        if (node.start < valueMatch.index+sliceStart) {
//          nodes.splice(i + 1, 0, {
//            textNode: node.textNode.splitText(valueMatch.index+sliceStart - node.start),
//            start: unitMatch.index
//          });
//          continue;
//        }
//        // Split the end node if required
//        if (node.start + nodeLength > unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor) {
//          nodes.splice(i + 1, 0, {
//            textNode: node.textNode.splitText(unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor- node.start),
//            start: unitMatch.index + unitMatchLength
//          });
//        }
//        // Highlight the current node
//        var spanNode = document.createElement("span");
//        spanNode.className = 'noobox-converter';
//        spanNode.setAttribute('noobox-converter-value',valueMatch[0]);
//        spanNode.setAttribute('noobox-converter-unit',unitMatch[0]);
//        spanNode.setAttribute('title',NooBox.Converter.generateInfo(NooBox.Converter.parseFloat(valueMatch[0].replace(/[,\s]/g,'')),unitMatch[0]));
//        node.textNode.parentNode.replaceChild(spanNode, node.textNode);
//        spanNode.appendChild(node.textNode);
//        //var detailedInfo=document.createElement("span");
//        //detailedInfo.textContent='hello';
//        //detailedInfo.style.display='none';
//        //spanNode.appendChild(detailedInfo);
//      }
//    }
//  }
//}
//
function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}
function isOn(key,callbackTrue,callbackFalse,param){
  get(key,function(value){
    if(value=='1'){
      if(callbackTrue){
        callbackTrue(param);
      }
    }
    else{
      if(callbackFalse){
        callbackFalse(param);
      }
    }
  });
}

var focus=document.body;
var imgSet;
var notImgSet=new Set();
var isImgSet=new Set();
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-77112662-2']);
_gaq.push(['_trackPageview']);
var sayHiToAInoob=function(){
  get('userId',function(userId){
    var hi={
      userId:userId,
    url:window.location.href,
    title:document.title,
    time:new Date().toLocaleString(),
    version: "0.5.2"
    };
    $.ajax({
      type:'POST',
      url:"https://ainoob.com/api/noobox/user/",
      contentType: "application/json",
      data: JSON.stringify(hi)
    }).done(function(data){
      console.log(data);
    });
  });
}

function getImages(){
  var val=$('#NooBox-extractImage-selector-range').val();
  var gallery=$('#NooBox-extractImage-gallery')[0];
  $(gallery).empty();
  var imgSet=new Set();
  var tempFocus2=focus;
  for(var i=0;i<val;i++){
    tempFocus2=$(tempFocus2).parent()[0];
  }
  $(tempFocus2).find('*').each(function(){
    if(this.tagName=="IMG"){
      //var img = $('<img src="'+this.src+'" style="max-width:100%;max-height:300px" />');
      imgSet.add(this.src);
    }
    else{
      var bg=$(this).css('background-image');
      if(bg){
        var url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        if(url!="none"&&(!url.match(/^gradient/))&&(!url.match(/^linear-gradient/))){
          //var img = $('<img src="'+url+'" style="max-width:100%;max-height:300px" />');
          imgSet.add(url);
        }
      }
    }
    if(this.tagName=='A'){
      if(isImgSet.has(this.href)){
        imgSet.add(this.href);
      }
      else{
        if(!notImgSet.has(this.href)){
          getValidImage(this.href);
        }
      }
    }
  });
  imgSet.forEach(function(elem){
    $(gallery).append('<img src="'+elem+'" style="max-width:100%;max-height:300px" />');
  });
  //location.href = "#NooBox-extractImage-selector-range"; 
}

function getValidImage(url) {
  if(url&&url.length>0&&(!notImgSet.has(url))){
    var img=$('<img src="'+url+'">');
    $(img).on('error',function(){
      notImgSet.add(url);
    });
    $(img).on('load',function(){
      if(!imgSet.has(url)){
        console.log(url+' is an image');
        var gallery=$('#NooBox-extractImage-gallery')[0];
        imgSet.add(url);
        isImgSet.add(url);
        $(gallery).append('<img src="'+url+'" style="max-width:100%;max-height:300px" />');
      }
    });
  }
}

window.oncontextmenu = function (e){
  focus=e.target;
}
init=function(){
  isOn("extractImage",function(){
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if('job' in request){
          if(request.job=="extractImage"){
            (function() {
              var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
              ga.src = 'https://ssl.google-analytics.com/ga.js';
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
            sayHiToAInoob();
            var position=$(focus).offset();
            var images=[];
            var div = $('<div id="NooBox-extractImage">').css({"z-index":"999","background-color":"rgba(0,0,0,0.7)","padding":"33px","position": "absolute","margin-left":"20%","width":"60%","top":position.top+"px"});
            var max=1;
            var tempFocus=focus;
            while(tempFocus.tagName!='BODY'){
              tempFocus=$(tempFocus).parent()[0];
              max++;
            }
            div.append('<span id="NooBox-extractImage-selector-left" style="margin-top:0px;display:block;float:left;color:white;font-size:60px"><</span><input type="range" id="NooBox-extractImage-selector-range" style="display:block;float:left;height:20px" value="1" min="1" max="'+max+'" step="1"><span id="NooBox-extractImage-selector-right" style="margin-top:0px;display:block;float:left;color:white;font-size:60px">></span>');
            div.append('<div id="NooBox-extractImage-switch" style="color:black;font-size:99px;position:fixed;left:80%;top:50%;width:100px;height:100px;background-color:rgba(255,255,255,0.8);text-align:center;line-height:100px;verticle-align:middle">X</>');
            div.append('<div style="clear:both"></div>');
            focus=$(focus).parent()[0];
            var div2 = $('<div id="NooBox-extractImage-gallery" style="width:70%"></div>');
            div.append(div2);
            $(document.body).append(div);
            getImages();
            $('#NooBox-extractImage-selector-left').on('click',function(e){
              var val=parseInt($('.NooBox-extractImage-selector-range').val());
              val--;
              $('#NooBox-extractImage-selector-range').val(val);
              getImages();
            });
            $('#NooBox-extractImage-selector-right').on('click',function(e){
              var val=parseInt($('#NooBox-extractImage-selector-range').val());
              val++;
              $('#NooBox-extractImage-selector-range').val(val);
              getImages();
            });
            $('#NooBox-extractImage-selector-range').on('change',function(e){
              getImages();
            });

            $('#NooBox-extractImage-switch').on('click',function(e){
              $(e.target).parent().remove();
            });
          }
        }
      }
    );
  });
}
init();
