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

function ajaxPost(url, data)
{
	var result;
	$.ajax(
	{
		url:url,
		type:'post',
		data:data,
		dataType:'json',
		async:false,
		success:function(response)
		{
			result = response;
		},
		error:function(response)
		{
			result = response;
		}
	})

	return result;
}