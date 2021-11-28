import { useCallback, useEffect, useState } from "react";
import {ServiceDomain} from '../../../../../Constants';
import Select from 'react-select'
import { useToasts } from "react-toast-notifications";
import Swal from 'sweetalert2';
import UpdateToken from "../../../../../UpdateToken";

const ListSettings = (props) =>
{
	const [forms, updateForms] = useState([]);
	const type = [
		{value:'text', label:'Text'},
		{value:'number', label:'Number'},
		{value:'select', label:'Select Box'},
		{value:'textarea', label:'Long Text Field'},
		{value:'date', label:'Date'},
		{value:'password', label:'Password'},
	]

	const {addToast} = useToasts();
	const [newInput, updateNewInput] = useState(
		{
			name:'',
			label: '',
			placeholder : '',
			type: '',
			required : true,
			disabled : false,
			value : '',
			editable: true
		}
	);

	const [option, updateOption] = useState([{value:1}]);
	const [options, optionsUpdate] = useState([{value:'', label:''}]);

	const UpdateNewField = (e) =>
	{
		updateNewInput({
			...newInput,
			[e.target.name] : e.target.value
		})
	}
	
	const OptionsUpdate = (e, id) =>
	{
		let values = {value:options[id].value, label:options[id].label};
		values = {...values, [e.target.name]:e.target.value}
		options[id] = values;
		optionsUpdate(options)
	}

	const UpdateSelect = (value) =>
	{
		let type = 'type'
		updateNewInput({
			...newInput,
			[type] : value.value
		})

		if (value.value === 'select')
		{
			document.getElementById('optionBox').style.display = 'block'
			if(newInput['option'] === undefined)
			{
				newInput['option'] = {option:[]};
			}
		}
		else
		{
			delete newInput.option
			updateOption([]);
			document.getElementById('optionBox').style.display = 'none'
		}
	}

	const AddMoreOptions = (e) =>
	{
		e.preventDefault();
		updateOption([
			...option,
			{value:1}
		])

		optionsUpdate([
			...options,
			{value:'', label:''}
		])
	}

	const AddField = (e) =>
	{
		e.preventDefault()
		let error = 'no';
		Object.keys(newInput).forEach((data, i) =>
		{
			if(newInput[data] === '' && data !== 'value')
			{
				addToast(`${data} should not be empty`, {appearance:'error', autoDismiss:true})

				if(error === 'no')
				{
					error = 'yes'
				}
			}
		})

		if(error === 'no')
		{
			if (newInput.type === 'select')
			{
				newInput['option'] = options
			}
			
			forms.push(newInput);

			fetch(`${ServiceDomain}updateregistrationform`,
			{
				method:'PATCH',
				headers:{
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + localStorage.getItem('Session-ID')
				},
				body:JSON.stringify(forms)
			})
			.then((resp) =>
			{
				UpdateToken(resp.headers, resp.status);
				return resp.json()
			})
			.then((response) => 
			{
				addToast(response.header.msg, {appearance:response.header.status, autoDismiss:true});
				if (response.header.code === 200)
				{
					document.getElementById('exampleModal').click();
					document.getElementById('addNewField').reset();
					FetchForms();
				}
			})
			.catch(error => addToast(error.message, {appearance:'error', autoDismiss:true}));
		}
	}

	const FetchForms = useCallback(() =>
	{
		fetch(`${ServiceDomain}regform`,
		{
			headers:{
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers);
			return resp.json()
		})
		.then((result) =>
		{
			if(result.header.code === 200)
			{
				updateForms(result.body.result.form);
			}
		})
		.catch(error =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	},[addToast])

	const DeleteField = (name) =>
	{
		Swal.fire(
			{
				title: 'Are you sure?',
				text: "You won't be able to recover this field later",
				icon:'info',
				showCancelButton: true,
				confirmButtonText: `Yes Remove it`,
				showLoaderOnConfirm:true,
				preConfirm: () =>
				{
					return fetch(`${ServiceDomain}deletefield`,{method:'delete', headers:{'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('Session-ID')},body:JSON.stringify({name:name})})
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

					FetchForms();
				}
			}
		)
	}
	
	useEffect(() =>
	{
		FetchForms();
	}, [FetchForms])
	return (
		<>
			<div className="card card-body">
				<div className="text-center">
					<h3 className="lighter-font">Student Registration Form</h3>
				</div>
				<hr />
				<div className="text-right">
					<button className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
						<i className="bi bi-patch-plus-fill"></i> Add New Field
					</button>
				</div>
				<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="ModalLabelexampleModal" aria-hidden="true">
					<div className="modal-dialog ">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModal"></button>
							</div>
							<div className="modal-body">
								<form id="addNewField">
									<div className="form-group row">
										<div className="col-md-4 text-right">
											<b>Name: </b>
										</div>
										<div className="col-md-8">
											<input type="text" className="form-control" placeholder="Field Name" name="name" onChange={UpdateNewField} required/>
										</div>
									</div>

									<div className="form-group row py-2">
										<div className="col-md-4 text-right">
											<b>Label: </b>
										</div>
										<div className="col-md-8">
											<input type="text" className="form-control" placeholder="Label" name="label"  onChange={UpdateNewField} required/>
										</div>
									</div>
									<div className="form-group row py-2">
										<div className="col-md-4 text-right">
											<b>Placeholder: </b>
										</div>
										<div className="col-md-8">
											<input type="text" className="form-control" placeholder="Placeholder" name="placeholder"  onChange={UpdateNewField} required/>
										</div>
									</div>

									<div className="form-group row py-2">
										<div className="col-md-4 text-right">
											<b>Required</b>
										</div>
										<div className="col-md-8">
											<div className="form-check form-check-inline">
												<input className="form-check-input" type="radio" name="required" id="required1" value="1"  onChange={UpdateNewField} required/>
												<label className="form-check-label" htmlFor="required1">Yes</label>
											</div>
											<div className="form-check form-check-inline">
												<input className="form-check-input" type="radio" name="required" id="required2" value="0"  onChange={UpdateNewField} required/>
												<label className="form-check-label" htmlFor="required2">No</label>
											</div>
										</div>
									</div>

									<div className="form-group row py-2">
										<div className="col-md-4 text-right">
											<b>Disabled</b>
										</div>
										<div className="col-md-8">
											<div className="form-check form-check-inline">
												<input className="form-check-input" type="radio" name="disabled" id="inlineRadio1" value="1"  onChange={UpdateNewField} required/>
												<label className="form-check-label" htmlFor="inlineRadio1">Yes</label>
											</div>
											<div className="form-check form-check-inline">
												<input className="form-check-input" type="radio" name="disabled" id="inlineRadio2" value="0"  onChange={UpdateNewField} required/>
												<label className="form-check-label" htmlFor="inlineRadio2">No</label>
											</div>
										</div>
									</div>

									<div className="form-group row py-2">
										<div className="col-md-4 text-right">
											<b>Default Value: </b>
										</div>
										<div className="col-md-8">
											<input type="text" className="form-control" placeholder="Default Value" name="value"  onChange={UpdateNewField} required/>
										</div>
									</div>

									<div className="form-group row py-2">
										<div className="col-md-4 text-right">
											<b>Type: </b>
										</div>
										<div className="col-md-8">
											<Select  options={type} onChange={UpdateSelect} required name="type"/>
										</div>
									</div>

									<div className="form-group row py-2 hidden" style={{display:"none"}} id="optionBox">
										<div className="row">
											<div className="col-md-3">
											</div>
											<div className="col-md-9">
												<div className="text-center">
													<h6 className="lighter-font">Add Options</h6>
													<div className="text-right py-2">
														<button className="btn btn-warning btn-sm" onClick={AddMoreOptions}>Add More Option</button>
													</div>
													<hr />
												</div>
												<div id="moreOptions">
													{
														option.map((data, i) =>
														{
															return <AddMoreOption key={i} props={OptionsUpdate} keys={i}/>
														})
													}
												</div>
											</div>
										</div>
									</div>

									<div className="form-group row">
										<button
											className="btn btn-sm btn-primary"
											type="submit"
											onClick={AddField}
										>
											Add Field
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-2">

					</div>
					<div className="col-md-8">
						{
							forms.map((data, i) =>
							{
								if(data.name === 'std')
								{
									data.option = props.props.admissionStd
								}

								return <SwitchForms
											data={data}
											key={i}
											keys={i}
											DeleteField={DeleteField}
										/>
							})
						}
					</div>
					<div className="col-md-2">

					</div>
				</div>
			</div>
		</>
	)
}

const AddMoreOption = (props) =>
{
	return (
		<>
			<div className="form-group row">
				<div className="col-md-3">
					<b>Value</b>
				</div>
				<div className="col-md-9">
					<input type="text" className="form-control" placeholder="value" name="value" onChange={(event) => {props.props(event, props.keys)}}/>
				</div>
			</div>
			<div className="form-group row py-2">
				<div className="col-md-3">
					<b>Label</b>
				</div>
				<div className="col-md-9">
					<input type="text" className="form-control" placeholder="Label" name="label" onChange={(event) => {props.props(event, props.keys)}}/>
				</div>
			</div>
			<hr />
		</>
	)
}

const SwitchForms = (props) =>
{
	const DeleteField = props.DeleteField;
	const data = props.data;
	const i = props.keys;

	switch (data.type)
	{
		case 'text':
			return <CommonInputs
						key={i}
						props={data}
						type="text"
						DeleteField={DeleteField}
					/>
		case 'number':
			return <CommonInputs
						key={i}
						props={data}
						type="number"
						DeleteField={DeleteField}
					/>
		case 'email':
			return <CommonInputs
						props={data}
						type="email"
						key={i}
						DeleteField={DeleteField}
					/>
		case 'date':
			return <CommonInputs
						props={data}
						type="date"
						key={i}
						DeleteField={DeleteField}
					/>
		case 'select':
			return <Selects props={data} key={i} DeleteField={DeleteField}/>
		case 'textarea' :
			return <TextArea data={data} key={i} DeleteField={DeleteField}/>
		case 'file' :
			return <CommonInputs
						props={data}
						type="file"
						key={i}
						DeleteField={DeleteField}
					/>
		default:
			return ''
	}
}

const CommonInputs = (props) =>
{
	const type = props.type;
	const DeleteField = props.DeleteField;
	props = props.props;

	return (
		<>
			<div className="form-group row py-2">
				<div className="col-4">
					<label htmlFor={props.name}><b>{props.label}</b></label>
				</div>
				<div className="col-7">
					<input
						type={type}
						className="form-control"
						placeholder={props.placeholder}
						required={props.required}
						name={props.name}
						defaultValue={props.value}
						disabled
					/>
				</div>
				{
					(props.editable)
					?
						<div className="col-1">
							<button
								className="btn btn-sm btn-danger"
								onClick={() => {DeleteField(props.name)}}
							>
								<i className="bi bi-x-lg"></i>
							</button>
						</div>
					:
						null
				}
			</div>
		</>
	)
}

const Selects = (props) =>
{
	const DeleteField = props.DeleteField;
	props = props.props;
	return (
		<>
			<div className="form-group row py-2">
				<div className="col-4">
					<label htmlFor={props.name}><b>{props.label}</b></label>
				</div>
				<div className="col-7">
					<Select
						disabled="true"
						required={props.required}
						name={props.name}
						options={props.option}
						defaultValue={props.option.filter(option => option.value === props.value)}
					/>
				</div>
				{
					(props.editable)
					?
						<div className="col-1">
							<button
								className="btn btn-sm btn-danger"
								onClick={() => {DeleteField(props.name)}}
							>
								<i className="bi bi-x-lg"></i>
							</button>
						</div>
					:
						null
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
				<div className="col-4">
					<label htmlFor={props.data.name}><b>{props.data.label}</b></label>
				</div>
				<div className="col-7">
					<textarea name={props.data.name} className="form-control" disabled></textarea>
				</div>
				{
					(props.data.editable)
					?
						<div className="col-1">
							<button
								className="btn btn-sm btn-danger"
								onClick={() => {props.DeleteField(props.data.name)}}
							>
								<i className="bi bi-x-lg"></i>
							</button>
						</div>
					:
						null
				}
			</div>
		</>
	)
}

export default ListSettings;