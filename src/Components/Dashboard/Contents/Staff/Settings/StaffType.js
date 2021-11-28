import { useCallback, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { ServiceDomain } from "../../../../../Constants";
import UpdateToken from "../../../../../UpdateToken";
import Swal from 'sweetalert2';
import $ from 'jquery';

const StaffType = (props) =>
{
	const [staffType, updateStaffType] = useState('');
	const {addToast} = useToasts();
	const [customStaffType, UpdateCustomStaffType] = useState([])
	const [customStaffTypeById, UpdateStaffById] = useState({id:'',name:''})
	const [loading, updateLoading] = useState(false)

	const UpdateStafftypes = (e) =>
	{
		updateStaffType(e.target.value);
	}

	const UpdateStafftypesEdit = (e) =>
	{
		let data = {...customStaffTypeById}
		data['name'] = e.target.value;
		UpdateStaffById(data);
	}

	const AddStaffType = () =>
	{
		if(staffType.length < 2)
		{
			addToast('Please enter Valid Staff Type', {appearance:'warning', autoDismiss:true})
			return false;
		}

		addToast('Adding Custom Staff Type, Please wait..', {appearance:'warning', autoDismiss:true})
		fetch(`${ServiceDomain}addcustomstafftype`,
		{
			method:'POST',
			headers:{
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + localStorage.getItem('Session-ID')
			},
			body:JSON.stringify({staffType:staffType})
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json()
		})
		.then((response) =>
		{
			addToast(response.header.msg, {appearance:response.header.status, autoDismiss:true})
			if(response.header.code === 200)
			{
				updateStaffType('');
				FetchCustomStaff();
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}

	const DeleteCustomStaff = (id) =>
	{
		Swal.fire(
			{
				title: 'Are you sure?',
				text: "You won't be able to recover this later!",
				icon:'info',
				showCancelButton: true,
				confirmButtonText: `Yes Delete it`,
				showLoaderOnConfirm:true,
				preConfirm: () =>
				{
					return fetch(`${ServiceDomain}deletecustomstaff/${id}`,{method:'delete', headers:{'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('Session-ID')}})
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
					FetchCustomStaff();
				}
			}
		)
	}

	const FetchCustommStaffById = (id) =>
	{
		if(id !== '')
		{
			addToast('Fetching Details, Please wait..', {appearance:'warning', autoDismiss:true})
			fetch(`${ServiceDomain}editcustomstafftype/${id}`,
			{
				headers:{
					'Content-Type':'application/json',
					'Authorization':'Bearer ' + localStorage.getItem('Session-ID')
				}
			})
			.then((resp) =>
			{
				UpdateToken(resp.headers, resp.status);
				return resp.json()
			})
			.then((response) =>
			{
				if(response.header.code === 200)
				{
					let data = {id:response.body.result.id, name:response.body.result.name}
					UpdateStaffById(data);
					$('#inputBox').show('slow');
					$('#updateButton').show('slow');
				}
			})
			.catch((error) =>
			{
				addToast(error.message, {appearance:'error', autoDismiss:true})
			})
		}
	}

	const UpdateCustomStaff = () =>
	{
		addToast('Updating Custom Staff Type, Please wait..', {appearance:'warning', autoDismiss:true})
		fetch(`${ServiceDomain}updatecustomstafftype`,
		{
			method:'PATCH',
			headers:{
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + localStorage.getItem('Session-ID')
			},
			body:JSON.stringify(customStaffTypeById)
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json()
		})
		.then((response) =>
		{
			if(response.header.code === 200)
			{
				addToast(response.header.msg, {appearance:response.header.status, autoDismiss:true})
				let data = {id:'', name:''}
				UpdateStaffById(data);
				$('#inputBox').hide('slow');
				$('#updateButton').hide('slow');
				FetchCustomStaff()
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}
	
	const FetchCustomStaff = useCallback(() =>
	{
		updateLoading(true)
		fetch(`${ServiceDomain}getcustomstafftype`,
		{
			headers:{
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json()
		})
		.then((response) =>
		{
			if(response.header.code === 200)
			{
				UpdateCustomStaffType(response.body.result);
			}
			updateLoading(false)
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
			updateLoading(false)
		})
	},[addToast])

	useEffect(() =>
	{
		FetchCustomStaff()
	}, [FetchCustomStaff]);

	return (
		<>
			<div className="card-c br-1 shadow-lg card-body">
				<div className="row g-3">
					<div className="col-sm-4">
						<input type="text" className="form-control" placeholder="Staff Type" aria-label="staffType" name="staffType" onChange={UpdateStafftypes} value={staffType}/>
					</div>
					<div className="col-sm">
						<button className="btn btn-primary" onClick={AddStaffType}>Submit</button>
					</div>
					
					<div className="col-sm-4" id="inputBox" style={{display:'none'}}>
						<input type="hidden" value={customStaffTypeById.id} />
						<input type="text" className="form-control" placeholder="Staff Type" aria-label="staffType" name="staffType" onChange={UpdateStafftypesEdit} value={customStaffTypeById.name}/>
					</div>
					<div className="col-sm" id="updateButton" style={{display:'none'}}>
						<button className="btn btn-primary" onClick={UpdateCustomStaff}>Update</button>
					</div>
				</div>
			</div>
			<div className="card-c br-1 shadow-lg my-2">
				<div className="card-header text-center">
					<h3 className="lighter-font">Custom Staff Types</h3>
				</div>
				<div className="card-body">
					{
						(loading === false)
						? <>
							{
								(customStaffType.length > 0)
								?
									<div className="table-response">
										<table className="table table-sm table-bordered table-striped border-primary">
											<thead>
												<tr>
													<th className="text-center">
														Sr.No
													</th>
													<th className="text-center">Staff Name</th>
													<th className="text-center">Action</th>
												</tr>
											</thead>
											<tbody>
												{
													customStaffType.map((resp, i) =>
													{
														return <tr key={i}>
															<td className="text-center">{(i + 1)}</td>
															<td className="text-center">{resp.name}</td>
															<td className="text-center"><i className="bi bi-pencil-square text-primary" onClick={() =>{FetchCustommStaffById(resp.id)}}></i> | <i className="bi bi-trash-fill text-danger" onClick={() => {DeleteCustomStaff(resp.id)}}></i></td>
														</tr>
													})
												}
											</tbody>
										</table>
									</div>
								:
									<div className="text-center">
										<h4 className="lighter-font">No Custom Staff Type Added</h4>
									</div>
							}
							</>
						:
							<div className="text-center">
								<h3 className="lighter-font">Loading....</h3>
							</div>
					}
				</div>
			</div>
		</>
	)
}

export default StaffType;