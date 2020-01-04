$('#playlistItem').submit(function(e)
{
    e.preventDefault();
    $('#insertPlaylist').text('Adding...');
    var data = new FormData(this);
    data.append('requestFrom', 'staticdynamic');
    data.append('key',$.cookie('key'));
    data.append('id', $.cookie('id'));
    var result = postRequestWithImage('youtubeVideos/playlistInsertInDb', data);
    if (result == 'success')
    {
        showMessage('success', "Playlist insertd successfully.");
        $('#insertPlaylist').text('Add');
        $('#close').trigger('click');
        getInitialPlaylists();
    }
})

function showMessage(icon, message)
{
	Swal.fire(
	{
		position: 'top-end',
		icon: icon,
		title: message,
		showConfirmButton: false,
		timer: 1500
	});
}

function getInitialPlaylists()
{
	var url = 'youtubeVideos/playlist';
	var data = {requestFrom:'staticdynamic',key:$.cookie('key'), id:$.cookie('id')};

	var result = postRequest(url, data);
	if (result.status == 'success')
	{
		$('#playlistContents').html('');
		$.each(result.data, function(index, value)
		{
			$('#playlistContents').append('<tr onclick='+"'"+'videosAction("'+value.id+'", "'+value.snapshot+'","'+value.playlists+'")'+"'"+'><td>'+(index + 1)+'</td><td>'+value.name + '</td><td><img src="http://blogapp03.000webhostapp.com/assets/snapshots/'+ value.snapshot + '" class="img-thumbnail" style="width: 100px" alt="agar dil kahe ki"></td> <td><i class="fas fa-trash-alt"></i></td><tr>');
		})
	}
}
