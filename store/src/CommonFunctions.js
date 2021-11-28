import { useToasts } from "react-toast-notifications"

const ShowError = (data) =>
{
	const {addToast} = useToasts();
	Object.keys(data).forEach((result) =>
	{
		data[result].forEach((resp) =>
		{
			addToast(resp, {appearance:'error', autoDismiss:false});
		})
	})
}

const Loading = () =>
{
	return (
		<>
			<div className="text-center">
				<h3 className="lighter-font">Loading...</h3>
			</div>	
		</>
	)
}

export default ShowError;
export {Loading};