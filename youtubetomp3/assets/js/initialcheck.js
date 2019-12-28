if (typeof $.cookie('id') != 'undefined')
{
	window.location.replace('dashboard/index.html');
}

function validateFields(username, password)
{
	if (username == '')
	{
		txt = 'Empty Username';
		typeWriter();
		return false;
	}
	else if (username.length < 3)
	{
		txt = 'Too short Username';
		typeWriter();
		return false;
	}

	if (password == '')
	{
		txt = 'Empty Password';
		typeWriter();
		return false;
	}
	else if (password.length < 6)
	{
		txt = 'Too short Password';
		typeWriter();
		return false;
	}
}

function typeWriter()
{
  	if (i < txt.length)
	{
		document.getElementById("error").innerHTML += txt.charAt(i);
		i++;
		setTimeout(typeWriter, speed);
  	}
}
