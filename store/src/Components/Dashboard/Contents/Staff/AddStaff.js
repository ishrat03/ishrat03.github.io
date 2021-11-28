import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { ServiceDomain } from "../../../../Constants";
import UpdateToken from "../../../../UpdateToken";
import Select from 'react-select'

const AddStaff = (props) =>
{
	const {addToast} = useToasts();
	const [customForm, udpateCustomForm] = useState([])
	const [data, updateData] = useState([])
	const [validationFields, UpdateValidationFields] = useState([])
	
	const UpdateCommonData = (e) =>
	{
		updateData({...data, [e.target.name]:e.target.value})
	}
	
	const UpdateSelectFields = (value, name) =>
	{
		updateData({...data, [name]:value.value})
	}

	const FileHandler = (e) =>
	{
		e.preventDefault();
		let name = e.target.name;
		let reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);

		reader.onload = (e) =>
		{
			updateData(
				{
					...data,
					[name]:e.target.result
				}
			)
		}
	}

	const AddNewStaff = () =>
	{
		let stop = false
		validationFields.forEach((resp) =>
		{
			if(data[resp] === undefined)
			{
				addToast(`${resp} is required`, {appearance:'warning', autoDismiss:true})
				stop = true
			}
		})

		if(stop)
		{
			return false;
		}

		fetch(`${ServiceDomain}addstaffregistrationform`,
		{
			method:'POST',
			headers:{
				'Content-type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID'),
			},
			body:JSON.stringify(data)
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
				console.log('done')
			}
			else
			{
				result.body.result.error.forEach((resp) =>
				{
					addToast(resp,{appearance:'error', autoDismiss:true})
				})
			}
		})
		.catch((error) =>
		{
			// UpdateLoading(false)
			addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	}

	useEffect(() =>
	{
		fetch(`${ServiceDomain}staffcustomform`,
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
				udpateCustomForm(response.body.result)
				let validation = []
				response.body.result.forEach((resp) =>
				{
					if(resp.required)
					{
						validation.push(resp.name)
					}
				})
				UpdateValidationFields(validation)
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}, [addToast]);
	return (
		<>
			<div className="card-c br-2 card-body shadow-lg">
				<div className="text-center">
					<h3 className="">Add New Staff</h3>
				</div>
				<hr style={{color:'red'}} className="shadow-lg"/>
				<div className="row">
					<div className="col-md-3">

					</div>
					<div className="col-md-6">
						<CustomForm
							data={customForm}
							UpdateCommonData={UpdateCommonData}
							UpdateSelectFields={UpdateSelectFields}
							FileHandler={FileHandler}
						/>

						{
							(customForm.length > 0)
							?
							<div className="d-grid gap-2 col-6 mx-auto">
								<button className="btn btn-primary btn-sm" type="button" onClick={AddNewStaff}>Add New Staff</button>
							</div>
							:null
						}
					</div>
					<div className="col-md-3">

					</div>
				</div>
			</div>
		</>
	)
}

const CustomForm = (data) =>
{
	return(
		<>
			{
				(data.data.length > 0)
				?
				data.data.map((resp, i) =>
				{
					switch(resp.type)
					{
						case 'text':
							return <CommonType
										data={resp}
										key={i}
										UpdateCommonData={data.UpdateCommonData}
									/>
						case 'date':
						return <CommonType
									data={resp}
									key={i}
									UpdateCommonData={data.UpdateCommonData}
								/>
						case 'email':
							return <CommonType
										data={resp}
										key={i}
										UpdateCommonData={data.UpdateCommonData}
									/>
						case 'number':
							return <CommonType
										data={resp}
										key={i}
										UpdateCommonData={data.UpdateCommonData}
									/>
						case 'select':
							return <Selects
										UpdateSelectFields={data.UpdateSelectFields}
										data={resp}
										key={i}
									/>
						case 'file':
							return <File
										FileHandler={data.FileHandler}
										data={resp}
										key={i}
									/>
						case 'textarea':
							return <TextArea
										data={resp}
										key={i}
										UpdateCommonData={data.UpdateCommonData}
									/>
						default:
							return null
					}
				})
				: <>
					<div className="text-center">
						<h2 className="lighter-font">No data found</h2>
					</div>
				</>
			}
		</>
	)
}

const CommonType = (data) =>
{
	return (
		<>
			<div className="form-group row my-2">
				<div className="col-md-2">
					<label htmlFor={data.data.name}><b>{data.data.label}</b></label>
				</div>
				<div className="col-md-9">
					<input
						type={data.data.type}
						className="form-control"
						name={data.data.name}
						placeholder={data.data.placeholder}
						id={data.data.name}
						onChange={data.UpdateCommonData}
					/>
				</div>
			</div>
		</>
	)
}

const Selects = (props) =>
{
	const UpdateSelectFields = props.UpdateSelectFields
	props = props.data
	return (
		<>
			<div className="form-group row py-2">
				<div className="col-md-2">
					<label htmlFor={props.name}><b>{props.label}</b></label>
				</div>
				<div className="col-md-9">
					<Select
						disabled={props.disabled}
						required={props.required}
						name={props.name}
						options={props.option}
						onChange={(value) => {UpdateSelectFields(value, props.name)}}
					/>
				</div>
			</div>
		</>
	)
}

const File = (props) =>
{
	return (
		<>
			<div className="form-group row py-2">
				<div className="col-2">
					<label htmlFor={props.data.name}><b>{props.data.label}</b></label>
				</div>
				<div className="col-9">
					<input
						type="file"
						name={props.data.name}
						placeholder={props.data.placeholder}
						className="form-control"
						onChange={props.FileHandler}
					/>
				</div>
			</div>
		</>
	)
}

const TextArea = (props) =>
{
	return (
		<>
			<div className="form-group row py-2">
				<div className="col-2">
					<label htmlFor={props.data.name}><b>{props.data.label}</b></label>
				</div>
				<div className="col-9">
					<textarea name={props.data.name} className="form-control" onChange={props.UpdateCommonData} defaultValue={props.data.value} ></textarea>
				</div>
			</div>
		</>
	)
}
export default AddStaff;