import React from 'react';
import { useState, useRef } from 'react';
import Select from 'react-select'
import { useToasts } from 'react-toast-notifications';
import { ServiceDomain, UMFT } from '../../../../Constants';
import UpdateToken from '../../../../UpdateToken';

const SubmitFees = (props) =>
{
	const [students, updateStudents] = useState([]);
	const {addToast} = useToasts();
	const studentRef = useRef();
	const [fees, updateFees] = useState([]);
	const [loading, updateLoading] = useState(false);
	const [feescheck, updateFeesCheck] = useState([]);
	const [total, updateTotal] = useState(0);
	
	const [shortDetails, updateShortDetails] = useState([]);
	const [monthlyFeesCheck, updateMFC] = useState([]);
	const [monthlyTotalCheck, updateMonthly] = useState([]);
	const [feesStructure, updateFeesStructure] = useState([]);
	const [monthlyTotal, updateMonthlyTotal] = useState([]);

	const [studentDetails , updateStudentDetails] = useState({});
	
	const FetchStudents = (value) =>
	{
		fetch(`${ServiceDomain}studentlist/${value.value}`,
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
		fetch(`${ServiceDomain}feesdetails/${value.value}`,
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
				updateStudentDetails(result.body.result.studentDetails);

				// need to fix it
				updateFees(result.body.result);

				updateFeesStructure(result.body.result.structure);
				let a = {};
				let monthlyCheck = [];
				let monthlyT = [];
				let mTotal = [];

				let monthlyTC = [];
				result.body.result.structure.forEach((data) =>
				{
					a[data.name] = true;
					mTotal[data.name] = 0;
					monthlyCheck[data.name] = [];
					monthlyT[data.name] = true;
					data.details.forEach((resp) =>
					{
						monthlyCheck[data.name][resp.name] = true;
						mTotal[data.name] += resp.amount
					})
				})
				
				props.props.dispatch({type:UMFT, payload:monthlyT})
				updateMFC(monthlyCheck);
				updateMonthly(monthlyT);
				updateFeesCheck(a);
				updateMonthlyTotal(mTotal)
				updateTotal(result.body.result.total)
				updateShortDetails(result.body.result.shortDetails)
			}

			updateLoading(false);
		})
		.catch((error) =>
		{
			updateLoading(false);
			addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	}

	const HandleChecks = (name) =>
	{
		let mtc = monthlyTotalCheck;
		mtc[name] = !mtc[name]

		updateMonthly(mtc)
	}
	
	const handleCheck = (name) =>
	{
		let content = {};

		fees.structure.forEach((data, i) =>
		{
			if(data.name === name)
			{
				content = data.details;
			}
		})

		let structure = [...shortDetails];
		content.forEach((data, i) =>
		{
			structure.forEach((resp, i) =>
			{
				if(resp.name === data.name)
				{
					if(feescheck[name] === false)
					{
						structure[i].value = parseFloat(structure[i].value) + parseFloat(data.amount);
					}
					else
					{
						structure[i].value = parseFloat(structure[i].value) - parseFloat(data.amount);
					}
				}
			})
		})
		
		updateShortDetails(structure);
		ReCalculateTotal()
		let updateValue = false;

		if(feescheck[name] === false)
		{
			updateValue = true;
		}
		
		updateFeesCheck({
			...feescheck,
			[name]: updateValue
		})
	}

	const HandleFeesCheck = (month, name, amount) =>
	{
		let content = {...monthlyFeesCheck};

		let updateValue = false;

		if(content[month][name] === false)
		{
			updateValue = true;
		}

		content[month][name] = updateValue;
		updateMFC(content);

		let feeDetails = [...shortDetails];

		feeDetails.forEach((data, i) =>
		{
			if(data.name === name)
			{
				if(content[month][name] === false)
				{
					feeDetails[i].value = parseFloat(data.value) - parseFloat(amount);
				}
				else
				{
					feeDetails[i].value = parseFloat(data.value) + parseFloat(amount);
				}
			}
		})

		updateShortDetails(feeDetails);
		ReCalculateTotal()
	}

	const Discount = (e) =>
	{
		let details = [...shortDetails];
		let actualTotal = 0;
		fees.shortDetails.forEach((data, i) =>
		{
			if(data.name === 'Discount')
			{
				if(e.target.value === '')
				{
					e.target.value = 0;
				}

				data.value = e.target.value;
				details[i].value = e.target.value;
				updateShortDetails(details);
				actualTotal = actualTotal - parseFloat(data.value);
			}
			else
			{
				actualTotal = actualTotal + parseFloat(data.value);
			}
		})
		updateTotal(actualTotal);
	}

	const ReCalculateTotal = () =>
	{
		let total = 0
		shortDetails.forEach((data) =>
		{
			total = total + data.value;
		})

		updateTotal(total)
	}

	return (
		<>
			<div className="card card-body">
				<div className="row">
					<div className="col-md-6 col-12">
						<div className="form-group row">
							<div className="col-md-2">
								<b>Standard</b>
							</div>
							<div className="col-md-10 py-2">
								<Select
									options={props.props.admissionStd}
									onChange={FetchStudents}
								/>
							</div>
						</div>
					</div>

					<div className="col-md-6 col-12 py-2">
						<div className="form-group row">
							<div className="col-md-3">
								<b>Student Name</b>
							</div>
							<div className="col-md-9 py-2">
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
			<hr />
			{
				(loading)
				?
					<div className="text-center">
						<h3 className="lighter-font">loading.....</h3>
					</div>
				:
					(fees.structure !== undefined)
					?
						<FeeBox 
							structure={feesStructure}
							monthlyTotal={monthlyTotal}
							HandleChecks={HandleChecks}
							monthlyTotalCheck={monthlyTotalCheck}
							studentDetails ={studentDetails}
						/>
					:
						null
			}
		</>
	)
}

const FeeBox = (props) =>
{
	return (
		<>
			<div
				className="card-c br-3 card-body">
				<div className="row">
					<div className="col-md-3 col-auto py-2">
						<div className="card-c br-2 shadow-lg card-body">
							<StudentDetails studentDetails={props.studentDetails} />
						</div>
					</div>
					<div className="col-md-5 col-auto py-2 overflow-scroll fixed-width">
						<div className="card-c br-2 card-body">
							{
								props.structure.map((data, i) =>
								{
									return <FeeStructure
											data={data}
											key={i}
											monthlyTotal={props.monthlyTotal}
											HandleChecks={props.HandleChecks}
											monthlyTotalCheck={props.monthlyTotalCheck}
										/>
								})
							}
						</div>
					</div>
					<div className="col-md-4 col-auto py-2">
						<div className="card-c br-2 shadow-lg card-body">
							User Details
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

const FeeStructure = (props) =>
{
	return (
		<>
			<div className="card-c br-1 card-body shadow-lg my-1">
				<div className="text-center">
					<h5 className="lighter-font">{props.data.name}</h5>
				</div>
				<hr />
				<FeeDetails
					details={props.data.details}
					name={props.data.name}
					monthlyTotal={props.monthlyTotal}
					HandleChecks={props.HandleChecks}
					monthlyTotalCheck={props.monthlyTotalCheck}
				/>
			</div>
		</>
	)
}

const FeeDetails = (props) =>
{
	return (
		<>
			<div className="table-responsive">
				<table className="table table-bordered table-striped border-primary table-sm">
					<thead>
						<tr>
							<th className="text-center">Name</th>
							<th className="text-center">Amount</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{
							props.details.map((data, i) =>
							{
								return <tr key={i}>
										<td className="text-center">{data.name}</td>
										<td className="text-center">&#8377;{data.amount}</td>
										<td className="text-center">
											<button className="btn btn-sm btn-custom">
											Pay &nbsp;&nbsp;
											<input
												type="checkbox"
												checked={props.monthlyTotalCheck[props.name]}
												onChange={() =>{props.HandleChecks(props.name)}}
											/>
											</button>
										</td>
									</tr>
							})
						}
						
						<tr>
							<th className="text-center">Total</th>
							<td className="text-center">&#8377;{props.monthlyTotal[props.name]}</td>
							<td className="text-center">
								<button className="btn btn-sm btn-custom">
									Pay &nbsp;&nbsp;
									<input
										type="checkbox"
										checked={props.monthlyTotalCheck[props.name]}
										onChange={() =>{props.HandleChecks(props.name)}}
									/>
									</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	)
}

const Summary = (props) =>
{
	return (
		<>
			<hr />
			<div className="row">
				<div className="col-md-8">
					<h5 className="lighter-font">{props.name}</h5>
				</div>
				<div className="col-md-4">

					<h5  className="lighter-font">&#8377;{props.total}</h5>
				</div>
			</div>
		</>
	)
}

const StudentDetails = (props) =>
{
	return (
		<>
			<div className="text-center">
				<img
					src={props.studentDetails.image} alt="no preview found"
					className="profile-image"
				/>
				<hr />
				
				<b>Name: </b>{props.studentDetails.name}<br />
				<b>Father's Name: </b>{props.studentDetails.father_name}<br />
				<b>DOB: </b>{props.studentDetails.dob}<br />
			</div>
		</>
	)
}

export default SubmitFees;