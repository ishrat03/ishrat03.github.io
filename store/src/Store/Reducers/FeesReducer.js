import {FEES_STD} from '../../Constants';

const StdReducerFees = (state = {}, {type, payload}) =>
{
	if (type === FEES_STD)
	{
		return payload
	}

	return state;
}

export default StdReducerFees;