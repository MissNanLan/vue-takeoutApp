export function saveToLocal(id,key,value){
   let seller = window.localStorage._seller_; //双下划綫是私有的
//如果是第一次储存
   if(!seller){
       seller = {};
       seller[id] = {};
       seller[id][key] = value;
   }else{
       seller = JSON.parse(seller);
       if(!seller[id]){
           seller[id] = {};
        }
   }
   seller[id][key] = value;
   localStorage._seller_ = JSON.stringify(seller);
};

export function loadFromLocal(id,key,def){
  let seller =  window.localStorage._seller_;
  //如果没有seller返回默认值
  if(!seller){
      return def;
  }
  
  seller = JSON.parse(seller)[id];
  //如果没有取得到的话返回默认值，有的话返回id对应的值
  if(!seller){
      return def;
  }
  let ret = seller[key];
  return ret || ref;

}