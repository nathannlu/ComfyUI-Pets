/**
 * Responsible for interacting with ComfyUI backend,
 * or cloud
 */

let cache = {}

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
  const userId = user?.user_id;
  console.log("got user id", userId, user)
  return user;
}
