import { match, when } from 'match-when'

const defaultState = {
  username: '',
  logged: false
}

export default (state=defaultState, action) => match(action.type, {
  [when('@@account/STATUS_UPDATE')]: () => {
    return Object.assign({}, state, action.payload)
  },
  [when()]: state
})


export const session = query => (dispatch, getState) => new Promise(async (resolve) => {
  // do somthing
  dispatch({
    type: '@@account/STATUS_UPDATE',
    payload: {
      logged: true
    }
  })
  resolve()
})