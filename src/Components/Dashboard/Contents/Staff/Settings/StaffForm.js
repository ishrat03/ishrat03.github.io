import { useState } from "react";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { ServiceDomain } from "../../../../../Constants";
import UpdateToken from "../../../../../UpdateToken";
import Select from 'react-select'
import $ from 'jquery';
import { Modal } from "react-bootstrap";

const StaffForm = () =>
{
	const {addToast} = useToasts();
	const [customForm, udpateCustomForm] = useState([])
	const [loading, UpdateLoading] = useState(false)
	const type = [
		{value:'text', label:'Text'},
		{value:'number', label:'Number'},
		{value:'select', label:'Select Box'},
		{value:'textarea', label:'Long Text Field'},
		{value:'date', label:'Date'},
		{value:'password', label:'Password'},
	]
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [formValue, UpdateFormValue] = useState({
		name:'',
		label:'',
		placeholder:'',
		type:'',
		required:true,
		disabled:false,
		value:'',
		editable:true,
		option:[]
	});

	const ShowValuesFields = (value) =>
	{
		UpdateFormValue({...formValue, type:value.value})
		if(value.value === 'select')
		{
			$('#selectValue').slideDown();
		}
		else
		{
			$('#selectValue').slideUp();
		}
	}

	const UpdateOptions = (e) =>
	{
		let options = e.target.value.split(';')
		let option = [];
		let i = 0;
		options.forEach((resp) =>
		{
			if(resp !== '')
			{
				option[i] = {
					value:resp,
					label:resp.charAt(0).toUpperCase() + resp.slice(1),
					default: (formValue.value === resp) ? true:false
				}

				i = i + 1;
			}
		})

		UpdateFormValue({...formValue, option:option})
	}

	const UpdateFormFields = (e) =>
	{
		UpdateFormValue({...formValue, [e.target.name]:e.target.value})
	}

	const SubmitCustomFields = () =>
	{
		UpdateLoading(true)
		fetch(`${ServiceDomain}addcustomstaffform`,
		{
			method:'POST',
			headers:{
				'Content-type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID'),
			},
			body:JSON.stringify([formValue])
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
				UpdateLoading(false)
				handleClose()
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
					}
				})
				.catch((error) =>
				{
					addToast(error.message, {appearance:'error', autoDismiss:true})
				})
			}
			else
			{
				result.body.result.forEach((resp) =>
				{
					addToast(resp,{appearance:'error', autoDismiss:true})
				})
				UpdateLoading(false)
			}
		})
		.catch((error) =>
		{
			UpdateLoading(false)
			addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	}

	const DeleteField = (name) =>
	{
		if(name === '')
		{
			addToast('Invalid Field Selected', {appearance:'error', autoDismiss:true})
			return false
		}
		
		addToast(`Deleting Form Field with name ${name}`, {appearance:'info', autoDismiss:true})
		fetch(`${ServiceDomain}deletecustomstafffields/${name}`,
		{
			method:'DELETE',
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
			addToast(result.header.msg, {appearance:result.header.status, autoDismiss:true});
			if (result.header.code === 200)
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
					}
				})
				.catch((error) =>
				{
					addToast(error.message, {appearance:'error', autoDismiss:true})
				})
			}
			else
			{
				result.body.result.forEach((resp) =>
				{
					addToast(resp,{appearance:'error', autoDismiss:true})
				})
			}
		})
		.catch((error) =>
		{
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
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}, [addToast]);
	return (
		<>
		<div className="card-c br-2 shadow-lg">
			<div className="card-header text-center">
				<h3 className="lighter-font">Custom Staff Form</h3>
			</div>
			<div className="card-body">
				<div className="row">
					<div className="col-md-12 text-right">
						<button type="button" className="btn btn-primary btn-sm" onClick={handleShow}>
							Add Custom Fields
						</button>
					</div>
				</div>
				<hr style={{color:'red'}} className="shadow-lg"/>
				<div className="row">
					<div className="col-md-3">

					</div>
					<div className="col-md-6">
						<CustomForm data={customForm} DeleteField={DeleteField}/>
					</div>
					<div className="col-md-3">

					</div>
				</div>
			</div>
		</div>

		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Add Custom Fields</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form id="CustomFieldForm">
					<div className="form-group row mb-3">
						<div className="col-md-3 text-right">
							<label><b>Name:</b></label>
						</div>
						<div className="col-md-9">
							<input type="text" name="name" placeholder="Name" className="form-control" onChange={(e) => {UpdateFormFields(e)}}/>
						</div>
					</div>
					<div className="form-group row mb-3	">
						<div className="col-md-3 text-right">
							<label><b>Label:</b></label>
						</div>
						<div className="col-md-9">
							<input type="text" name="label" placeholder="Labels" className="form-control"  onChange={(e) => {UpdateFormFields(e)}}/>
						</div>
					</div>

					<div className="form-group row mb-3	">
						<div className="col-md-3 text-right">
							<label><b>Placeholder:</b></label>
						</div>
						<div className="col-md-9">
							<input type="text" name="placeholder" placeholder="Placeholder" className="form-control"  onChange={(e) => {UpdateFormFields(e)}}/>
						</div>
					</div>
					<div className="form-group row mb-3	">
						<div className="col-md-3 text-right">
							<label><b>Default Value:</b></label>
						</div>
						<div className="col-md-9">
							<input type="text" name="value" placeholder="Default Value" className="form-control"  onChange={(e) => {UpdateFormFields(e)}}/>
						</div>
					</div>
					<div className="form-group row mb-3	">
						<div className="col-md-3 text-right">
							<label><b>Required:</b></label>
						</div>
						<div className="col-md-9">
							<div className="form-check form-check-inline">
								<input className="form-check-input" type="radio" name="required" id="required1" value="1" defaultChecked  onChange={(e) => {UpdateFormFields(e)}}/>
								<label className="form-check-label" htmlFor="required1">Yes</label>
							</div>
							<div className="form-check form-check-inline">
								<input className="form-check-input" type="radio" name="required" id="required2" value="0" onChange={(e) => {UpdateFormFields(e)}}/>
								<label className="form-check-label" htmlFor="required2">No</label>
							</div>
						</div>
					</div>
					<div className="form-group row mb-3	">
						<div className="col-md-3 text-right">
							<label><b>Disabled:</b></label>
						</div>
						<div className="col-md-9">
							<div className="form-check form-check-inline">
								<input className="form-check-input" type="radio" name="disabled" id="disabled1" value="1" onChange={(e) => {UpdateFormFields(e)}}/>
								<label className="form-check-label" htmlFor="disabled1">Yes</label>
							</div>
							<div className="form-check form-check-inline">
								<input className="form-check-input" type="radio" name="disabled" id="disabled2" value="0" defaultChecked onChange={(e) => {UpdateFormFields(e)}}/>
								<label className="form-check-label" htmlFor="disabled2">No</label>
							</div>
						</div>
					</div>

					<div className="form-group row mb-3	">
						<div className="col-md-3 text-right">
							<label><b>Input Type:</b></label>
						</div>
						<div className="col-md-9">
							<Select options={type} onChange={ShowValuesFields} required name="type"/>
						</div>
					</div>
					<div id="selectValue" className="form-group row mb-3" style={{display:'none'}}>
						<div className="col-md-3 text-right">
							<label><b>Select Box Values:</b></label>
						</div>
						<div className="col-md-9">
							<textarea  className="form-control" placeholder="Use comma(;) separated values" onChange={UpdateOptions} name="option"></textarea>
							<div className="text-info mb-2">
								Use comma(;)separated option values
							</div>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<button className="btn btn-danger btn-sm" onClick={handleClose}>Close</button>
				<button type="button" className="btn btn-primary btn-sm" onClick={SubmitCustomFields}>
					{
						(loading)
							? 'Adding....'
							: 'Add Custom Field'
					}
				</button>
			</Modal.Footer>
		</Modal>
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
							return <CommonType data={resp} key={i} DeleteField={data.DeleteField}/>
						case 'date':
						return <CommonType data={resp} key={i} DeleteField={data.DeleteField}/>
						case 'email':
							return <CommonType data={resp} key={i} DeleteField={data.DeleteField}/>
						case 'number':
							return <CommonType data={resp}  key={i} DeleteField={data.DeleteField}/>
						case 'select':
							return <Selects data={resp}  key={i} DeleteField={data.DeleteField}/>
						case 'file':
							return <File data={resp}  key={i} DeleteField={data.DeleteField}/>
						case 'textarea':
							return <TextArea data={resp}  key={i} DeleteField={data.DeleteField}/>
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
					/>
				</div>
				{
					(data.data.editable)
					?
						<>
							<div className="col-md-1">
								<button
									className="btn btn-danger btn-sm"
									onClick={() => {data.DeleteField(data.data.name)}}
								>
									<i className="bi bi-trash-fill"></i>
								</button>
							</div>
						</>
					: null
				}
			</div>
		</>
	)
}

const Selects = (props) =>
{
	const DeleteField = props.DeleteField
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
					/>
				</div>
				{
					(props.editable)
					?
						<>
							<div className="col-md-1">
								<button
									className="btn btn-danger btn-sm"
									onClick={() => {DeleteField(props.name)}}
								>
									<i className="bi bi-trash-fill"></i>
								</button>
							</div>
						</>
					: null
				}
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
					/>
				</div>
				{
					(props.data.editable)
					?
						<>
							<div className="col-md-1">
								<button
									className="btn btn-danger btn-sm"
									onClick={() => {props.DeleteField(props.data.name)}}
								>
									<i className="bi bi-trash-fill"></i>
								</button>
							</div>
						</>
					: null
				}
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
					<textarea name={props.data.name} className="form-control" onChange={props.updateData} defaultValue={props.data.value} ></textarea>
				</div>
				{
					(props.data.editable)
					?
						<>
							<div className="col-md-1">
								<button
									className="btn btn-danger btn-sm"
									onClick={() => {props.DeleteField(props.data.name)}}
								>
									<i className="bi bi-trash-fill"></i>
								</button>
							</div>
						</>
					: null
				}
			</div>
		</>
	)
}

export default StaffForm