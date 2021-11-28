import { useState, useEffect, useCallback } from 'react';
import {ServiceDomain} from '../../Constants';
import { useHistory } from "react-router-dom";
import {useToasts} from 'react-toast-notifications';
import '../../assets/css/login.css';

const Login = (props) =>
{
	props = props.props;
	const history = useHistory();
	const [data, updateData] = useState(
		{
			username:'',
			password:''
		}
	)
	
	const ValidateLogin = useCallback(() =>
	{
		if (props.login === true)
		{
			history.push('/dashboard');
		}
	},[history, props])
	
	const { addToast } = useToasts();
	const UpdateState = (e) =>
	{
		e.preventDefault();
		updateData(
			{
				...data,
				[e.target.name]: e.target.value
			}
			);
		}
		
		const ValidateUser = (e) =>
		{
			e.preventDefault();
		addToast('Validating User', {appearance:'warning', autoDismiss:true})
		fetch(`${ServiceDomain}login`,
		{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify(data)
		})
		.then(resp => resp.json())
		.then((result) =>
		{
			addToast(result.header.msg, {appearance:result.header.status, autoDismiss:true})
			if (result.header.code === 200)
			{
				localStorage.setItem('Session-ID', result.body.result.token);
				localStorage.setItem('userDetails', JSON.stringify(result.body.result.userDetails));
				props.dispatch({type:'UPDATE_LOGIN', payload:true});
				history.push('/dashboard');
			}
			else if(result.header.code === 202)
			{
				Object.keys(result.body.result.error).forEach(function(data)
				{
					result.body.result.error[data].map((resp) =>
					{
						addToast(resp, {appearance:'error', autoDismiss:true});
						return true;
					})
				});
			}
		})
		.catch((error) =>
		{
			addToast(error.message, {appearance:'error', autoDismiss:true});
		})
	}

	useEffect(() => {
		ValidateLogin();
	}, [ValidateLogin]);

	return (
		<>
			<div className="container center-box">
				<div className="row">
					<div className="col-md-4"></div>
					<div className="col-md-4">
						<div className="card shadow-lg">
							<div className="card-body py-2">
								<h2 className="text-center">
									User's Login
								</h2>
								<hr />

								<form onSubmit={(event) =>{ValidateUser(event)}}>
									<div className="form-group">
										<label htmlFor="username">Username</label>
										<input type="text" name="username" id="username" className="form-control" placeholder="username" onChange={UpdateState}/>
									</div>
									<div className="form-group py-2">
										<label htmlFor="password">Password</label>
										<input type="password" name="password" id="password" className="form-control" placeholder="Password" onChange={UpdateState}/>
									</div>

									<div className="row">
										<div className="col-md-1"></div>
										<div className="col-md-10">
											<div className="d-grid gap-2">
												<button className="btn btn-lg btn-primary btn-sm" type="submit">Login</button>
											</div>
										</div>
										<div className="col-md-1"></div>
									</div>
									<hr />
									<div className="col-12 text-right">
										Forget Password?
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="col-md-4"></div>
				</div>
			</div>
		</>
	)
}

export default Login;