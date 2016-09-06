var NooBox={};
NooBox.Converter={};
NooBox.Converter.replace=false;
NooBox.Converter.defaultUnit={
  weight: 'kg',
  area: 'm^2',
  length: 'meter',
  temperature: 'celsius'
},
NooBox.Converter.inverseUnits,
NooBox.Converter.valueMaxLength=30;

NooBox.Converter.data={
  weight: {
    pound: 1,
    kg: 0.45359237,
    ounce: 16,
    gram: 453.59237,
    milligram: 453592.37,
    microgram: 453592370,
    'imperial ton': 1/2240,
    'us ton': 1/2000,
    'metric ton': 0.00045359237,
    stone: 1/14
  },
  area: {
  }
};



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

NooBox.Converter.generateInverseUnits=function(){
  NooBox.Converter.inverseUnits={};
  for(var type in NooBox.Converter.data){
    for(var unit in NooBox.Converter.data[type]){
      NooBox.Converter.inverseUnits.unit=type;
    }
  }
}

NooBox.Converter.unitToType=function(unit){
  if(!NooBox.Converter.inverseUnits){
    NooBox.Converter.generateInverseUnits();
  }
  return NooBox.Converter.inverseUnits.unit;
}

NooBox.Converter.generateInfo=function(value,unit){
  if(unit[unit.length-1]=='s')
      unit=unit.slice(0,unit.length-1);
  var type=NooBox.Converter.unitToType(unit);
  var defaultUnit=NooBox.Converter.defaultUnit[type];
  var ratio=NooBox.Converter.data[type][defaultUnit]/NooBox.Converter.data[type][unit];
  return value*ratio+" "+defaultUnit;
}

NooBox.Converter.convert=function(){
  var allUnits='ainoob';
  for(var type in NooBox.Converter.data){
    for(var unit in NooBox.Converter.data[type]){
      allUnits+='|'+unit;
    }
  }
  var unitRegex=new RegExp('('+allUnits+')s*','g');
  var valueRegex=new RegExp('([+-]?(((\\d*\\,*\\s*)*\\d+(\\.(\\d*\\s*)*)?)|(\\.(\\d*\\s*)*))(E[+-]?\\d+)?)(\\s\*)$','');
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
        // Split the start node if required
        if (node.start < valueMatch.index+sliceStart) {
          nodes.splice(i + 1, 0, {
            textNode: node.textNode.splitText(valueMatch.index+sliceStart - node.start),
            start: unitMatch.index
          });
          sameDOMFactor=1;
          continue;
        }
        // Split the end node if required
        if (node.start + nodeLength > unitMatch.index + unitMatchLength) {
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
        spanNode.setAttribute('title',NooBox.Converter.generateInfo(parseFloat(valueMatch[0].replace(/\,|\s/g,'')),unitMatch[0]));
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
  console.log(temp);
  chrome.storage.sync.set(temp,callback);
}

function get(key,callback){
  chrome.storage.sync.get(key,function(result){
    if(callback)
      callback(result[key]);
  });
}
