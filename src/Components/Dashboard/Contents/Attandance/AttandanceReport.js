import { useEffect, useState } from "react";
import Select from "react-select";
import { useToasts } from "react-toast-notifications";
import { ServiceDomain } from "../../../../Constants";
import UpdateToken from "../../../../UpdateToken";

const AttandanceReport = (props) =>
{
	props = props.props
	const [sessions, updateSessions] = useState([]);
	const {addToast} = useToasts();
	const [selectedSession, updateSelectedSession] = useState('')
	const [selectedStd, updateSelectedStd] = useState('')
	const [attandance, updateAttandance] = useState([])
	const [selectedMonth, updateSelectedMonth] = useState('')
	const [months, updateMonths] = useState([])
	// const [headers, updateHeaders] = useState([])
	const [month, updateMonth] = useState('')
	
	const fetchStudentList = (session, std, month) =>
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
		
		if(month === '')
		{
			addToast('Please Select Month', {appearance:'warning', autoDismiss:true})
			return false
		}

		fetch(`${ServiceDomain}getattandance/${session}/${std}/${month}?report=1`,
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
				if(response.body.result.length < 1)
				{
					addToast('No Student Registered in this Standard or no record for attandance', {appearance:'warning', autoDismiss:true})
					updateAttandance([])
				}
				else
				{
					updateAttandance(response.body.result)
					let header = []
					response.body.result[0].attandance.forEach((element, i) =>
					{
						element = element.name + ' 00:00:00'
						var date = new Date(element);
						header[i] = date.getDate()
						updateMonth(date.getFullYear() + ' - '+ date.toLocaleString('default', { month: 'long' }))
					});
					
					// updateHeaders(header)
				}
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}

	const DownloadAttandance = () =>
	{
		fetch(`${ServiceDomain}getattandance/${selectedSession}/${selectedStd}/${selectedMonth}?download=1`,
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
			addToast('Successfully Fetched file', {appearance:'success', autoDismiss:true})
		})
	}

	const FetchDetails = (value, type) => 
	{
		if(type === 'session')
		{
			updateSelectedSession(value.value)
			fetchStudentList(value.value, selectedStd, selectedMonth)
			return true;
		}

		if(type === 'std')
		{
			updateSelectedStd(value.value)
			fetchStudentList(selectedSession, value.value, selectedMonth)
			return true
		}

		if(type === 'month')
		{
			updateSelectedMonth(value.value)
			fetchStudentList(selectedSession, selectedStd, value.value)
			return true
		}

		return false
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

		fetch(`${ServiceDomain}getmonths`,
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
				updateMonths(response.body.result)
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
								<b>Month</b>
							</div>
							<div className="col-md-9 col-xs-12">
								<Select
									options={months}
									onChange={(value) => {FetchDetails(value, 'month')}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{
				(attandance.length > 0)
				?
					<div className="card-c br-2 shadow-lg card-body my-2">
						<div className="row">
							<div className="col-12">
								<span className="float-start">
									<h3 className="lighter-font">{month}</h3>
								</span>
								<span className="float-end">
									<button
										className="btn btn-sm btn-primary"
										onClick={DownloadAttandance}
									>
										Download Attandance
									</button>
								</span>
							</div>
						</div>
						<hr />
						{
							(attandance.length > 0)
							?
							<div className="row">
								{
									attandance.map((resp, i) =>
									{
										return <div className="col-md-4" key={i}>
											<div className="card-c br-1 shadow-lg mb-3">
												<div className="row g-0">
													<div className="col-md-4">
														<img src={resp.studentDetails.image} className="img-fluid rounded-start" alt="..." style={{height:150, width:'100%'}}/>
													</div>
													<div className="col-md-8">
														<div className="card-body">
															<h6 className="card-title">{resp.studentDetails.name} S/O {resp.studentDetails.fatherName}</h6>
															<hr/>
															<p className="card-text">
																<div className="row">
																	<div className="col-md-4 col-sm-5 col-xs-5">
																		<b>Present</b>
																		<br />
																		{resp.summary.present}
																	</div>
																	<div className="col-md-4 col-sm-4 col-xs-4">
																		<b>Absent</b>
																		<br />
																		{resp.summary.absent}
																	</div>
																	
																	<div className="col-md-4 col-sm-3 col-xs-3">
																		<b>%</b>
																		<br />
																		{resp.summary.percentage}
																	</div>
																</div>
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									})
								}
							</div>
							:null
						}
					</div>
				: null
			}
		</>
	)
}

export default AttandanceReport;