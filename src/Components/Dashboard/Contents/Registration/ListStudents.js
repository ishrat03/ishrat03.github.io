import { useCallback, useEffect, useState } from 'react';
import {ServiceDomain, SESSION} from '../../../../Constants';
import {useToasts} from 'react-toast-notifications';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { UPDATE_STD } from '../../../../Constants';
import UpdateToken from '../../../../UpdateToken';
import Select from 'react-select';

const ListStudents = (props) =>
{
	const { addToast } = useToasts();
	const std = props.props.admissionStd;
	const [students, updateStudents] = useState([]);
	const [header, updateHeader] = useState([]);
	const [loading, updateLoading] = useState(false);
	const [pagination, updatePagination] = useState([]);
	const [prevPage, upatePrevPage] = useState(1);
	const [session, updateSessions] = useState([])
	
	const FetchCall = useCallback((std, session, page) =>
	{
		if(std === '')
		{
			addToast('Please select Standard', {appearance:'warning', autoDismiss:true})
			return false;
		}

		if(session === '')
		{
			addToast('Please select Session', {appearance:'warning', autoDismiss:true})
			return false;
		}

		updateLoading(true);
		fetch(`${ServiceDomain}liststudents?std=${std}&page=${page}&session=${session}`,
		{
			headers:{
				'Content-Type':'application/json',
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
			updateLoading(false);
			if (result.header.code === 200)
			{
				updateStudents(result.body.result.data);
				updateHeader(result.body.result.header);
				updatePagination(result.body.result.pagination);
			}
		})
		.catch((error) =>
		{
			updateLoading(false);
			addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	}, [addToast])

	const LoadStudents = useCallback(() =>
	{
		FetchCall(1);
	},[FetchCall])
	
	const SetSession = (value) =>
	{
		props.props.dispatch({type:SESSION, payload:value.value});
		FetchCall(props.props.std, value.value, 1)
	}
	
	const SetStd = (value) =>
	{
		props.props.dispatch({type:UPDATE_STD, payload:value.value});
		FetchCall(value.value, props.props.Session, 1)
	}
	
	const DeleteStudent = (id) =>
	{
		Swal.fire(
			{
				title: 'Are you sure?',
				text: "You won't be able to recover this student later",
				icon:'info',
				showCancelButton: true,
				confirmButtonText: `Yes Delete it`,
				showLoaderOnConfirm:true,
				preConfirm: () =>
				{
					return fetch(`${ServiceDomain}deletestudents/${id}`,{method:'delete', headers:{'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('Session-ID')}})
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

					LoadStudents({value:props.props.std});
				}
			}
		)
	}

	const LoadMore = (e, page) =>
	{
		e.preventDefault();
		upatePrevPage(page);
		document.getElementById(`s${prevPage}`).disabled = false;
		document.getElementById(`s${page}`).disabled = true;
		FetchCall(props.props.std , page);
	}
	
	const SearchByName = (e) =>
	{
		e.preventDefault();
		updateLoading(true);
		if(e.target.value === '')
		{
			FetchCall(props.props.std , props.props.Session, props.props.stdPage);
		}
		else
		{
			fetch(`${ServiceDomain}searchbyname?name=${e.target.value}&session=${props.props.Session}`,
			{
				headers:{
					'Content-Type':'application/json',
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
				updateLoading(false);
				if (result.header.code === 200)
				{
					updateStudents(result.body.result.data);
					updateHeader(result.body.result.header);
					updatePagination(result.body.result.pagination);
				}
			})
			.catch((error) =>
			{
				updateLoading(false);
				addToast(error.message, {appearance:'error', autoDismiss:true})
			});
		}
	}
	useEffect(() =>
	{
		if(props.props.std !== '' && props.props.Session !== '')
		{
			FetchCall(props.props.std, props.props.Session, 1)
		}
		
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

	}, [FetchCall, props, addToast])

	return (
		<>
			<div className="card card-body">
				<div className="row">
					<div className="col-md-4 py-2">
						<div className="form-group row">
							<div className="col-md-3">
								<label><b>Standard</b></label>
							</div>
							<div className="col-md-9">
								<Select
									options={std}
									onChange={SetStd}
									id="std"
									defaultValue={std.filter(option => option.value === props.props.std)}
								/>
							</div>
						</div>
					</div>
					<div className="col-md-4 py-2">
						<div className="form-group row">
							<div className="col-md-4">
								<b>Search By Name</b>
							</div>
							<div className="col-md-8">
								<Select
									options={session}
									onChange={SetSession}
									id="session"
									defaultValue={session.filter(option => option.value === props.props.Session)}
								/>
							</div>
						</div>
					</div>
					<div className="col-md-4 py-2">
						<div className="form-group row">
							<div className="col-md-4">
								<b>Search By Name</b>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" placeholder="Enter Student Name" name="searchByName" onChange={SearchByName}/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr />
			<div className="card card-body">
				<div className="row">
					<div className="col-md-12">
						{
							(loading)
							?
								<>
									<div className="text-center">
										<h3 style={{fontWeight:'lighter'}}>Loading data....</h3>
									</div>
								</>
							:
								<>
									{
										(students.length > 0)
										?
											<>
												<div className="table-responsive">
													<table className="table table-sm table-striped table-bordered">
														<thead>
															<tr>
																{
																	header.map((data, i) =>
																	{
																		return <th className="text-center" key={i}>{data}</th>
																	})
																}
																{
																	(header.length > 0)
																	? <th className="text-center">Action</th> : null
																}
																
															</tr>
														</thead>
														<tbody>
															{
																(students.length > 0)
																?
																	students.map((data, i) =>
																	{
																		return <MakeTr data={data} key={i} DeleteStudent={DeleteStudent}/>
																	})
																:
																	null
															}
														</tbody>
													</table>
													<nav aria-label="Page navigation example">
														<ul className="pagination justify-content-end">
															{
																pagination.map((page, i) =>
																{
																	return <li className="page-item" key={i}>
																				<button
																					className="page-link"
																					href="#nolink"
																					onClick={(event) =>{LoadMore(event, page.page)}}
																					id={`s${page.page}`}
																				>
																					{page.page}
																				</button>
																			</li>
																})
															}
														</ul>
													</nav>
												</div>
											</>
										:
											<>
												<div className="text-center">
														<h3 style={{fontWeight:'lighter'}}>
															No Data Found
														</h3>
												</div>
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

const MakeTr = (props) =>
{
	return (
		<>
			<tr>
				{
					Object.keys(props.data).map((result, i) =>
					{
						return (result !== 'id' && result !== 'image') ? <td className="text-center align-middle" key={i} >
							{props.data[result]}
						</td>
						:
							(result === 'image')
							?
								<td className="text-center align-middle" key={i}>
									<img src={props.data[result]} height="60" width="60" style={{borderRadius:'50%'}} alt="no images"/>
								</td>
							: null
					})
				}
				<td className="text-center align-middle">
					<span className="btn-group" role="group" aria-label="Basic mixed styles example">
						<Link
							className="btn btn-sm btn-info"
							data-bs-toggle="tooltip"
							data-bs-placement="top"
							title="View Student Details"
							to={`/dashboard/view-student-details/${props.data.id}`}
						>
							<i className="bi bi-eye"></i>
						</Link>

						<Link
							className="btn btn-sm btn-warning"
							data-bs-toggle="tooltip"
							data-bs-placement="top"
							title="Edit students details"
							to={`/dashboard/edit-student-details/${props.data.id}`}
						>
							<i className="bi bi-pencil"></i>
						</Link>

						<button className="btn btn-sm btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Students details" onClick={() =>{props.DeleteStudent(props.data.id)}}>
							<i className="bi bi-trash-fill"></i>
						</button>
					</span>
				</td>
			</tr>
		</>
	)
}

export default ListStudents;