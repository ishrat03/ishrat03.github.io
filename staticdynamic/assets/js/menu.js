$(document).ready(function()
{
	if (typeof $.cookie('test') === 'undefined')
	{
		window.location.replace('../index.html');
	}
	
	$.cookie('test', 'this is testing');
	$('#home').click(function(e)
	{
		e.preventDefault();
		var url = 'dashboard.html',
		data = '';
		menuAjax(url, data);
	})

	$('#convert').click(function(e)
	{
		e.preventDefault();
		var url = 'texttovoice.html',
		data = '';
		menuAjax(url, data);
	})
})