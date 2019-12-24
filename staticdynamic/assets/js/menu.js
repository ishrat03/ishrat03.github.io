$(document).ready(function()
{
	if (typeof $.cookie('id') === 'undefined')
	{
		window.location.replace('../index.html');
	}
	
	$('#home').click(function(e)
	{
		e.preventDefault();
		var url = baseUrl + 'youtubeVideos/playlist'; 
		var data = {id: $.cookie('id'), requestFrom:'staticdynamic',key:$.cookie('key')};

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