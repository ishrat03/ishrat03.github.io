import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import { ServiceDomain } from "../../../../Constants";
import UpdateToken from "../../../../UpdateToken";

const AddAttandance = (props) =>
{
	props = props.props;
	const history = useHistory()
	const [sessions, updateSessions] = useState([]);
	const {addToast} = useToasts();
	const [selectedSession, updateSelectedSession] = useState('')
	const [selectedStd, updateSelectedStd] = useState('')
	const [students, updateStudents] = useState([])
	const [absentAll, updateAbsentAll] = useState(true)
	const [presentAll, updatePresentAll] = useState(false)
	const [date, updateDate] = useState('')
	
	const fetchStudentList = (session, std, date) =>
	{
		if(session === '')
		{
			addToast('Please Select Session', {appearance:'warning', autoDismiss:true})
			return false;
		}
		
		if(std === '')
		{
			addToast('Please Select standard', {appearance:'warning', autoDismiss:true})
			return false
		}

		if(date === '')
		{
			addToast('Please Select date', {appearance:'warning', autoDismiss:true})
			return false
		}

		fetch(`${ServiceDomain}getstudents/${session}/${std}/${date}`,
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
				if(response.body.result.data.length < 1)
				{
					addToast('No Student Registered in this Standard', {appearance:'warning', autoDismiss:true})
					updateStudents([])
				}
				else
				{
					updateStudents(response.body.result.data)
					updatePresentAbsent(response.body.result.absentPresent.present)
					updateAbsentAll(response.body.result.absentPresent.absent)
				}
			}
			else if(response.header.code === 202)
			{
				addToast(response.header.msg, {appearance:response.header.status, autoDismiss:true})
				updateStudents([])
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}

	const FetchDetails = (value, type) => 
	{
		if(type === 'session')
		{
			updateSelectedSession(value.value)
			fetchStudentList(value.value, selectedStd, date)
			return true;
		}

		if(type === 'std')
		{
			updateSelectedStd(value.value)
			fetchStudentList(selectedSession, value.value, date)
			return true
		}

		if(type === 'date')
		{
			updateDate(value)
			fetchStudentList(selectedSession, selectedStd, value)
			return true
		}

		return false
	}
	
	const updatePresentAbsent = (value, type) =>
	{
		if(type === 'absent')
		{
			updateAbsentAll(!value)
			updatePresentAll(value)
			updateAllAttandance(false)
		}
		else if(type === 'present')
		{
			updateAbsentAll(value)
			updatePresentAll(!value)
			updateAllAttandance(true)
		}
	}

	const updateAllAttandance = (value) =>
	{
		let result = [...students]
		result.forEach((resp, i) =>
		{
			resp['attandance'] = value
			result[i] = resp
		})
		
		updateStudents(result)
	}

	const updateAttandance = (studentId, value) =>
	{
		let result = [...students]
		let a = []
		result.forEach((resp, i) =>
		{
			if(resp.studentId === studentId)
			{
				result[i]['attandance'] = !value
			}
			a[result[i]['attandance']] = result[i]['attandance']
		})
		updateStudents(result)
		if(a[true] !== undefined && a[false] !== undefined)
		{
			updateAbsentAll(false)
			updatePresentAll(false)
		}
		else
		{
			if(a[true] !== undefined)
			{
				updatePresentAll(true)
			}
			
			if(a[false] !== undefined)
			{
				updateAbsentAll(true)
			}
		}
	}

	const AddUpdateAttandance = () =>
	{
		let data = {
			date: date,
			session:selectedSession,
			std:selectedStd,
			attandance:students
		}
		addToast("adding Attandance<br>\n Please wait", {appearance:'info', autoDismiss:true})
		fetch(`${ServiceDomain}addupdateattadance`,
		{
			method:'POST',
			headers:{
				'Content-Type':'application/json',
				'Authorization':'Bearer ' + localStorage.getItem('Session-ID')
			},
			body:JSON.stringify(data)
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status);
			return resp.json();
		})
		.then((response) =>
		{
			addToast(response.header.msg, {appearance:response.header.status, autoDismiss:true})
			if(response.header.code === 200)
			{
				history.push('/dashboard/view-attendance');
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
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
			<div className="card-c br-2 shadow-lg card-body py-1">
				<div className="row">
					<div className="col-md-4 col-12 py-2">
						<div className="form-group row">
							<div className="col-md-3">
								<b>Session</b>
							</div>
							<div className="col-md-9 col-xs-12">
								<Select
									options={sessions}
									onChange={(value) => {FetchDetails(value, 'session')}}
								/>
							</div>
						</div>
					</div>

					<div className="col-md-4 col-12 py-2">
						<div className="form-group row">
							<div className="col-md-3">
								<b>Standard</b>
							</div>
							<div className="col-md-9 col-xs-12">
								<Select
									options={props.admissionStd}
									onChange={(value) => {FetchDetails(value, 'std')}}
								/>
							</div>
						</div>
					</div>

					<div className="col-md-4 col-12 py-2">
						<div className="form-group row">
							<div className="col-md-3">
								<b>Date</b>
							</div>
							<div className="col-md-9 col-xs-12">
								<input type="date" className="form-control" onChange={(value) => {FetchDetails(value.target.value, 'date')}}/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="row my-2">
				<div className="col-md-12">
					<div className="card-c br-1 shadow-lg card-body">
						<div className="row">
							<div className="col-md-1">
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										id="flexCheckDefault1"
										checked={absentAll}
										onChange={() =>{updatePresentAbsent(absentAll, 'absent')}}
									/>
									<label className="form-check-label" htmlFor="flexCheckDefault1">
										Absent All
									</label>
								</div>
							</div>
							<div className="col-md-1">
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										id="flexCheckDefault"
										checked={presentAll}
										onChange={() =>{updatePresentAbsent(presentAll, 'present')}}
									/>
									<label className="form-check-label" htmlFor="flexCheckDefault">
										Present All
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{
				(students.length > 0)
				? 
					<div className="card-c br-1 shadow-lg card-body">
						<div className="row">
							<div className="col-md-12">
								<div className="row">
									{
										students.map((resp, i) =>
										{
											return <StudentBox
													resp={resp}
													updateAttandance={updateAttandance}
													key={i}
													/>
										})
									}
								</div>
							</div>
						</div>
						<hr />
						<div className="d-grid gap-2 col-6 mx-auto">
							<button
								className="btn btn-primary"
								type="button"
								onClick={AddUpdateAttandance}
							>
								Add/Update AddAttandance
							</button>
						</div>
					</div>
				: null
			}
		</>
	)
}

const StudentBox = (props) =>
{
	return (
		<>
			<div className="col-md-3 my-1">
				<div className="card-c br-1 shadow-lg card-body">
					<div className="form-check">
						<div className="row">
							<div className="col-md-10">
								<label className="form-check-label" htmlFor={`idof${props.resp.studentId}`}>
									<div className="row">
										<div className="col-md-3">
											<img src={props.resp.image} width="50" height="50" alt="missing" style={{borderRadius:'50%'}}/>
										</div>
										<div className="col-md-9 align-middle">
											<b className="align-middle">{props.resp.name}</b>
											<br />
											<b>S/O : {props.resp.fatherName}</b>
										</div>
									</div>
								</label>
							</div>
							<div className="col-md-2">
								<input
									className="form-check-input"
									type="checkbox"
									id={`idof${props.resp.studentId}`}
									checked={props.resp.attandance}
									onChange={() =>{props.updateAttandance(props.resp.studentId, props.resp.attandance)}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddAttandance;