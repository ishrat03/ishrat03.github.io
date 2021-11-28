import store from './Store/Store';
const UpdateToken = (headers, code) =>
{
	headers.forEach((val, i) =>
	{
		if(code !== 401)
		{
			if(i === 'token')
			{
				localStorage.setItem('Session-ID', val);
			}
		}
	})

	if(code === 401)
	{
		localStorage.clear();
		store.dispatch({type:'UPDATE_LOGIN', payload:false});
	}
}

export default UpdateToken;