$(document).ready(function()
{
	var url = 'youtubeVideos/playlist';
	var data = {requestFrom:'staticdynamic',key:$.cookie('key'), id:$.cookie('id')};

	var result = postRequest(url, data);
	if (result.status == 'success')
	{
		$('#playlistContents').html('');
		$.each(result.data, function(index, value)
		{
			$('#playlistContents').append('<tr><td>'+(index + 1)+'</td><td>'+value.name + '</td><td><img src="http://blogapp03.000webhostapp.com/assets/snapshots/'+ value.snapshot + '" class="img-thumbnail" style="width: 100px" alt="agar dil kahe ki"></td> <td>Delete</td><tr>');
		})
	}
})
