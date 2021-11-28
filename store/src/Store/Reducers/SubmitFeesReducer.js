import {FEESSHORTDETAILS, FEESSTRUCTURERED, FEESTOTAL, SELECTEDSTDFS, UMFT} from '../../Constants';

const SubmitFeesReducer = (state = {}, {type, payload}) =>
{
	if (type === UMFT)
	{
		return payload;
	}

	return state;
}

const FeeStructureReducer = (state = {}, {type, payload}) =>
{
	if(type === FEESSTRUCTURERED)
	{
		return payload;
	}
	
	return state;
}

const FeesShortDetailsReducer = (state = {}, {type, payload}) =>
{
	if(type === FEESSHORTDETAILS)
	{
		return payload;
	}

	return state;
}

const FeesTotal = (state = {}, {type, payload}) =>
{
	if(type === FEESTOTAL)
	{
		return payload;
	}

	return state;
}

const SelectedStdFS = (state = {}, {type, payload}) =>
{
	if(type === SELECTEDSTDFS)
	{
		return payload;
	}

	return state;
}

export default SubmitFeesReducer;
export {
	FeeStructureReducer,
	FeesShortDetailsReducer,
	FeesTotal,
	SelectedStdFS
};