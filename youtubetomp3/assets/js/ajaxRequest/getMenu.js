$(document).ready(function()
{
	getMenu('playlist.html', 'dashboardloader');
})
$('#userProfile').click(function(e)
{
	e.preventDefault();
	getMenu('userProfile.html', 'userloader');
})

$('#dashboardMenu').click(function(e)
{
	e.preventDefault();
	getMenu('playlist.html', 'dashboardloader');
})
