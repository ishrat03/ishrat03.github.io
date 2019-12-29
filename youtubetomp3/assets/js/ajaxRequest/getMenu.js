$('#userProfile').click(function(e)
{
	e.preventDefault();
	getMenu('userProfile.html', 'userloader');
	$.getScript('../assets/js/ajaxRequest/editUserProfile.js');
})
