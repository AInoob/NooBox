export const sortImageByHeight = function(data,order){
  if(order == 1){
    data.sort(function(a,b){
      return a.imageInfo.height - b.imageInfo.height;
    })
  }else if(order == 2){
    data.sort(function(a,b){
      return b.imageInfo.height - a.imageInfo.height;
    })
  }
}


export const sortImageByWidth = function(data,order){
  if(order == 1){
    data.sort(function(a,b){
      return a.imageInfo.width - b.imageInfo.width;
    })
  }else if(order == 2){
    data.sort(function(a,b){
      return b.imageInfo.width - a.imageInfo.width;
    })
  }
}

export const sortImageByArea = function(data,order){
  if(order == 1){
    data.sort(function(a,b){
      let areaA = a.imageInfo.width* a.imageInfo.height;
      let areaB = b.imageInfo.width* b.imageInfo.height;
      return  areaA - areaB ;
    })
  }else if(order == 2){
    data.sort(function(a,b){
      let areaA = a.imageInfo.width* a.imageInfo.height;
      let areaB = b.imageInfo.width* b.imageInfo.height;
      return areaB - areaA;
    })
  }
}

export const checkUrlOrBase64 = function(item){
  let isBase64 = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
  let isUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  if(item.match(isBase64)){
    return "base64"
  }else if(item.match(isUrl)){
    return "url"
  }else{
    return "no"
  }
}
export const parseGoogleImageLink = function(link){
  let pareseString = /(http|https).*(\.jpg|\.jpeg|\.png|\.gif|\.svg)/g;
  return link.match(pareseString);
}
export const sortImageByRelevance = function(data){
  data.sort(function(a,b){
    if(a.weight && b.weight){
      return  b.weight - a.weight;
    }
  })
}
