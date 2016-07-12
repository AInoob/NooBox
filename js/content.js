var NooBox={};
NooBox.Convert={};
NooBox.Convert.replace=false;
NooBox.Convert.defaultUnit={
  weight: 'kg',
  area: 'm^2',
  length: 'meter',
  temperature: 'celsius'
};

NooBox.Convert.data={
  weight: {
    lb: 1,
    pound: 1,
    kg: 0.453592
  }
};



function init(){
  NooBox.Convert.init();
}

NooBox.Convert.init=function(){
  NooBox.Convert.createStyle();
  NooBox.Convert.wrap();
}

NooBox.Convert.createStyle=function(){
  var css='.noobox-convert{background: rgba(255,255,100,0.3)}';
  var theStyle=document.createElement('style');
  theStyle.type='text/css';
  theStyle.appendChild(document.createTextNode(css));
  document.head.appendChild(theStyle);
}


NooBox.Convert.makeTitle=function(value,unit,type){
  var defaultUnit=NooBox.Convert.defaultUnit[type];
  var ratio=NooBox.Convert.data[type][defaultUnit]/NooBox.Convert.data[type][unit];
  return value*ratio+" "+defaultUnit;
}

NooBox.Convert.wrap=function(){
  for(var type in NooBox.Convert.data){
    for(var unit in NooBox.Convert.data[type]){
      var reg=new RegExp('([+-]?(((\\d*\\,*)*\\d+(\\.\\d*)?)|(\\.\\d+)))\\s*'+unit+'s*','g');
      console.log(reg);
      NooBox.Convert.highlight(reg,unit,type);
    }
  }
}

/* bellow is the code from
 * http://stackoverflow.com/questions/31275446/how-to-wrap-part-of-a-text-in-a-node-with-javascript
 *
 */
NooBox.Convert.highlight=function(regex,unit,type) {
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
  var match;
  while (match = regex.exec(text)) {
    var matchLength = match[0].length;

    // Prevent empty matches causing infinite loops        
    if (!matchLength)
    {
      regex.lastIndex++;
      continue;
    }
    for (var i = 0; i < nodes.length; ++i) {
      node = nodes[i];
      var nodeLength = node.textNode.nodeValue.length;
      // Skip nodes before the match
      if (node.start + nodeLength <= match.index)
        continue;
      // Break after the match
      if (node.start >= match.index + matchLength)
        break;
      // Split the start node if required
      if (node.start < match.index) {
        nodes.splice(i + 1, 0, {
          textNode: node.textNode.splitText(match.index - node.start),
          start: match.index
        });
        continue;
      }
      // Split the end node if required
      if (node.start + nodeLength > match.index + matchLength) {
        nodes.splice(i + 1, 0, {
          textNode: node.textNode.splitText(match.index + matchLength - node.start),
          start: match.index + matchLength
        });
      }
      // Highlight the current node
      var spanNode = document.createElement("span");
      spanNode.className = 'noobox-convert';
      spanNode.setAttribute('noobox-convert-value',match[1]);
      spanNode.setAttribute('noobox-convert-unit',match[2]);
      spanNode.setAttribute('noobox-convert-type',type);
      spanNode.setAttribute('title',NooBox.Convert.makeTitle(parseFloat(match[1].replace(/\,|\s/g,'')),unit,type));
      node.textNode.parentNode.replaceChild(spanNode, node.textNode);
      spanNode.appendChild(node.textNode);
    }
  }
}

init();
