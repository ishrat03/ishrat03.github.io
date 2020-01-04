$(document).ready(function()
{
	var url = 'youtubeVideos/googleVideos';
	var data = {id:$.cookie('id'), requestFrom: 'staticdynamic', key: $.cookie('key')};
	var result = postRequest(url, data);
	if (result.status == 'success')
	{
		if (result.integrated == 'no')
		{
			$('#needEmpty').hide();
			$('#integrateButton').append('<center><a href="'+result.url +'"><button class="btn btn-primary btn-sm">Integrate Youtube</button></a></center>');
		}
		else
		{
			$('#youtubeVideos').append('hi i am here');
		}
	}
})
