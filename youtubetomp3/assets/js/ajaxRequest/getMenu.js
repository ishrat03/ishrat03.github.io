$(document).ready(function()
{
	getMenu('playlist.html', 'dashboardloader');
})
$('#userProfile').click(function(e)
{
	e.preventDefault();
	getMenu('userProfile.html', 'userloader');
	setActive('userProfile');
})

$('#dashboardMenu').click(function(e)
{
	e.preventDefault();
	getMenu('playlist.html', 'dashboardloader');
	setActive('dashboardMenu');
})

$('#table').click(function(e)
{
	e.preventDefault();
	showMessage('warning', 'Comming soon', 'center');
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

function setActive(change)
{
	$('#'+change).addClass('active');
	$('#'+currentMenu).removeClass('active');
	currentMenu = change;
}
