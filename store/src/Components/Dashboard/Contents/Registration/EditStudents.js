import { useParams } from "react-router-dom"
import {useCallback, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useEffect } from "react";
import {ServiceDomain} from '../../../../Constants';
import FormsTag from './FormTags';
import UpdateToken from '../../../../UpdateToken';

const EditStudents = (props) =>
{
	const params = useParams();
	const [formData, updateFormData] = useState([]);
	const history = useHistory();
	const {addToast} = useToasts();
	const [form, updateForm] = useState([]);
	
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

	const FetchDetals = useCallback(() =>
	{
		fetch(`${ServiceDomain}editstudent/${params.id}`,
		{
			method:'GET',
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
			if (result.header.code === 200)
			{
				updateForm(result.body.result.data);
				const b = {};
				result.body.result.data.forEach((a) =>
				{
					b[a.name] = a.value;
				})

				updateFormData(b);
			}
		})
		.catch(error => addToast(error.message, {appearance:'error', autoDismiss:true}))
	},[addToast, params])

	const UpdateStudent = (e) =>
	{
		e.preventDefault();
		addToast('Updating Student details, Please wait', {appearance:'warning',autoDismiss:true})
		fetch(`${ServiceDomain}updatestudent/${params.id}`,
		{
			method:'patch',
			headers:{
				'Content-Type' : 'application/json',
				'Authorization' : 'Bearer ' + localStorage.getItem('Session-ID')
			},
			body: JSON.stringify(formData)
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json()
		})
		.then((result) =>
		{
			addToast(result.header.msg, {appearance:result.header.status, autoDismiss:true})
			if (result.header.code === 200)
			{
				history.push('/dashboard/list-students')
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

	useEffect(() =>
	{
		FetchDetals()
	},[FetchDetals])
	
	return (
		<>
			<FormsTag
				data={form}
				updateData={updateData}
				updateSelect={updateSelect}
				addStudents={UpdateStudent}
				header="Update Student"
				btnText="Update Student"
				FileHandler={FileHandler}
			/>
		</>
	)
}

export default EditStudents;