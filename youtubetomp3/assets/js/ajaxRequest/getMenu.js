$(document).ready(function()
{
	getMenu('playlist.html', 'dashboardloader');
})
$('#userProfile').click(function(e)
{
	e.preventDefault();
	$('#userProfile').addClass('active');
	$('#'+currentMenu).removeClass('active');
	currentMenu = 'userProfile';
	getMenu('userProfile.html', 'userloader');
})

$('#dashboardMenu').click(function(e)
{
	e.preventDefault();
	$('#dashboardMenu').addClass('active');
	$('#'+currentMenu).removeClass('active');
	currentMenu = 'dashboardMenu';
	getMenu('playlist.html', 'dashboardloader');
})
