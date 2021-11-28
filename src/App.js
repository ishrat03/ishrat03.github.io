import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import Login from './Components/Main/Login';
import Dashboard from './Components/Dashboard/Dashboard';

function App(props)
{
	return (
		<BrowserRouter >
			<Switch>
				<Route path="/dashboard" >
					<Dashboard props={props}/>
				</Route>
				<Route path="/">
					<Login props={props}/>
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

const mapStateToProps = state => 
{
  return state;
}

export default connect(mapStateToProps)(App);