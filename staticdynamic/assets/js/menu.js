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
		var data = {id: $.cookie('id'), key:$.cookie('key'), requestFrom:'staticdynamic'};

		var result = ajaxPost(url, data);
		if (result.status == 'success')
		{
			console.log(result.data);
			$('#content').html(result.data);
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