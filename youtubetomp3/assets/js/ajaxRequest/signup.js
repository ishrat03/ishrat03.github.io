$('#signup1').click(function()
{
	var name = $('#name').val();
	var email = $('#email').val();
	var password = $('#password').val();
	var rpassword = $('#rpassword').val();
	var data = {name:name, email:email,password:password, requestFrom:'staticdynamic'};
	var url = 'auth/register';
	var result = postRequest(url, data);
	if (result.status == 'success')
	{
		$.cookie('name', result.data.name);
		$.cookie('id', result.data.id);
		$.cookie('key', result.key);
		window.location.replace('dashboard/index.html');
	}
	else
	{
		alert('error');
	}
})
