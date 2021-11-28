import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import {ADMISSION_STD, FEES_STD_SET, ServiceDomain} from '../../../../../Constants'
import UpdateToken from "../../../../../UpdateToken";
import Select from 'react-select';
import Swal from 'sweetalert2';

const CustomStandard = (props) =>
{
	const [standard, updateStandard] = useState('')
	const [loading, udpateLoading] = useState(false)
	const [loading1, udpateLoading1] = useState(false)
	const {addToast} = useToasts();
	// const history = useHistory();
	const [session, updateSessions] = useState({})
	const [selectedSession, updateSelectedSession] = useState('')
	const [customStd, updateCustomStd] = useState([])
	const [searchSession, updateSearchSession] = useState('')

	const UpdateStandard = (e) =>
	{
		updateStandard(e.target.value)
	}

	const AddStandard = (e) =>
	{
		e.preventDefault();
		udpateLoading(true)
		if(standard === '')
		{
			addToast('Please add valid standard name', {appearance:'warning', autoDismiss:true})
			udpateLoading(false)
			return false;
		}

		let std = {'standard': standard, 'session':selectedSession}
		fetch(`${ServiceDomain}addcustomstandard`,
		{
			method:'POST',
			headers:{
				'Content-type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID'),
			},
			body:JSON.stringify(std)
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json()
		})
		.then((result) =>
		{
			addToast(result.header.msg, {appearance:result.header.status, autoDismiss:true});
			if (result.header.code === 200)
			{
				getCustomStandard({value:searchSession})
				updateStandard('')
				updateSelectedSession('')
				updateStd()
			}

			udpateLoading(false)
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
			udpateLoading(false)
		});
	}

	const SetSession = (value) =>
	{
		updateSelectedSession(value.value)
	}

	const getCustomStandard = (value) =>
	{
		if(value.value === '')
		{
			addToast('Please select valid session', {appearance:'warning', autoDismiss:true})
			return false;
		}
		udpateLoading1(true)
		updateSearchSession(value.value)
		fetch(`${ServiceDomain}getcustomstandard?session=${value.value}`,
		{
			method:'GET',
			headers:{
				'Content-type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID'),
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
				updateCustomStd(result.body.result)
			}

			udpateLoading1(false)
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
			udpateLoading1(false)
		});
	}

	const DeleteStandard = (id) =>
	{
		Swal.fire(
			{
				title: 'Are you sure?',
				text: "You won't be able to recover this Standard later",
				icon:'info',
				showCancelButton: true,
				confirmButtonText: `Yes Delete it`,
				showLoaderOnConfirm:true,
				preConfirm: () =>
				{
					return fetch(`${ServiceDomain}deletecustomstandard/${id}`,{method:'delete', headers:{'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('Session-ID')}})
							.then(response =>
								{
									if (!response.ok)
									{
										throw new Error(response.statusText)
									}
									UpdateToken(response.headers, response.status);

									return response.json()
								})
							.catch(error =>
							{
								Swal.showValidationMessage(
									`Request failed: ${error}`
								)
							})
						},
						allowOutsideClick: () => !Swal.isLoading()
			})
			.then((result) =>
			{
				if (result.isConfirmed)
				{
					addToast(result.value.header.msg, {appearance:result.value.header.status, autoDismiss:true});

					getCustomStandard({value:searchSession});
					updateStd()
				}
			}
		)
	}

	const updateStd = () =>
	{
		fetch(`${ServiceDomain}std`,
		{
			method:'GET',
			headers:{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID') 
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((response) =>
		{
			if(response.header.code === 200)
			{
				props.props.dispatch({type:ADMISSION_STD, payload:response.body.result.admission})
				props.props.dispatch({type:FEES_STD_SET, payload:response.body.result.fees})
			}
		})
	}

	useEffect(() =>
	{
		fetch(`${ServiceDomain}sessions`,
		{
			headers:{
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((response) =>
		{
			if(response.header.code === 200)
			{
				updateSessions(response.body.result.sessions)
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}, [addToast]);

	return (
		<>	
			<div className="row">
				<div className="col-md-12">
					<div className="card-c br-2 card-body">
						<form className="row g-2 align-items-center">
							<div className="col-5">
								<div className="row">
									<div className="col-md-2">
										<label htmlFor="session"><b>Session</b></label>
									</div>
									<div className="col-md-10">
										<Select
											options={session}
											onChange={SetSession}
											id="session"
											//defaultValue={session.filter(option => option.value === props.props.Session)}
										/>
									</div>
								</div>
							</div>
							<div className="col-5">
								<div className="row">
									<div className="col-md-2 text-center">
										<label ><b>Standard</b></label>
									</div>
									<div className="col-md-10 text-center">
										<input  className="form-control" placeholder="Standard Name" id="stdName" onChange={UpdateStandard}/>
									</div>
								</div>
							</div>
							<div className="col-2 text-center">
								{
									(loading)
									? <button className="btn btn-primary btn-sm shadow-lg" disabled>Adding  Standard.....</button>
									: <button className="btn btn-primary btn-sm shadow-lg" onClick={AddStandard}>Add Standard</button>
								}
							</div>
						</form>
					</div>
				</div>
			</div>

			<div className="row my-2">
				<div className="col-12">
					<div className="card-c br-2 card-body shadow-lg">
						<div className="row">
							<div className="col-md-1 text-center">
								<label ><b>Session</b></label>
							</div>
							<div className="col-md-2">
								<Select
									options={session}
									onChange={getCustomStandard}
									id="sessions"
									//defaultValue={session.filter(option => option.value === props.props.Session)}
								/>
							</div>
						</div>
						<hr />
						{
							(loading1)
							? <>
									<span className="text-center">
										<h6>Loading...</h6>
									</span>
								</>
							:
								<>
									{
										(customStd.length > 0)
										? <>
											<div className="table-responsive">
												<table className="table table-sm table-bordered table-striped border-primary">
													<thead>
														<tr>
															<th className="text-center">Session</th>
															<th className="text-center">Standard Name</th>
															<th className="text-center">Action</th>
														</tr>
													</thead>
													<tbody>
														{
															customStd.map((resp, i) =>
															{
																return <tr key={i}>
																	<td className="text-center">
																		{resp.session}
																	</td>
																	<td className="text-center">
																		{resp.std}
																	</td>
																	<td className="text-center">
																		{(resp.deletable) ? <i class="bi bi-trash-fill text-danger" onClick={() => {DeleteStandard(resp._id)}}></i>: null}
																	</td>
																</tr>
															})
														}
													</tbody>
												</table>
											</div>
										</>
										:
											<>
												<span className="text-center">
													<h4>No Data Found</h4>
												</span>
											</>
									}
								</>
						}
					</div>
				</div>
			</div>
		</>
	)
}

export default CustomStandard;