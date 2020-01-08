var i = 0;
var txt;
var speed = 50;
$('#login1').click(function(e)
{
	e.preventDefault();
	login();
})

$('#loginForm').submit(function(e)
{
	e.preventDefault();
	login();
});

function login()
{
	i = 0;
	txt = '';
	// $('#login1').text('Authorizing....');
	var username = $('#lusername').val();
	var password = $('#lpassword').val();
	$('#error').html('');
	if (validateFields(username, password) == false)
	{
		$('#login1').text('Log In');
		return true;
	}
	var url = 'auth/validateUser';
	var data = {username:username, password:password, requestFrom:'staticdynamic'};
	var result = postRequest(url, data, 'Authorizing...', 'login1');
	if (result.status == 'valid')
	{
		$.cookie('name', result.data.name);
		$.cookie('id', result.data.id);
		$.cookie('username', result.data.username);
		$.cookie('key', result.key);
		window.location.replace('dashboard/dashboard.html');
	}
	else if (result.status == 'invalid')
	{
		txt = 'Invalid username or password';
		typeWriter();
		$('#login1').text('Log In');
		// alert('Invalid username or password');
	}
}
