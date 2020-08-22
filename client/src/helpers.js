import { current_user_id, user_token } from './states'

let token

const unsubscribe = user_token.subscribe((value) => {
  token = value
})
export async function fetchPost(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
    user: { _id: current_user_id },
    body: JSON.stringify(data),
  })
  const response = await res.json()
  return response
}

export async function fetchGet(url) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
    user: { _id: current_user_id },
  })
  const response = await res.json()
  return response
}
