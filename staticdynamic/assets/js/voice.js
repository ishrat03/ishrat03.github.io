$(document).ready(function()
{
	audio('welcome.mp3');
	$('#audioplay').trigger('play');
	
	$('#submit').click(function()
	{
		initialFunction($('#text').val());
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
	$.ajax({
		url:url,
		type:method,
		dataType:'json',
		data:data,
		async:false,
		success:function(response)
		{
			document.cookie = "apiresponse="+response.html;
			document.cookie = "status=success";
			$('#apiText').html(response.html);
		},
		error:function(response)
		{
			console.log(response.statusCode);
		}
	})
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