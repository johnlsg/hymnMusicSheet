export const isLoggedIn = (globalState)=>{
  return globalState.user !== "logged out" && globalState.user !== "loading"
}

export const isLoggedOut = (globalState)=>{
  return globalState.user !== "loading" && globalState.user==="logged out"
}

export const generateID = ()=>{
  const pool = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let ret=''
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  for(let i=0; i<20;i++){
    ret += pool[getRandomInt(0,pool.length)]
  }
  return ret
}
