import { match, when } from 'match-when'

const defaultState = {
  status: 'PENDING',
}

export default (state=defaultState, action) => match(action.type, {
  [when('@@lifecycle/STATUS_UPDATE')]: () => {
    const { status } = action.payload
    return Object.assign({}, state, { status })
  },
  [when()]: state
})

export const end = () => ({
  type: '@@lifecycle/STATUS_UPDATE',
  payload: {
    status: 'READY'
  }
})