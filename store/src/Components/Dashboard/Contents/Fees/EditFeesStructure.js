import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { ServiceDomain } from "../../../../Constants";
import UpdateToken from "../../../../UpdateToken";
import Select from 'react-select';

const EditFeesStructure = (props) =>
{
	const params = useParams();
	const [loading, updateLoading] = useState(true);
	const history = useHistory();
	const type = [
		{value:'monthly', label:'Monthly'},
		{value:'quarterly', label:'Quarterly'},
		{value:'half_yearly', label: 'Half Yearly'},
		{value: 'yearly', label:'Yearly'}
	]

	const settlementMonth = [
		{value:'january', label:'January'},
		{value:'february', label: 'February'},
		{value: 'march', label:'March'},
		{value: 'april', label: 'April'},
		{value: 'may', label: 'May'},
		{value: 'june', label: 'June'},
		{value: 'july', label: 'July'},
		{value: 'august', label: 'August'},
		{value: 'september', label: 'September'},
		{value: 'october', label: 'October'},
		{value: 'november', label: 'November'},
		{value: 'december', label: 'December'},
	]

	const std = props.props.feesStdSet;

	const {addToast} = useToasts();
	const [formData, updateFormData] = useState([])

	const UpdateText = (e) =>
	{
		updateFormData({
			...formData,
			[e.target.name] : e.target.value
		})
	}
	
	const SelectUpdate = (value, name) =>
	{
		formData[name ] = value.value;
		updateFormData(formData)
		if(name === 'type' && value.value !== 'monthly')
		{
			document.getElementById('settleBox').style.display = 'flex';
		}
		else if(name === 'settle_month')
		{
			updateFormData(
				{
					...formData,
					[name] : value.value
				}
			)
		}
		else
		{
			let names = 'settle_month';
			updateFormData(
				{
					...formData,
					[names] : 'monthly'
				}
			)
			document.getElementById('settleBox').style.display = 'none';
		}
	}

	const UpdateStructure = (e) =>
	{
		e.preventDefault();
		let status = 'yes';
		Object.keys(formData).forEach((data) =>
		{
			if(formData[data] === '' || (formData[data].length < 3 && data !== 'amount'))
			{
				if(status !== 'no')
				{
					status = 'no'
				}
				addToast(`Invalid ${data} provided`, {appearance:'error', autoDismiss:true});
			}
		})

		if(status === 'no')
		{
			return false;
		}

		addToast('Updating Fees Structure, Please wait', {appearance:'warning', autoDismiss:true})
		fetch(`${ServiceDomain}updatefees`,
		{
			method:'PATCH',
			headers:{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID'),
			},
			body:JSON.stringify(formData)
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json()
		})
		.then((response) =>
		{
			if(response.header.code === 203)
			{
				const data = response.body.result.error;
				Object.keys(data).forEach((result) =>
				{
					data[result].forEach((resp) =>
					{
						addToast(resp, {appearance:'error', autoDismiss:true});
					})
				})
			}
			else
			{
				addToast(response.header.msg, {appearance:response.header.status, autoDismiss:true});

				if(response.header.code === 200)
				{
					history.push('/dashboard/fees-structure')
				}
			}
		})
		.catch(error => addToast(error.message, {appearance:'error', autoDismiss:true}))
	}

	useEffect(() =>
	{
		fetch(`${ServiceDomain}editfees/${params.id}`,
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
			return resp.json();
		})
		.then((response) =>
		{
			if (response.header.code === 200)
			{
				let result = {};
				Object.keys(response.body.result).forEach((data) =>
				{
					result[data] = response.body.result[data]
					if(data === 'amount')
					{
						result[data] = parseFloat(response.body.result[data])
					}
				})
				updateFormData(result);
				updateLoading(false);
			}
		})
		.catch((error) =>
		{
			updateLoading(false);
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	},[params, addToast])

	return (
		<>
			<div className="card card-body">
				{
					(loading)
					?
						<div className="text-center">
							<h3 className="lighter-font">Loading....</h3>
						</div>
					:
						<div className="row">
							<div className="col-md-2">
							</div>
							<div className="col-md-8">
								<div className="card card-body">
									<div className="text-center">
										<h3 className="lighter-font">Update Fees Structure</h3>
									</div>
									<hr />
									<form onSubmit={UpdateStructure}>
										<div className="form-group row">
											<div className="col-md-3 text-right">
												<b>Standard</b>
											</div>
											<div className="col-md-9 py-auto">
												<Select
													name="std" 
													options={std}
													onChange={(value) => {SelectUpdate(value, 'std')}}
													defaultValue={std.filter(option => option.value === formData.std)}
												/>
											</div>
										</div>
										<div className="form-group row py-3">
											<div className="col-md-3 text-right">
												<b>Name</b>
											</div>
											<div className="col-md-9 py-auto">
												<input type="text" className="form-control" placeholder="Name" name="name" onChange={UpdateText} defaultValue={formData.name}/>
											</div>
										</div>

										<div className="form-group row py-1">
											<div className="col-md-3 text-right">
												<b>Amount</b>
											</div>
											<div className="col-md-9 py-auto">
												<input type="number" className="form-control" placeholder="Amount" name="amount" onChange={UpdateText} defaultValue={formData.amount}/>
											</div>
										</div>

										<div className="form-group row py-3">
											<div className="col-md-3 text-right">
												<b>Payment Type</b>
											</div>
											<div className="col-md-9 py-auto">
												<Select
													options={type}
													name="type"
													onChange={(value) => {SelectUpdate(value, 'type')}}
													defaultValue={type.filter(options => options.value === formData.type)}
												/>
											</div>
										</div>
										<div className={`form-group row ${(formData.type === 'monthly') ? 'display-none' : null}`} id="settleBox">
											<div className="col-md-3 text-right">
												<b>Settlement Month</b>
											</div>
											<div className="col-md-9 py-auto">
												<Select
													options={settlementMonth}
													name="settle_month"
													onChange={(value) => {SelectUpdate(value, 'settle_month')}}
													defaultValue={settlementMonth.filter(options => options.value === formData.settle_month)}
												/>
											</div>
										</div>
										<hr />
										<div className="d-grid gap-2 col-6 mx-auto py-1">
											<button className="btn btn-primary btn-sm" type="submit">Update Structure</button>
										</div>
									</form>
								</div>
							</div>
						<div className="col-md-2">
							
						</div>
					</div>
				}
			</div>
		</>
	)
}

export default EditFeesStructure;