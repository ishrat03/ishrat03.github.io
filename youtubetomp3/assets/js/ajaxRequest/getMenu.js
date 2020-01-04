$(document).ready(function()
{
	getMenu('playlist.html', 'dashboardloader');
})
$('#userProfile').click(function(e)
{
	e.preventDefault();
	getMenu('userProfile.html', 'userloader');
	setActive('userProfile', 'User Profile');
})

$('#dashboardMenu').click(function(e)
{
	e.preventDefault();
	getMenu('playlist.html', 'dashboardloader');
	setActive('dashboardMenu', 'Dashboard');
})

$('#youtube').click(function(e)
{
	e.preventDefault();
	getMenu('table.html', 'youtubeloader');
	setActive('youtube', 'Youtube');
});

$('#typography').click(function(e)
{
	e.preventDefault();
	showMessage('warning', 'Comming soon', 'center');
});

$('#icons').click(function(e)
{
	e.preventDefault();
	showMessage('warning', 'Comming soon', 'center');
});

$('#maps').click(function(e)
{
	e.preventDefault();
	showMessage('warning', 'Comming soon', 'center');
});

$('#notification').click(function(e)
{
	e.preventDefault();
	showMessage('warning', 'Comming soon', 'center');
});

function setActive(change, title)
{
	$('#'+change).addClass('active');
	$('#'+currentMenu).removeClass('active');
	currentMenu = change;
	$('#titlebar').text(title);
}
