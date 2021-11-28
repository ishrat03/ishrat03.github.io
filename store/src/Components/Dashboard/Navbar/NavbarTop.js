import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {ServiceDomain} from '../../../Constants';
import UpdateToken from '../../../UpdateToken';

const TopNavbar = (props) =>
{
	props = props.props;
	const [logo, updateLogo] = useState('');
	
	const history = useHistory();
	// const toggleFullScreen = () =>
	// {
	// 	if (screenfull.isEnabled)
	// 	{
	// 		screenfull.toggle();
	// 	}
	// }

	const logout = (e) =>
	{
		e.preventDefault();
		localStorage.clear();
		props.dispatch({type:'UPDATE_LOGIN', payload:false});
		setTimeout(() => {
			history.push('/');
		}, 300);
	}
	useEffect(() =>
	{
		let userDetails = JSON.parse(localStorage.getItem('userDetails'));
		if(userDetails !== null)
		{
			updateLogo(userDetails.logo);
		}
	}, []);
	return(
		<>
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
  				<div className="container-fluid">
					<button className="navbar-toggler me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
						<span className="navbar-toggler-icon"></span>
					</button>
					<Link className="navbar-brand fw-bold text-uppercase me-auto" to="/dashboard">
						{logo}
					</Link>
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<form className="d-flex ms-auto my-3 my-lg-0">
							<div className="input-group">
								<input type="text" className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" />
								<button className="btn btn-primary" type="button" id="button-addon2"><i className="bi bi-search"></i></button>
							</div>
						</form>
						<ul className="navbar-nav mb-2 mb-lg-0 mx-2">
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#nolink" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									<i className="bi bi-person-circle"></i>
								</a>
								<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
									<li><hr className="dropdown-divider" /></li>
									<li><a className="dropdown-item" href="#nolink" onClick={(event) => {logout(event)}}>Logout</a></li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	)
}

const LeftNavbar = (props) =>
{
	const [leftMenu, updateMenu] = useState([]);
	
	const LeftMenu = () =>
	{
		fetch(`${ServiceDomain}getmenu`,
		{
			headers:{
				'Content-Type':'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID')
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
				updateMenu(result.body.result.menu);
			}
		})
		.catch(error =>
		{
			console.log(error);
		})
	}

	useEffect(() =>
	{
		LeftMenu();
	},[]);

	return (
		<>
			<div className="offcanvas offcanvas-start sidebar-nav bg-dark text-white" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
				<div className="offcanvas-body p-0">
					<nav className="navbar-dark">
						<ul className="navbar-nav my-2">
							{
								leftMenu.map((data, i) =>
								{
									return <PrepareMenu
												key={i}
												data={data}
											/>
								})
							}
						</ul>
					</nav>
				</div>
			</div>
		</>
	)
}

const PrepareMenu = (props) =>
{
	props = props.data;
	return(
		<>
			<li>
				<div className="text-muted small fw-bold text-uppercase px-3">
					{props.key}
				</div>
			</li>
			<li>
				{
					(props.sideNav.length < 1)
					?
						<Link to={`/dashboard${props.link}`} className="nav-link px-3 active mx-2">
							<span className="me-2">
								<i className={props.icon}></i>
							</span>
							<span>{props.text}</span>
						</Link>
					:
						<MultiLevelMenu
							data={props}
							key={10}
						/>
				}
			</li>
			<li className="my-3">
				<hr className="dropdown-divider" />
			</li>
		</>
	)
}

const MultiLevelMenu = (props) =>
{
	props = props.data;
	
	return (
		<>
			<a
				href="#nolink"
				className="nav-link px-3 sidebar-link mx-2"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target={`#${props.key}`}
				aria-expanded="false"
				aria-controls={props.key}
			>
				<span className="me-2">
					<i className={props.icon}></i>
				</span>
				<span>{props.text}</span>
				<span className="right-item ms-auto">
					<i className="bi bi-chevron-down"></i>
				</span>
			</a>
			<div className="collapse" id={props.key}>
				{
					props.sideNav.map((data, i) =>
					{
						return <ThreeLevelMenu key={i} data={data} />
					})
				}
			</div>
		</>
	)
}

const ThreeLevelMenu = (props) =>
{
	props = props.data;

	return (
		<>
			<ul className="navbar-nav ps-3">
				{
					(props.sideNav.length < 1)
					?
						<li>
							<Link className="nav-link px-4" to={`/dashboard${props.link}`}>
								<span className="me-2">
									<i className={props.icon}></i>
								</span>
								<span>{props.text}</span>
							</Link>
						</li>
					: <MultiLevelMenu data={props} />
				}
			</ul>
		</>
	)
}

export default TopNavbar;
export {LeftNavbar};