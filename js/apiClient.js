/**
 * Responsible for interacting with ComfyUI backend,
 * or cloud
 */

let cache = {}

export const ENDPOINT = "https://comfy-pets-cadc142b6d8e.herokuapp.com";
//export const ENDPOINT = "http://localhost:3000";

const fetchWithCache = async (url) => {
  if(url in cache) {
    return cache[url]
  } else{
    const data = await fetch(url).then((x) => x.json())
    cache[url] = data;
    return data
  }
}

export const getCurrentUser = async () => {
  const url = "/comfy-cloud/user"
  const { user } = await fetchWithCache(url)
  const userId = user?.id;
  console.log("got user id", userId, user)
  return user;
}

export async function ping() {
  const user = await getCurrentUser();
  const userId = user?.id
  const url = `${ENDPOINT}/p?e=${userId}`

  await fetch(url)
}
