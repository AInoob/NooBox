export default (content) => {
  return new Promise((resolve) => {
    browser.runtime.sendMessage(content, response =>{
      resolve(response);
    })
  })
}
