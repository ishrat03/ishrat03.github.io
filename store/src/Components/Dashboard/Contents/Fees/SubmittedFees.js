import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'
import { useToasts } from 'react-toast-notifications';
import { ServiceDomain } from '../../../../Constants';
import UpdateToken from '../../../../UpdateToken';
import nodata from '../../../../assets/images/nodata.png';
import { StudentDetails } from './SubmitFee';
const SubmittedFees = (props) =>
{
	props = props.props;
	const [students, updateStudents] = useState([]);
	const {addToast} = useToasts()
	const studentRef = useRef();
	const [loading, updateLoading] = useState(false);
	const [isData, updateIsData] = useState(false);
	const [studentDetails, updateStudentDetails] = useState({});
	const [feesDetails, updateFeeDetails] = useState([]);
	const [total, updateTotal] = useState(0);
	const [firstLoad, updateLoad] = useState(true)
	const [sessions, updateSessions] = useState([]);
	const [std, updateStd] = useState('');
	const [session, updateSession] = useState('')
	const [feesLoading, updateFeesLoading] = useState(false)
	const [selectedStudent, updateSelectedStudent] = useState('')
	const [feesById, updateFeesById] = useState('')
	const [feesTotal, updateFeesTotal] = useState(0)
	const [emailLoader, updateEmailLoader] = useState(false)
	const [monthNam, updateMonthName] = useState('')
	
	const FetchStudents = (std, session) =>
	{
		if(std === '')
		{
			addToast('Please select standard', {appearance:'warning', autoDismiss:true})
			return false
		}

		if(session === '')
		{
			addToast('Please select Session', {appearance:'warning', autoDismiss:true})
			return false
		}

		fetch(`${ServiceDomain}studentlist/${std}/${session}`,
		{
			method:'GET',
			headers:{
				'Content-Type':'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((result) =>
		{
			studentRef.current.select.setValue('');
			if(result.header.code === 200)
			{
				updateStudents(result.body.result);
			}
		})
		.catch(error => addToast(error.message, {appearance:'error', autoDismiss:true}))
	}

	const FetchFeesDetails = (value) =>
	{
		if(value.value === undefined || value.value === '')
		{
			return false;
		}

		updateLoading(true);
		updateSelectedStudent(value.value)
		fetch(`${ServiceDomain}paidfeedetails/${value.value}/${session}`,
		{
			method:'GET',
			headers:{
				'Content-Type': 'application/json',
				'Authorization' : 'Bearer '+ localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((result) =>
		{
			if(result.header.code === 200)
			{
				updateStudentDetails(result.body.result.studentDetails)
				updateIsData(false)
				if(result.body.result.feesDetails.length > 0)
				{
					updateIsData(true)
				}

				updateFeeDetails(result.body.result.feesDetails)
				updateTotal(result.body.result.total)
				updateLoad(false)
			}
			updateLoading(false);
		})
		.catch((error) =>
		{
			updateLoading(false);
			addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	}

	const CallFetchStudent = (value, from) =>
	{
		if(from === 'std')
		{
			updateStd(value.value)
			FetchStudents(value.value, session)
		}

		if(from === 'session')
		{
			updateSession(value.value)
			FetchStudents(std, value.value)
		}
	}

	const ViewFees = (monthName) =>
	{
		updateFeesLoading(true)
		updateMonthName(monthName)
		
		fetch(`${ServiceDomain}monthlyfeesdetails/${session}/${monthName}/${selectedStudent}`,
		{
			method:'GET',
			headers:{
				'Content-Type': 'application/json',
				'Authorization' : 'Bearer '+ localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((result) =>
		{
			if(result.header.code === 200)
			{
				updateFeesById(result.body.result.feesDetails)
				updateFeesTotal(result.body.result.total)
			}

			updateFeesLoading(false)
		})
		.catch((error) =>
		{
			updateFeesLoading(false)
			addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	}

	const SendRecieptEmail = (download, month = '') =>
	{
		updateEmailLoader(true)
		var mname = monthNam
		if(month !== '')
		{
			mname = month
			updateMonthName(month)
		}
		fetch(`${ServiceDomain}monthlyReciept/${mname}/${selectedStudent}/${download}`,
		{
			method:'GET',
			headers:{
				'Content-Type': 'application/json',
				'Authorization' : 'Bearer '+ localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((result) =>
		{
			updateEmailLoader(false)
			// addToast(result.header.msg, {appearance:result.header.status, autoDismiss:true})
		})
		.catch((error) =>
		{
			updateEmailLoader(false)
			// addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	}

	useEffect((addToast) =>
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
	}, []);
	
	return (
		<>
			<div className="card-c br-2 py-2 px-2 shadow-lg">
				<div className="form-group row">
					<div className="col-md-4">
						<div className="form-group row">
							<div className="col-md-4">
								<b>Standard</b>
							</div>
							<div className="col-md-8">
								<Select
										options={props.admissionStd}
										onChange={(value) => {CallFetchStudent(value, 'std')}}
								/>
							</div>
						</div>
					</div>

					<div className="col-md-4 col-12">
						<div className="form-group row">
							<div className="col-md-3">
								<b>Session</b>
							</div>
							<div className="col-md-9 col-xs-12">
								<Select
									options={sessions}
									onChange={(value) => {CallFetchStudent(value, 'session')}}
									// defaultValue={}
								/>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="form-group row">
							<div className="col-md-4">
								<b>Student Name</b>
							</div>
							<div className="col-md-8 col-xs-12">
								<Select
									ref={studentRef}
									options={students}
									onChange={FetchFeesDetails}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="card-c br-2 card-body my-2 shadow-lg">
				{
					(loading)
					?
						<div className="text-center">
							<h4 className="lighter-font">Loading....</h4>
						</div>
					:
						<DataBox
							studentDetails={studentDetails}
							props={props}
							isData={isData}
							feesDetails={feesDetails}
							total={total}
							firstLoad={firstLoad}
							ViewFees={ViewFees}
							SendRecieptEmail={SendRecieptEmail}
						/>
				}
			</div>

			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Monthly Fees Details</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							{
								(feesLoading)
									? <h3 className="lighterFont">Loading....</h3>
									: <>
										{
											(feesById.length > 0)
											? <>
												{
													feesById.map((resp, i) =>
													{
														return <div className="card-c br-2 card-body shadow-lg py-2 my-2" key={i}>
															<div className="row">
																<div className="col-md-8">
																	{resp.name}
																</div>
																<div className="col-md-4 text-right">
																	&#8377;{resp.amount}
																</div>
															</div>
														</div>
													})
												}

												<div className="card-c br-2 card-body shadow-lg py-2 my-2">
													<div className="row">
														<div className="col-md-6 text-right">
															<b>Total:</b>
														</div>
														<div className="col-md-6">
															<b>&#8377;{feesTotal}</b>
														</div>
													</div>
												</div>

												<div className="text-right">
													<button className="btn btn-sm btn-primary" onClick={() => {SendRecieptEmail(0)}}>
													{
														(emailLoader)
														? 'Sending Reciept...'
														: 'Send Reciept'
													}
													</button>
												</div>
											</>
											: null
										}
									</>
							}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const DataBox = (props) =>
{
	return (
		<>
			<div className="row">
				<div className="col-md-3 col-auto">
					{
						(props.firstLoad === false)
						?
							<div className="card-c br-2 shadow-lg">
								<StudentDetails studentDetails={props.studentDetails} />
							</div>
						: null
					}
				</div>
				<div className="col-md-9 overflow-scroll fixed-width">
				{
					(props.isData)
						? 
							<div className="card-c br-1 shadow-lg px-2 py-3">
								<div className="text-center">
									<h3 className="lighter-font">Paid Fees Details</h3>
								</div>
								<div className="table-responsive my-2">
									<table className="table table-sm table-striped table-bordered border-primary">
										<thead>
											<tr>
												<th className="text-center">Month - Year</th>
												<th className="text-center">Amount</th>
												<th className="text-center">Discount</th>
												<th className="text-center">Payment Date</th>
												<th className="text-center">Total</th>
												<th className="text-center">Action</th>
											</tr>
										</thead>
										<tbody>
											{
												props.feesDetails.map((data, i) =>
												{
													return <tr key={i}>
														<td className="text-center align-middle">
															{data.paid_month}
														</td>
														<td className="text-center align-middle">
															&#8377;{data.paid_amount}
														</td>
														<td className="text-center align-middle">
															&#8377;{data.discount}
														</td>
														<td className="text-center align-middle">
															{data.date}
														</td>
														<td className="text-center align-middle">
															&#8377;{data.total}
														</td>
														<td className="text-center align-middle">
															<div className="btn-group">
																<button 
																	type="button"
																	className="btn btn-success btn-sm"
																	data-bs-toggle="modal" data-bs-target="#exampleModal"
																	onClick={() => {props.ViewFees(data.paid_month)}}
																>
																	<i className="bi bi-eye-fill"></i>
																</button>
																<button
																	type="button"
																	className="btn btn-warning text-white btn-sm"
																	onClick={() => {props.SendRecieptEmail(1, data.paid_month)}}
																>
																	<i className="bi bi-printer-fill"></i>
																</button>
															</div>
														</td>
													</tr>
												})
											}
										</tbody>
									</table>
									<div className="card-c br-1 my-2 p-2">
										<div className="row">
											<div className="col-md-6 text-rights">
												<h4 className="lighter-font">Total Paid</h4>
											</div>
											<div className="col-md-6 p-0 text-rightc">
												<h3 className="lighter-font">&#8377;{props.total}</h3>
											</div>
										</div>
									</div>
								</div>
							</div>
						:
							<div className="text-center">
								<img src={nodata} alt="no preview" className="img-fluid"/>
							</div>
				}
				</div>
			</div>
		</>
	)
}

export default SubmittedFees;