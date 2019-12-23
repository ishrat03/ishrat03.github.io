$(document).ready(function()
{
	$('#cookie').mouseover(function()
	{
		audio('cookie.mp3');
	});

	$('#home').mouseover(function()
	{
		$('#btn').click(function(){
			myAudioControl.play();
		});

		$('#btn').trigger('click');
		audio('home.mp3');
	});

	$('#convert').on('mouseover', function()
	{
		audio('text-converter.mp3');

	});
})

function audio(audio)
{
	$('#apiText').html('<audio controls id="audioplay"><source src="../voice/'+audio+'" type="audio/mp3"></audio>');
	$('#audioplay').trigger('play');
	$('#apiText').hide();
}