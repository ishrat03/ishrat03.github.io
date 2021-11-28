import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {ServiceDomain} from "../../../../Constants";
import UpdateToken from '../../../../UpdateToken';

const ViewStudentDetails = () =>
{
	const params = useParams();
	const {addToast} = useToasts();
	const [data, updateData] = useState({});

	const LoadStudentDetails = useCallback(() => 
	{
		fetch(`${ServiceDomain}viewStudent/${params.id}`,
		{
			method:"GET",
			headers:{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json()
		})
		.then((result) =>
		{
			if (result.header.code === 200)
			{
				updateData(result.body.result);
			}
		})
		.catch(error => addToast(error.message, {appearance:'error', autoDismiss:true}))
	},[addToast, params])

	useEffect(() =>
	{
		LoadStudentDetails()
	}, [LoadStudentDetails])

	return (
		<>
			<div className="text-center">
				<h3 style={{fontWeight:'lighter'}}>Student Details</h3>
			</div>
			<hr />
			<div className="table-responsive">
				<table className="table table-bordered table-stripped">
					<tbody>
						{
							Object.keys(data).map((resp, i) =>
							{
								return <tr key={i}>
									<th className="text-center align-middle">
										{resp}
									</th>
									<td className="text-center align-middle">
										{
											(resp !== 'Image')
											?
												data[resp]
											:
												<img src={data[resp]} width="100" height="100" style={{borderRadius:'50%'}} alt="pictures not available"/>
										}
									</td>
								</tr>
							})
						}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default ViewStudentDetails;