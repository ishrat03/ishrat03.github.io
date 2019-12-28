var i = 0;
var txt;
var speed = 50;
$('#login1').click(function()
{
	i = 0;
	txt = '';
	var username = $('#lusername').val();
	var password = $('#lpassword').val();
	$('#error').html('');
	if (validateFields(username, password) == false)
	{
		return true;
	}
	var url = 'auth/validateUser';
	var data = {username:username, password:password, requestFrom:'staticdynamic'};
	var result = postRequest(url, data);
	if (result.status == 'valid')
	{
		$.cookie('name', result.data.name);
		$.cookie('id', result.data.id);
		$.cookie('key', result.key);
		window.location.replace('dashboard/dashboard.html');
	}
	else if (result.status == 'invalid')
	{
		alert('Invalid username or password');
	}
})
