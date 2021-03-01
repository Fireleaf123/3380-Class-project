
const countClicks = function(){

  const storage = function( name, type ){
      'use strict';
      const engine = !type || type.toLowerCase() === 'local' ? localStorage : sessionStorage;

      const set=function( data ){
          engine.setItem(name, JSON.stringify(data));
      };
      const create=function(){
        if( !exists()) set(arguments[0] || {});
    };
      const get=function(){
          return exists(name)? JSON.parse( engine.getItem(name)) : false;
      };
      const remove=function(){
          engine.removeItem(name);
      };
      const exists=function(){
          return engine.getItem(name)==null ? false : true;
      };

      return Object.freeze({
          set,
          get,
          exists,
          create,
          remove
      });
  }

  let store = new storage('urls', 'sessionStorage');
    store.create();

  let data=store.get();
      data[ location.href ]=data.hasOwnProperty(location.href) ? parseInt(data[location.href]) + 1 : 1;
      data.total=data.hasOwnProperty('total') ? parseInt(data.total) + 1 : 1;

      store.set(data);
}
document.addEventListener('DOMContentLoaded', countClicks);



class recordRead{

}

class movePosts{

};