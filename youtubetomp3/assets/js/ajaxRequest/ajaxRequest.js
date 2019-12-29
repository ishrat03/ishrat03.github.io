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

function getMenu(menu)
{
    $.ajax(
        {
            url:menu,
            type:'get',
            beforeSend:function()
            {

            },
            success:function(response)
            {
                $('.content').html(response);
            },
            error:function(response)
            {

            }
        }
    )
}
