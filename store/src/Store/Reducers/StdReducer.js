import { ADMISSION_STD, FEES_STD_SET, SESSION, UPDATE_STD } from '../../Constants';
import { UPDATE_PAGE_STD } from '../../Constants';

const StdReducer = (state = {}, {type, payload}) =>
{
	if (type === UPDATE_STD)
	{
		return payload
	}

 	return state;
}

const PageReducerStd = (state = {}, {type, payload}) =>
{
	if(type === UPDATE_PAGE_STD)
	{
		return payload;
	}

	return state;
}

const Admission = (state = {}, {type, payload}) =>
{
	if(type === ADMISSION_STD)
	{
		return payload;
	}

	return state;
}

const Fees = (state = {}, {type, payload}) =>
{
	if(type === FEES_STD_SET)
	{
		return payload;
	}

	return state;
}

const Session = (state = {}, {type, payload}) =>
{
	if(type === SESSION)
	{
		return payload;
	}

	return state;
}

export default StdReducer;
export {PageReducerStd, Admission, Fees, Session};