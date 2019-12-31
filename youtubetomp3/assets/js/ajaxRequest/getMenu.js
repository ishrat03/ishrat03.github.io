$(document).ready(function()
{
	getMenu('playlist.html', 'dashboardloader');
})
$('#userProfile').click(function(e)
{
	e.preventDefault();
	getMenu('userProfile.html', 'userloader');
	$.getScript('../assets/js/ajaxRequest/editUserProfile.js');
})

$('#dashboardMenu').click(function(e)
{
	e.preventDefault();
	getMenu('playlist.html', 'dashboardloader');
})
