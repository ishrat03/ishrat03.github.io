import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import LoginReducer from './Reducers/LoginReducer';
import thunk from 'redux-thunk';
import StdReducer, { Admission, Fees, PageReducerStd, Session } from './Reducers/StdReducer';
import Currency from './Reducers/CommonReducer';
import StdReducerFees from './Reducers/FeesReducer';
import SubmitFeesReducer, { FeesShortDetailsReducer, FeesTotal, FeeStructureReducer, SelectedStdFS } from './Reducers/SubmitFeesReducer';

const allReducers = combineReducers(
	{
		'login':LoginReducer,
		'std' : StdReducer,
		'stdPage' : PageReducerStd,
		'currency' : Currency,
		'feesStd' : StdReducerFees,
		'feesStdSet' : Fees,
		'admissionStd' : Admission,
		'monthlyFeesTotal' : SubmitFeesReducer,
		'feesStructure' : FeeStructureReducer,
		'feesShortDetails' : FeesShortDetailsReducer,
		'feesTotal' : FeesTotal,
		'selectedStdFs' : SelectedStdFS,
		'Session': Session,
	}
)


const ValidateLogin = () =>
{
	const sessId = localStorage.getItem('Session-ID');
	if (sessId === null)
	{
		return false;
	}

	return true;
}

const InitialStates =
{
	login: ValidateLogin(),
	std : '',
	stdPage: 1,
	currency: "&#8377;",
	feesStd : '',
	feesStdSet : [],
	admissionStd : [],
	monthlyFeesTotal : [],
	feesStructure : [],
	feesShortDetails : [],
	feesTotal : 0,
	selectedStdFs: '',
	Session: '',
}

const middleware = [thunk];
const store = createStore(
	allReducers,
	InitialStates,
	compose(
		applyMiddleware(...middleware),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		)
	);
export default store;