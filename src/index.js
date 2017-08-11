const express = require('express')
import morgan from 'morgan'
import {createStore, applyMiddleware, combineReducers, bindActionCreators} from 'redux'
import thunkMiddleware from 'redux-thunk'
import bodyParser from 'body-parser'
import account, { session } from './account'
import lifecycle, { end } from './lifecycle'

const internalActions = {
  end, session
}

const walkToSolveActions = (store, actions, actionCreators) => new Promise( async (resolve, reject) => {
  try {
    if (actions.length === 0) return resolve()
    const [requestAction, requestParams] = actions.shift()
    if (!actionCreators.hasOwnProperty(requestAction)) return reject(new Error('Action not found'))
    const result = actionCreators[requestAction](requestParams)
    if (result instanceof Promise) await result
    await walkToSolveActions(store, actions, actionCreators)
    resolve()
  } catch(e){
    reject(e)
  }
})

const loggerMiddleware = store => next => action => {
  if (process.env.NODE_ENV !== 'production') console.warn(action)
  return next(action)
};

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
)(createStore)

const {
  PORT = 8080
} = process.env

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/api', async (req, res, next) => {

  const initialState = {
    account: {
      gender: 1,
      req
    }
  }

  const store = createStoreWithMiddleware(combineReducers({
    account,
    lifecycle
  }), initialState)

  const { actions } = req.body
  console.log( bindActionCreators(internalActions, store.dispatch) )
  await walkToSolveActions(store, actions, bindActionCreators(internalActions, store.dispatch))
  const result = store.getState()
  delete result.account.req
  res.json(result)

})

app.use((req, res) => {
  res.json({error: 'NotFoundError'})
})

app.listen(PORT, console.log(`listening on port ${PORT}`))