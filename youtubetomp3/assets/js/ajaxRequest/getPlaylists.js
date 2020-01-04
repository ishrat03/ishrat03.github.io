$(document).ready(function()
{
	getInitialPlaylists();
})

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

function videosAction(id, snapshot, playlist)
{
	alert(playlist);
}

function alert(playlist)
{
	const swalWithBootstrapButtons = Swal.mixin({
  		customClass: {
    	confirmButton: 'btn btn-success',
    	cancelButton: 'btn btn-danger'
  	},
  	buttonsStyling: true
	})

	swalWithBootstrapButtons.fire({
  		title: 'Select your choice',
		text: "Do you want to play or delete",
		icon: 'question',
		showCancelButton: true,
		confirmButtonText: 'Play',
		cancelButtonText: 'Delete',
		reverseButtons: true
	}).then((result) => {
  	if (result.value) {
		$('#addVideo').html('<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/'+playlist+'" allowfullscreen autoplay></iframe>');
		$('#down').trigger('click');
  	} else if (
    	/* Read more about handling dismissals below */
    	result.dismiss === Swal.DismissReason.cancel
  	) {
    	swalWithBootstrapButtons.fire(
      		'Cancelled',
      		'Your imaginary file is safe :)',
      		'error'
    		)}
	})
}
