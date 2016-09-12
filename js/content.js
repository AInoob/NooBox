var NooBox={};
NooBox.Converter={};
NooBox.Converter.replace=false;
NooBox.Converter.defaultUnit={
  weight: 'kilogram',
  area: 'm^2',
  length: 'meter',
  temperature: 'celsius',
  'data transfer rate': 'kilobyte per second'
},
NooBox.Converter.inverseUnits,
NooBox.Converter.inverseUnitAlias,
NooBox.Converter.valueMaxLength=30;
NooBox.Converter.language={
	ZH_CN: {
	}
}

NooBox.Converter.data={
  weight: {
    pound: 1,
    kilogram: 0.45359237,
    ounce: 16,
    grain: 7000,
    gram: 453.59237,
    milligram: 453592.37,
    microgram: 453592370,
    'imperial ton': 1/2240,
    'us ton': 1/2000,
    'metric ton': 0.00045359237,
    stone: 1/14,
    catty: 0.45359237*2,
    tael: 0.045359237/5
  },
  area: {
    'square foot': 1,
    'square meter': 0.83612736,
    'square kilometer': 0.00000083612736,
    'square yard': 1/9,
    'square mile': 1/27878400,
    'square inch': 144,
    'hectare': 1/107639,
    'acre': 1/43560
  },
  'data transfer rate':{
    'bit per second': 1,
    'byte per second': 1/8,
    'kilobit per second': 1/1000,
    'kilobyte per second': 1/8000,
    'megabit per second': 1/1000000,
    'megabyte per second': 1/8000000,
    'gigabit per second': 1/1000000000,
    'gigabyte per second': 1/8000000000,
    'terabit per second': 1/1000000000000,
    'terabyte per second': 1/8000000000000,
    'petabit per second': 1/1000000000000000,
    'petabyte per second': 1/8000000000000000,
    'exabit per second': 1/1000000000000000000,
    'exabyte per second': 1/8000000000000000000,
    'kibibit per second': 1/Math.pow(2,10),
    'kibibyte per second': 1/Math.pow(2,13),
    'mebibit per second': 1/Math.pow(2,20),
    'mebiyte per second': 1/Math.pow(2,23),
    'gibibit per second': 1/Math.pow(2,30),
    'gibibyte per second': 1/Math.pow(2,33),
    'tebibit per second': 1/Math.pow(2,40),
    'tebibyte per second': 1/Math.pow(2,43),
    'pebibit per second': 1/Math.pow(2,50),
    'pebibyte per second': 1/Math.pow(2,53),
    'exbibit per second': 1/Math.pow(2,60),
    'exbibyte per second': 1/Math.pow(2,63)
  }
};

NooBox.Converter.plural={
  pound: 'pounds',
  kilogram: 'kilograms',
  ounce: 'ounces',
  gram: 'grams',
  gramme: 'grammes',
  milligram: 'milligrams',
  milligramme: 'milligrammes',
  microgramme: 'microgrammes',
  'imperial ton': 'imperial tons',
  'long ton': 'long tons',
  'weight ton': 'weight tons',
  'us ton':'us tons',
  'short ton': 'short tons',
  'metric ton': 'metric tons',
  'tonne': 'tonnes',
  'stone': 'stones',
  'grain': 'grains'
}

NooBox.Converter.alias={
  pound: ['pound','lb','lbs','lbm','℔','磅','国际磅'],
  kilogram: ['kg','kilogramme','kilogram','IPK','La Grande K','Big K','公斤','千克'],
  ounce: ['ounce','oz','℥','盎司'],
  grain: ['grain'],
  gram: ['gram','gramme','g','gm','克'],
  milligram: ['milligram','milligramme','mg','毫克'],
  microgram: ['microgram','microgramme','μg','微克'],
  'imperial ton': ['imperial ton','long ton','weight ton'],
  'us ton': ['us ton','short ton'],
  'metric ton': ['metric ton','tonne'],
  stone: ['stone weight','stone'],
  catty: ['catty','kati','斤','market catty','市斤'],
  tael: ['tael','两']
}


function init(){
  NooBox.Converter.createCSSStyle();
  isOn('unitsConverter',NooBox.Converter.convert);
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.job == "unitsConverter"){
        NooBox.Converter.update();
      }
    });
}

NooBox.Converter.update=function(){
  isOn('unitsConverter',
    NooBox.Converter.convert,
    NooBox.Converter.revert
  );
}

NooBox.Converter.revert=function(){
  $('.noobox-convert').each(function(index,element){
      $(element).contents().unwrap();
  })
}

NooBox.Converter.createCSSStyle=function(){
  var css='.noobox-convert{background: rgba(255,255,100,0.3)}';
  var theStyle=document.createElement('style');
  theStyle.type='text/css';
  theStyle.appendChild(document.createTextNode(css));
  document.head.appendChild(theStyle);
}

NooBox.Converter.pluralToSingle=function(plural){
  if(!NooBox.Converter.inverseUnitPlural){
    NooBox.Converter.inverseUnitPlural={};
    for(var single in NooBox.Converter.plural){
      NooBox.Converter.inverseUnitPlural[NooBox.Converter.plural[single]]=single;
    }
  }
  if(plural in NooBox.Converter.inverseUnitPlural)
    return NooBox.Converter.inverseUnitPlural[plural];
  else
    return plural;
}

NooBox.Converter.parseFloat=function(string){
  var i=string.indexOf('\/');
  if(i!=-1){
    return parseInt(string.slice(0,i))/parseInt(string.slice(i+1));
  }
  else{
    return parseFloat(string);
  }
}

