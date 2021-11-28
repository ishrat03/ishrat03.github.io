import { useEffect, useRef, useState } from 'react';
import Select from 'react-select'
import { useToasts } from 'react-toast-notifications';
import { FEESSHORTDETAILS, FEESSTRUCTURERED, FEESTOTAL, SELECTEDSTDFS, ServiceDomain, UMFT } from '../../../../Constants';
import UpdateToken from '../../../../UpdateToken';
import nodata from '../../../../assets/images/nodata.png';
import { useHistory } from 'react-router-dom';

const SubmitFee = (props) =>
{
	const {addToast} = useToasts();
	const studentRef = useRef();
	const [students, updateStudents] = useState([]);
	const [loading, updateLoading] = useState(false);
	const [isData, updateIsData] = useState(false);
	const [studentDetails, updateStudentDetails] = useState({});
	const [total, updateTotal] = useState(0);
	const [selectedStudent, updateStudent] = useState('');
	const history = useHistory();
	const [sessions, updateSessions] = useState([]);
	const [selectedSession, updateSelectedSession] = useState('')
	const [selectAll, updateSelectAll] = useState(true)

	const FetchStudents = (std, session) =>
	{
		if(std === '')
		{
			addToast('Please select standard', {appearance:'warning', autoDismiss:true})
			return false;
		}
		
		if(session === '')
		{
			addToast('Please select session', {appearance:'warning', autoDismiss:true})
			return false;
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
		if(value.value === undefined || value.value === '' || selectedSession === '')
		{
			return false;
		}

		updateLoading(true);
		updateStudent(value.value);
		fetch(`${ServiceDomain}feesdetails/${value.value}/${selectedSession}`,
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
				updateIsData(true);
				updateStudentDetails(result.body.result.studentDetails)
				
				let monthlyCheck = [];

				result.body.result.structure.forEach((data, i) =>
				{
					monthlyCheck = [...monthlyCheck, {name:data.name, value: true, total: data.total, paid:data.paid}]
				})

				updateTotal(result.body.result.total)
				props.props.dispatch({type:UMFT, payload:monthlyCheck})
				props.props.dispatch({type:FEESSTRUCTURERED, payload:result.body.result.structure})
				props.props.dispatch({type: FEESSHORTDETAILS, payload: result.body.result.shortDetails})
				props.props.dispatch({type:FEESTOTAL, payload: result.body.result.total})
			}

			updateLoading(false);
		})
		.catch((error) =>
		{
			updateLoading(false);
			addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	}

	const UpdateCheckFees = (name) =>
	{
		let monthlyFTC = [...props.props.monthlyFeesTotal];
		let value = true;
		let selectall = true;
		props.props.monthlyFeesTotal.forEach((data,i ) =>
		{
			if(data.name === name)
			{
				let tot = total;
				if(data.value === true)
				{
					tot = tot - data.total
				}
				else
				{
					value = false;
					tot = tot + data.total
				}

				updateTotal(tot);
				props.props.dispatch({type:FEESTOTAL, payload:tot})
				monthlyFTC[i].value = !data.value;
			}

			if(monthlyFTC[i].value === false && selectall === true)
			{
				selectall = false
			}
		})

		
		let summary = [...props.props.feesShortDetails]

		props.props.feesStructure.forEach((data, i) =>
		{
			if(data.name === name)
			{
				data.details.forEach((res) =>
				{
					summary.forEach((sum, i) =>
					{
						if(sum.name === res.name)
						{
							if(value === true)
							{
								summary[i].value = sum.value - res.amount
							}
							else
							{
								summary[i].value = sum.value + res.amount
							}
						}
					})
				})
			}
		})

		calculateTotal(summary);
		
		props.props.dispatch({type: FEESSHORTDETAILS, payload: summary})
		props.props.dispatch({type:UMFT, payload:monthlyFTC})
		updateSelectAll(selectall)
	}

	const ManageDiscount = (e) =>
	{
		e.preventDefault();
		let details = [...props.props.feesShortDetails]
		let tot = 0;
		details.forEach((data, i) =>
		{
			if(data.name === 'Discount')
			{
				if(e.target.value === '')
				{
					e.target.value = 0;
				}
				details[i].value = e.target.value;

				tot = tot - parseFloat(details[i].value);
			}
			else
			{
				tot = tot + parseFloat(details[i].value);
			}
		})

		props.props.dispatch({type:FEESTOTAL, payload: tot})
		props.props.dispatch({type: FEESSHORTDETAILS, payload: details})
	}
	
	const SubmitFees = () =>
	{
		let data = {
			monthlyCheck: props.props.monthlyFeesTotal,
			summary: props.props.feesShortDetails,
			studentId: selectedStudent,
			session:selectedSession,
			feesStructure:props.props.feesStructure
		}

		addToast('Submittin Fees, Please Wait', {appearance: 'warning', autoDismiss:true})
		fetch(`${ServiceDomain}submitfees`,
		{
			method:'POST',
			headers:{
				'Content-Type': 'application/json',
				'Authorization' : 'Bearer '+ localStorage.getItem('Session-ID')
			},
			body:JSON.stringify(data)
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((result) =>
		{
			addToast(result.header.msg, {appearance: result.header.status, autoDismiss:true})
			if(result.header.code === 200)
			{
				history.push('/dashboard/submitted-fees');
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}

	const CallFetchStudent = (value, from) =>
	{
		let std = props.props.selectedStdFs
		let session = selectedSession;

		if(from === 'standard')
		{
			std = value.value
			props.props.dispatch({type:SELECTEDSTDFS, payload: value.value})
		}
		else if(from === 'session')
		{
			session = value.value
			updateSelectedSession(value.value)
		}

		FetchStudents(std, session)
	}

	const UpdateSelectAllCheck = () =>
	{
		let selectall = !selectAll

		updateSelectAll(selectall)

		let monthlyFeesTotal = [...props.props.monthlyFeesTotal]

		let shortDetailsArray = [];
		monthlyFeesTotal.forEach((val, i) =>
		{
			monthlyFeesTotal[i].value = selectall;
			shortDetailsArray[val.name] = selectall
		})

		props.props.dispatch({type:UMFT, payload:monthlyFeesTotal})

		PrepareShortDetails(shortDetailsArray)
	}

	const PrepareShortDetails = (shortDetailsArray) =>
	{
		let initialShortDetails = prepareInitialShortDetails()

		props.props.feesStructure.forEach((value) =>
		{
			if(shortDetailsArray[value.name] !== false)
			{
				value.details.forEach((val, i) =>
				{
					initialShortDetails.forEach((data, j) =>
					{
						if(data.name === val.name)
						{
							initialShortDetails[i].value = initialShortDetails[i].value + val.amount
						}
					});
				})
			}
		})

		props.props.dispatch({type: FEESSHORTDETAILS, payload: initialShortDetails})
		calculateTotal(initialShortDetails)
	}

	const prepareInitialShortDetails = () =>
	{
		let details = [];

		props.props.feesShortDetails.forEach((value, i) =>
		{
			if(value.name !== 'Discount')
			{
				value.value = 0;
			}

			details[i] = value
		})

		return details
	}

	const calculateTotal = (shortDetails) =>
	{
		let total = 0;
		shortDetails.forEach((value) =>
		{
			if(value.name !== 'Discount')
			{
				total = total + value.value
			}
			else
			{
				total = total - value.value
			}
		})

		updateTotal(total)
		props.props.dispatch({type:FEESTOTAL, payload:total})
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
				// updateSelectedSession(response.body.result.default)
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
			<div className="card-c card-body br-2 shadow-lg cust-padding">
				<div className="row">
					<div className="col-md-4 col-12 py-2">
						<div className="form-group row">
							<div className="col-md-3">
								<b>Standard</b>
							</div>
							<div className="col-md-9 col-xs-12">
								<Select
									options={props.props.admissionStd}
									onChange={(value) => {CallFetchStudent(value, 'standard')}}
								/>
							</div>
						</div>
					</div>
					
					<div className="col-md-4 col-12 py-2">
						<div className="form-group row">
							<div className="col-md-3">
								<b>Session</b>
							</div>
							<div className="col-md-9 col-xs-12">
								<Select
									options={sessions}
									onChange={(value) => {CallFetchStudent(value, 'session')}}
									defaultValue={sessions.filter(data => data.value === selectedSession)}
								/>
							</div>
						</div>
					</div>

					<div className="col-md-4 col-12 py-2">
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
						(isData)
						? <DataBox
								studentDetails={studentDetails}
								props={props.props}
								UpdateCheckFees={UpdateCheckFees}
								ManageDiscount={ManageDiscount}
								SubmitFees={SubmitFees}
								selectAll={selectAll}
								UpdateSelectAllCheck={UpdateSelectAllCheck}
							/>
						:
							<div className="text-center">
								<img src={nodata} alt="no preview" className="img-fluid"/>
							</div>
				}
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
					<div className="card-c br-2 shadow-lg">
						<StudentDetails studentDetails={props.studentDetails} />
					</div>
				</div>
				<div className="col-md-6 overflow-scroll fixed-width">
					<div className="col-md-12 my-2-c">
						<div className="card-c br-2 shadow-lg card-body">
							<div className="form-check">
								<input
									type="checkbox"
									checked={props.selectAll}
									onChange={props.UpdateSelectAllCheck}
									className="form-check-input"
									id="flexCheckDefault"
								/>
								<label className="form-check-label" htmlFor="flexCheckDefault">
									Select All Months
								</label>
							</div>
						</div>
					</div>
					{
						(props.props.feesStructure.length > 0)
						? 
							<FeeDetails
								props={props.props}
								UpdateCheckFees = {props.UpdateCheckFees}
							/>
						:
							<div className="card-c br-1 shadow-lg my-2 py-5 text-center" style={{backgroundColor:'#28ca66c7', color:'whitesmoke'}}>
								<h1>Fee Fully Paid</h1>
							</div>
					}
				</div>
				<div className="col-md-3">
					<div className="card-c br-2 shadow-lg card-body">
						<div className="text-center">
							<h4 className="lighter-font">Summary</h4>
						</div>
						
						{
							props.props.feesShortDetails.map((data, i) =>
							{
								return <div key={i} className="card-c card-body br-1 py-2  my-1 shadow-lg">
									<div className="row">
										<div className="col-6">
											<span className="shadow-lg" style={{color:'#312431d1'}}>{data.name}</span>
										</div>
										<div className="col-6 text-right">
											<span className="shadow-lg" style={{color:'#312431d1'}}>
												<b>&#8377;{data.value}</b>
											</span>
										</div>
									</div>
								</div>
							})
						}

						<div className="card-c card-body br-1 py-2  my-1 shadow-lg">
							<div className="row">
								<div className="col-6">
									<span className="shadow-lg" style={{color:'#312431d1'}}>
										<b>Total</b>
									</span>
								</div>
								<div className="col-6 text-right">
									<span className="shadow-lg" style={{color:'#312431d1'}}>
										<b>&#8377; {props.props.feesTotal}</b>
									</span>
								</div>
							</div>
						</div>

						<div className="d-grid gap-2 my-2">
							<button className="btn btn-outline-primary shadow-lg" type="button" onClick={props.SubmitFees}>Submit Fees</button>
						</div>
					</div>
					
					<div className="card-c br-1 py-2 my-2 shadow-lg">
						<div className="text-center">
							<h5 className="lighter-font">Discount</h5>
						</div>
						<div className="form-group row px-4">
							<div className="col-12 ">
								<input
									className="form-control"
									type="text"
									placeholder="Discount"
									onChange={props.ManageDiscount}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const StudentDetails = (props) =>
{
	return (
		<>
			<img
				src={props.studentDetails.image} alt="no preview found"
				className=" card-img-top"
			/>
			<div className="card-body">
				<b>Name: </b>{props.studentDetails.name}<br />
				<b>Father's Name: </b>{props.studentDetails.father_name}<br />
				<b>DOB: </b>{props.studentDetails.dob}<br />
			</div>
		</>
	)
}

const FeeDetails = (props) =>
{
	return (
		<>
			{
				props.props.feesStructure.map((resp, i) =>
				{
					return <div className="card-c br-2 card-body shadow-lg my-2" key={i}>
						<div className="text-center">
							<b>{resp.name}</b>
						</div>
						<hr />
						<div className="table-responsive">
							<table className="table table-sm table-bordered table-striped border-primary">
								<thead>
									<tr>
										<th className='text-center'>
											Name
										</th>
										<th className='text-center'>
											Amount
										</th>
										<th className='text-center'>
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{
										resp.details.map((data, i) =>
										{
											return <tr key={i}>
												<td className="text-center">{data.name}</td>
												<td className="text-center">&#8377;{data.amount}</td>
												<td className="text-center">-</td>
											</tr>
										})
									}
									<tr>
										<th className="text-center">
											Total
										</th>
										<td className="text-center">
											&#8377;{props.props.monthlyFeesTotal[i].total}
										</td>
										<td className="text-center">
											<b>{
												(resp.paid) ? <Paid /> : <Pay />
											}</b>&nbsp;
											<input
												type="checkbox"
												disabled={resp.paid}
												checked={props.props.monthlyFeesTotal[i].value}
												onChange={() =>{props.UpdateCheckFees(props.props.monthlyFeesTotal[i].name)}}
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				})
			}
		</>
	)
}

const Paid = () =>
{
	return (
		<>
			<span className="text-success">Paid</span>
		</>
	)
}

const Pay = () =>
{
	return (
		<>
			<span className="text-warning">Pay</span>
		</>
	)
}

export default SubmitFee;
export {StudentDetails}