function postRequest(url, data)
{
    var result;
    $.ajax(
    {
        url:'http://localhost/youtubetomp3/'+url,
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
