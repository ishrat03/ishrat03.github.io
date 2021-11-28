const LoginReducer = (state = {}, {type, payload}) =>
{
	if (type === 'UPDATE_LOGIN')
	{
		return payload
	}

  return state;
}

export default LoginReducer;