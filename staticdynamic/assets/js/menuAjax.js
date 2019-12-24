function menuAjax(url)
{
	$.ajax(
	{
		url:url,
		type:'get',
		success:function(html)
		{
			$('#content').html(html);
		}
	})
}