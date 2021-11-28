import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {ServiceDomain} from '../../../../Constants';
import UpdateToken from "../../../../UpdateToken";
import FormsTag from "./FormTags";

const AddStudents = (props) =>
{
	const { addToast } = useToasts();
	const [forms, updateForms] = useState([]);
	const [formData, updateFormData] = useState([]);
	const history = useHistory();
	const updateData = (e) =>
	{
		e.preventDefault();
		updateFormData(
			{
				...formData,
				[e.target.name]: e.target.value
			}
		);
	}

	const updateSelect = (value, name) =>
	{
		updateFormData(
			{
				...formData,
				[name]:value.value
			}
		)
	}

	const AddStudent = (e) =>
	{
		e.preventDefault();
		addToast('Registration process started, please wait', {appearance:'warning', autoDismiss:true});

		fetch(`${ServiceDomain}addstudent`,
		{
			method:'POST',
			headers:{
				'Content-type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID'),
			},
			body:JSON.stringify(formData)
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
				history.push('/dashboard/list-students');
			}
		})
		.catch(error => addToast(error.message, {appearance:'error', autoDismiss:true}));
	}

	const FileHandler = (e) =>
	{
		e.preventDefault();
		let name = e.target.name;
		let reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);

		reader.onload = (e) =>
		{
			updateFormData(
				{
					...formData,
					[name]:e.target.result
				}
			)
		}
	}

	const FetchRegForm = useCallback(() =>
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
			UpdateToken(resp.headers, resp.status);
			return resp.json()
		})
		.then((result) =>
		{
			if(result.header.code === 200)
			{
				updateForms(result.body.result.form);
				let form = {};
				result.body.result.form.forEach((data, i) =>
				{
					form[data.name] = data.value;
				})
				updateFormData(form);
			}
		})
		.catch(error =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	},[addToast])

	useEffect(() =>
	{
		FetchRegForm()
	}, [FetchRegForm]);
	
	return (
		<>
			<FormsTag
				data={forms}
				updateData={updateData}
				updateSelect={updateSelect}
				addStudents={AddStudent}
				FileHandler={FileHandler}
			/>
		</>
	)
}

export default AddStudents;