$('#login1').click(function()
{
	var username = $('#lusername').val();
	var password = $('#lpassword').val();

	var url = 'auth/validateUser';
	var data = {username:username, password:password, requestFrom:'staticdynamic'};
	var result = postRequest(url, data);
	if (result.status == 'valid')
	{
		$.cookie('name', result.data.name);
		$.cookie('id', result.data.id);
		$.cookie('key', result.key);
		window.location.replace('dashboard/index.html');
	}
	else if (result.status == 'invalid')
	{
		alert('Invalid username or password');
	}
})
