import { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { useToasts } from 'react-toast-notifications';
import { ServiceDomain } from '../../../../Constants';
import UpdateToken from '../../../../UpdateToken';

const AddFeesStructure = (props) =>
{
	const history = useHistory();
	const selectInputRef = useRef();
	const typeRef = useRef();
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
	
	const InitalFormValue = {
		name:'',
		type:'',
		settle_month:'monthly',
		amount:0,
		std:''
	}
	
	const [formData, updateFormData] = useState(InitalFormValue)
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
		if(name === 'type' && (value.value !== 'monthly' && value.value !== undefined))
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
			let key = 'settle_month';
			updateFormData(
				{
					...formData,
					[key] : 'monthly'
				}
			)
			document.getElementById('settleBox').style.display = 'none';
		}
	}

	const SaveStructure = (e, samePage) =>
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
		
		addToast('Adding Fees Structure, Please wait', {appearance:'warning', autoDismiss:true})
		fetch(`${ServiceDomain}feesstructure`,
		{
			method:'POST',
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
					if(samePage === 'no')
					{
						history.push('/dashboard/fees-structure')
					}
					else
					{
						selectInputRef.current.select.setValue('');
						typeRef.current.select.setValue('a');
						document.getElementById("feesForm").reset();
						updateFormData(InitalFormValue);
					}
				}
			}
		})
		.catch(error => addToast(error.message, {appearance:'error', autoDismiss:true}))
	}

	return (
		<>
			<div className="row">
				<div className="col-md-2">

				</div>
				<div className="col-md-8">
					<div className="card card-body">
						<div className="text-center">
							<h3 className="lighter-font">Add Fees Structure</h3>
						</div>
						<hr />
						<form id="feesForm">
							<div className="form-group row">
								<div className="col-md-3 text-right">
									<b>Standard</b>
								</div>
								<div className="col-md-9 py-auto">
									<Select
										ref={selectInputRef}
										options={std}
										name="std" 
										onChange={(value) => {SelectUpdate(value, 'std')}}
									/>
								</div>
							</div>
							<div className="form-group row py-3">
								<div className="col-md-3 text-right">
									<b>Name</b>
								</div>
								<div className="col-md-9 py-auto">
									<input type="text" className="form-control" placeholder="Name" name="name" onChange={UpdateText} />
								</div>
							</div>

							<div className="form-group row py-1">
								<div className="col-md-3 text-right">
									<b>Amount</b>
								</div>
								<div className="col-md-9 py-auto">
									<input type="number" className="form-control" placeholder="Amount" name="amount" onChange={UpdateText} />
								</div>
							</div>

							<div className="form-group row py-3">
								<div className="col-md-3 text-right">
									<b>Payment Type</b>
								</div>
								<div className="col-md-9 py-auto">
									<Select
										ref={typeRef}
										options={type}
										name="type"
										onChange={(value) => {SelectUpdate(value, 'type')}}
										defaultValue={formData.type}
									/>
								</div>
							</div>
							<div className="form-group row" style={{display:'none'}} id="settleBox">
								<div className="col-md-3 text-right">
									<b>Settlement Month</b>
								</div>
								<div className="col-md-9 py-auto">
									<Select
										options={settlementMonth}
										name="settle_month"
										onChange={(value) => {SelectUpdate(value, 'settle_month')}}
									/>
								</div>
							</div>
							<hr />
							<div className="row">
								<div className="col-md-2">

								</div>
								<div className="col-md-8">
									<div className="row">
										<div className="d-grid gap-2 col-6 mx-auto py-1 col-md-6  col-12">
											<button className="btn btn-primary btn-sm" type="submit" onClick={(event) => {SaveStructure(event, 'no')}}>Save Structure</button>
										</div>

										<div className="d-grid gap-2 col-6 mx-auto py-1 col-md-6 col-12">
											<button className="btn btn-warning btn-sm" type="submit" onClick={(event) => {SaveStructure(event, 'yes')}}>Save & Add More</button>
										</div>
									</div>
								</div>
								<div className="col-md-2">

								</div>
							</div>
							
						</form>
					</div>
				</div>
				<div className="col-md-2">

				</div>
			</div>
		</>
	)
}

export default AddFeesStructure;