NooBox.Converter.aliasToDefault=function(alias){
  if(!NooBox.Converter.inverseUnitAlias){
    NooBox.Converter.inverseUnitAlias={};
    for(var type in NooBox.Converter.data){
      for(var unit in NooBox.Converter.data[type]){
        for(var index in NooBox.Converter.alias[unit]){
          NooBox.Converter.inverseUnitAlias[NooBox.Converter.alias[unit][index]]=unit;
        }
      }
    }
  }
  return NooBox.Converter.inverseUnitAlias[alias];
}

NooBox.Converter.unitToType=function(unit){
  if(!NooBox.Converter.inverseUnits){
    NooBox.Converter.inverseUnits={};
    for(var type in NooBox.Converter.data){
      for(var tempUnit in NooBox.Converter.data[type]){
        NooBox.Converter.inverseUnits[tempUnit]=type;
      }
    }
  }
  return NooBox.Converter.inverseUnits[unit];
}

NooBox.Converter.generateInfo=function(value,unit){
  unit=NooBox.Converter.pluralToSingle(unit);
  unit=NooBox.Converter.aliasToDefault(unit);
  var type=NooBox.Converter.unitToType(unit);
  var defaultUnit=NooBox.Converter.defaultUnit[type];
  var ratio=NooBox.Converter.data[type][defaultUnit]/NooBox.Converter.data[type][unit];
  return value*ratio+" "+defaultUnit;
}

NooBox.Converter.convert=function(){
  var allUnits='ainoob';
  for(var type in NooBox.Converter.data){
    for(var unit in NooBox.Converter.data[type]){
      for(var index in NooBox.Converter.alias[unit]){
        var newUnit=NooBox.Converter.alias[unit][index];
        if(NooBox.Converter.plural[newUnit])
          allUnits+='|'+NooBox.Converter.plural[newUnit];
        allUnits+='|'+newUnit;
      }
    }
  }
  var unitRegex=new RegExp('('+allUnits+')','g');
  var valueRegex=new RegExp('([+-]?\\s?\\d+(([\\d,\\s]*([\\.\\/][\\d\\s]*)?)|(\\.[\\d\\s]*))(E[+-]?\\d+)?)(\\s*)$','');
  NooBox.Converter.highlight(unitRegex,valueRegex,unit);
}

/* bellow is the code from
 * http://stackoverflow.com/questions/31275446/how-to-wrap-part-of-a-text-in-a-node-with-javascript
 *
 */
NooBox.Converter.highlight=function(unitRegex,valueRegex,unit) {
  var nodes = [],
      text = "",
      node,
      nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT, null, false);
  while (node = nodeIterator.nextNode()) {
    nodes.push({
      textNode: node,
      start: text.length
    });
    text += node.nodeValue
  }
  if (!nodes.length)
    return;
  var unitMatch;
  var valueMatch;
  while (unitMatch = unitRegex.exec(text)) {
    var d=new Date();
    var unitMatchLength= unitMatch[0].length;
    // Prevent empty matches causing infinite loops        
    if (!unitMatchLength)
    {
      unitRegex.lastIndex++;
      continue;
    }
    var sliceStart=unitMatch.index-NooBox.Converter.valueMaxLength;
    sliceStart=sliceStart<0?0:sliceStart;
    valueMatch=valueRegex.exec(text.slice(sliceStart,unitMatch.index));
    if(valueMatch){
      var valueMatchLength= valueMatch[0].length;
      var sameDOMFactor=0;
      for (var i = 0; i < nodes.length; ++i) {
        node = nodes[i];
        var nodeLength = node.textNode.nodeValue.length;
        // Skip nodes before the match
        if (node.start + nodeLength <= valueMatch.index+sliceStart)
          continue;
        // Break after the match
        if (node.start >= unitMatch.index + unitMatchLength)
          break;
        if (node.start < valueMatch.index+sliceStart && node.start + nodeLength > unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor){
          sameDOMFactor=1;
        }
        // Split the start node if required
        if (node.start < valueMatch.index+sliceStart) {
          nodes.splice(i + 1, 0, {
            textNode: node.textNode.splitText(valueMatch.index+sliceStart - node.start),
            start: unitMatch.index
          });
          continue;
        }
        // Split the end node if required
        if (node.start + nodeLength > unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor) {
          nodes.splice(i + 1, 0, {
            textNode: node.textNode.splitText(unitMatch.index + unitMatchLength +valueMatchLength*sameDOMFactor- node.start),
            start: unitMatch.index + unitMatchLength
          });
        }
        // Highlight the current node
        var spanNode = document.createElement("span");
        spanNode.className = 'noobox-convert';
        spanNode.setAttribute('noobox-convert-value',valueMatch[0]);
        spanNode.setAttribute('noobox-convert-unit',unitMatch[0]);
        spanNode.setAttribute('title',NooBox.Converter.generateInfo(NooBox.Converter.parseFloat(valueMatch[0].replace(/[\,\s]/,'')),unitMatch[0]));
        node.textNode.parentNode.replaceChild(spanNode, node.textNode);
        spanNode.appendChild(node.textNode);
      }
    }
  }
}

init();

function isOn(key,callbackTrue,callbackFalse){
  get(key,function(value){
    if(value=='1'){
      if(callbackTrue){
        callbackTrue();
      }
    }
    else{
      if(callbackFalse){
        callbackFalse();
      }
    }
  });
}

function setIfNull(key,setValue,callback,callbackCallback){
  get(key,function(value){
    if(!value){
      set(key,setValue,callback);
    }
    else{
      if(callback)
        callback(callbackCallback);
    }
  });
}

function set(key,value,callback){
  var temp={};
  temp[key]=value;
  chrome.storage.sync.set(temp,callback);
}

function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}
