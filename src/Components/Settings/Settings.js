import { useEffect } from "react";
import { ServiceDomain } from "../../Constants";
import UpdateToken from "../../UpdateToken";
import { useToasts } from 'react-toast-notifications';
import {useState} from 'react'
import Select from 'react-select'

const Settings = (props) =>
{
	const [settings, updateSettings] = useState([]);
	const {addToast} = useToasts();
	const [loading, updateLoading] = useState(false)
	const [saveSetting, updateSaveSetting] = useState(false)

	const updateData = (e) =>
	{
		e.preventDefault();
		UpdateSettings(e.target.name, e.target.value)
	}

	const updateSelect = (value, name) =>
	{
		UpdateSettings(name, value.value)
	}

	const UpdateSettings = (name, value) =>
	{
		let data = [...settings]

		data.forEach((resp, i) =>
		{
			if(resp.name === name)
			{
				data[i].value = value;
			}
		})

		updateSettings(data)
	}

	const SaveSettings = (e) =>
	{
		e.preventDefault()
		updateSaveSetting(true)
		addToast('Saving setting', {appearance: 'warning', autoDismiss:true})
		fetch(`${ServiceDomain}savesettings`,
		{
			method:'POST',
			headers:{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID')
			},
			body: JSON.stringify(settings)
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((resp) =>
		{
			addToast(resp.header.msg, {appearance:resp.header.status, autoDismiss:true})
			updateSaveSetting(false)
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
			updateSaveSetting(false)
		})
	}

	useEffect((addToast) =>
	{
		updateLoading(true)
		fetch(`${ServiceDomain}getsettings`,
		{
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
		.then((result) =>
		{
			if(result.header.code === 200)
			{
				updateSettings(result.body.result);
			}

			updateLoading(false)
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
			updateLoading(false)
		})
	}, []);

	return (
		<>
			<div className="text-center">
				<h4 className="lighter-font">Application Settings</h4>
			</div>
			<hr />
			
			<div className="row">
				<div className="col-md-3"></div>
				<div className="col-md-6">
					{
						(loading)
						? <div className="text-center">
							<h4 className="lighter-font">Loading....</h4>
						</div>
						:
							<form>
								{
									settings.map((resp, i) =>
									{
										return <SetInputField
													data={resp}
													key={i}
													updateData={updateData}
													updateSelect={updateSelect}
												/>
									})
								}

								<div className="d-grid gap-2 col-6 mx-auto my-2">
									<button
										className="btn btn-primary"
										type="button"
										onClick={SaveSettings}
									>
									{
										(!saveSetting) ? 'Update Settings' : 'Saving Settings...'
									}
										
									</button>
								</div>
							</form>
					}
				</div>
				<div className="col-md-3"></div>
			</div>
		</>
	)
}

const SetInputField = (props) =>
{
	switch (props.data.type)
	{
		case 'select':
			return <SelectBox
						data={props.data}
						updateSelect={props.updateSelect}
					/>
		case 'textarea':
			return <TextArea
						data={props.data}
						updateData={props.updateData}
					/>
		
		case 'text':
			return <Texts
						data={props.data}
						updateData={props.updateData}
					/>
		case 'number':
			return <Texts
						data={props.data}
						updateData={props.updateData}
					/>
		case 'email':
			return <Texts
						data={props.data}
						updateData={props.updateData}
					/>
		default:
			return ''
	}
}

const SelectBox = (props) =>
{
	return (
		<div className="form-group row my-2">
			<div className="col-md-3">
				<b>{props.data.label}</b>
			</div>
			<div className="col-md-9">
				<Select
					name={props.data.name}
					options={props.data.options}
					onChange={(value) => {props.updateSelect(value, props.data.name)}}
					defaultValue={props.data.options.filter(options => options.value === props.data.value)}
				/>
			</div>
		</div>
	)
}

const TextArea = (props) =>
{
	return (
		<div className="form-group row">
			<div className="col-md-3">
				<b>{props.data.label}</b>
			</div>
			<div className="col-md-9">
				<textarea
					name={props.data.name}
					className="form-control"
					onChange={props.updateData}
					defaultValue={props.data.value}
				></textarea>
			</div>
		</div>
	)
}

const Texts = (props) =>
{
	return (
		<div className="form-group row my-2">
			<div className="col-md-3">
				<b>{props.data.label}</b>
			</div>
			<div className="col-md-9">
				<input
					name={props.data.name}
					className="form-control"
					onChange={props.updateData}
					defaultValue={props.data.value}
				/>
			</div>
		</div>
	)
}

export default Settings;