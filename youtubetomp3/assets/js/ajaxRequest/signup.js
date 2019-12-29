var i = 0;
var txt;
var speed = 50;
$('#signup1').click(function()
{
	i = 0;
	txt = '';
	var name = $('#name').val();
	var email = $('#email').val();
	var password = $('#password').val();
	var rpassword = $('#rpassword').val();
	$('#errorSignup').html('');
	if (validateFieldssignup(name, email, password, rpassword) == false)
	{
		return false;
	}
	var data = {name:name, email:email,password:password, requestFrom:'staticdynamic'};
	var url = 'auth/register';
	var result = postRequest(url, data);
	if (result.status == 'success')
	{
		$.cookie('name', result.data.name);
		$.cookie('id', result.data.id);
		$.cookie('username', result.data.username);
		$.cookie('key', result.key);
		window.location.replace('dashboard/dashboard.html');
	}
	else
	{
		alert('error');
	}
})

function validateFieldssignup(name, email, password, rpassword)
{
	var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
	if (name == '')
	{
		txt = 'Empty Name';
		typeWritersignup();
		return false;
	}
	else if (name.length < 3)
	{
		txt = 'Too short Name';
		typeWritersignup();
		return false;
	}
	else if (!pattern.test(email))
	{
		txt = 'Not a valid Email';
		typeWritersignup();
		return false;
	}

	if (password == '')
	{
		txt = 'Empty Password';
		typeWritersignup();
		return false;
	}
	else if (password.length < 6)
	{
		txt = 'Too short Password';
		typeWritersignup();
		return false;
	}
	else if (password != rpassword)
	{
		txt = 'Password mismatch!';
		typeWritersignup();
		return false;
	}
}

function typeWritersignup()
{
  	if (i < txt.length)
	{
		document.getElementById("errorSignup").innerHTML += txt.charAt(i);
		i++;
		setTimeout(typeWritersignup, speed);
  	}
}
