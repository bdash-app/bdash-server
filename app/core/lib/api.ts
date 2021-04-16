export const get: <T> (typeof fetch<T> )= async (input, init) => {
  try {
    const res = await fetch(args)
    if (res.ok) {
    } else {
      throw new Error({ status: res.status, statusText: res.statusText })
    }
  } catch (error) {}
}
