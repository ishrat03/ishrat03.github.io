function postRequest(url, data)
{
    var result;
    $.ajax(
    {
        url:'https://blogapp03.000webhostapp.com/'+url,
        type:'post',
        dataType:'json',
        data:data,
        async:false,
        beforeSend:function()
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

function getMenu(menu, load)
{
    $.ajax(
        {
            url:menu,
            type:'get',
            beforeSend:function()
            {
                $('.'+load).addClass('loader');
            },
            success:function(response)
            {
                $('.content').html(response);
                $('.'+load).removeClass('loader');
            },
            error:function(response)
            {
                $('.'+load).removeClass('loader');
            }
        }
    )
}

function postRequestWithImage(url, data)
{
    var result;
    $.ajax(
		{
			url:'https://blogapp03.000webhostapp.com/'+url,
			type:'post',
			dataType:'json',
			data:data,
			processData:false,
			contentType:false,
			cache:false,
			async:false,
			beforeSend:function()
			{

			},
			success:function(data)
			{
                result = data;
			},
			error:function(data)
			{
				result = data;
			}
		}
	)

    return result;
}
