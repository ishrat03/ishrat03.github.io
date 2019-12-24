$(document).ready(function()
{
	if (typeof $.cookie('id') != 'undefined')
	{
		window.location.replace('webpages/index.html');
	}
	audio('welcome.mp3');
	$('#audioplay').trigger('play');
	
	$('.submit').click(function()
	{
		var username = $('#username').val();
		var password = $('#password').val();
		var data = {username:username, password:password, requestFrom:'static'};
		var url = baseUrl;
		var result = ajaxRequest(url, data);
		if (result.status == 'valid')
		{
			console.log(result);
			$.cookie('id', result.data.id);
			$.cookie('name', result.data.name);
			window.location.replace('webpages/index.html');
		}

		else if (result.status == 'invalid')
		{
			alert('Invalid username or password');
		}
	})

	$('#username').on('click', function()
	{
		audio('username.mp3');
	});

	$('#password').on('click', function()
	{
		audio('password.mp3');
	})

	$('.submit').on('mouseover', function()
	{
		var username = $('#username').val();
		var password = $('#password').val();

		if (username != '' || password != '')
		{
			audio('submit.mp3');
		}
	})
	
})

function ajaxRequest(url, data, method = 'POST')
{
	var result;
	$.ajax({
		url:url,
		type:method,
		dataType:'json',
		data:data,
		async:false,
		success:function(response)
		{
			result = response;
		},
		error:function(response)
		{
			console.log(response.statusCode);
		}
	})

	return result;
}

function initialFunction(text)
{
	var url = 'http://localhost/youtubetomp3/auth/api';
	var data = {text:text};
	ajaxRequest(url, data);
}

function audio(audio)
{
	$('#apiText').html('<audio controls autoplay id="audioplay"><source src="voice/'+audio+'" type="audio/mp3"></audio>');
}