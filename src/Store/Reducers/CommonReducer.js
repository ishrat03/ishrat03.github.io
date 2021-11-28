import { UPDATE_CURRENCY } from "../../Constants";

const Currency = (state = {}, {type, payload}) =>
{
	if(type === UPDATE_CURRENCY)
	{
		return payload;
	}

	return state;
}

export default Currency;