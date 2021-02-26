/*
export function someAction (context) {
}
*/
import { api } from 'boot/axios'

export function register ({ commit }, form) {
  return api.post('/register', form)
    .then(response => {
      api.defaults.headers.common.Authorization = 'Bearer' + response.data.token
      commit('login', { token: response.data.token, user: response.data.user })
    })
}
