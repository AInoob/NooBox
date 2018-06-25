
export default (content) => {
  return new Promise(function(resolve){
    window.browser.runtime.sendMessage(content,()=>{
      resolve();
    })
  })
}