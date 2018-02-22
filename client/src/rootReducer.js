
import { combineReducers } from 'redux'
import authen from './reducers/authen'
import flashMessages from './reducers/flashMessages'

// we use two reducers for our redux
// since this is a fairly simple application
// the only state that is more or less constant is the Profile information, that doesn't update unless a new account
// is created, and the flashMessages, used for basic information output
// since it uses the same logic, we can reuse this flashMessage service all over our application

export default combineReducers({
	authen,
	flashMessages
})
