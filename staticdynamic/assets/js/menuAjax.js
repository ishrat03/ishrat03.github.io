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
		//headers:{'KEY':$.cookie('key')},
		data:data,
		dataType:'json',
		async:false,
		beforeSend:function(request)
		{

		},
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