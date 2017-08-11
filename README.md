# write server with redux

## Start

```bash
babel-node src
```


## Store


```javascript
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
```



## Action creator

```javascript
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
```

## Reducer

```javascript
export default (state=defaultState, action) => match(action.type, {
  [when('@@account/STATUS_UPDATE')]: () => {
    return Object.assign({}, state, action.payload)
  },
  [when()]: state
})
```


## Request

```json5
{
	"actions": [
	  ["session", {}]
	]
}
```

## Response

```json5
{
    "account": {
        "gender": 1,
        "logged": true
    },
    "lifecycle": {
        "status": "PENDING"
    }
}
```


## License

MIT License.