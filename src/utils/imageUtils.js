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

