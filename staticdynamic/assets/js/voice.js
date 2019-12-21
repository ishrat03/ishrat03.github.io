$(document).ready(function()
{
	audio('welcome.mp3');
	$('#audioplay').trigger('play');
	
	$('.submit').click(function()
	{
		var username = $('#username').val();
		var password = $('#password').val();
		var data = {username:username, password:password, requestFrom:'static'};
		var url = 'http://blogapp03.000webhostapp.com/auth/validateUser';
		var result = ajaxRequest(url, data);
		if (result.status == 'valid')
		{
			document.cookie = "id="+result.data.id;
			document.cookie = "name="+result.data.name;
			window.location.replace('webpages/index.html');
		}
	})

	$('#cookie').on('mouseover', function()
	{
		audio('cookie.mp3');
	});

	$('#home').on('mouseover', function()
	{
		audio('home.mp3');
	});

	$('#convert').on('mouseover', function()
	{
		audio('text-converter.mp3');
	});

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