$(document).ready(function()
{
	if (typeof $.cookie('id') === 'undefined')
	{
		window.location.replace('../index.html');
	}
	
	$('#home').click(function(e)
	{
		e.preventDefault();
		// var url = 'dashboard.html',
		// data = '';
		// menuAjax(url, data);
		var url = 'http://localhost/youtubeVideos/playlist';
		var data = {id: $.cookie('id'), requestFrom:'janedebe'};

		var result = ajaxPost(url, data);
		if (result.status == 'success')
		{
			$('#content').html(result.html);
		}
		else
		{
			alert(result.msg);
		}
	})

	$('#convert').click(function(e)
	{
		e.preventDefault();
		var url = 'texttovoice.html',
		data = '';
		menuAjax(url, data);
	})
})