import { useHistory } from "react-router-dom";
import TopNavbar, { LeftNavbar } from './Navbar/NavbarTop';
import { useCallback, useEffect } from 'react';
import "../../assets/css/dashboard.css";
import {Route, Switch } from "react-router-dom";
import DashboardComponent from './Contents/DashboardComponents';
import ListStudents from "./Contents/Registration/ListStudents";
import AddStudents from "./Contents/Registration/AddStudents";
import AddForm from "./Contents/Registration/Settings/AddForm";
import ListSettings from "./Contents/Registration/Settings/ListSettings";
import ViewStudentDetails from "./Contents/Registration/ViewStudentsDetails";
import EditStudents from "./Contents/Registration/EditStudents";
import AddFeesStructure from "./Contents/Fees/AddFeesStructure";
import FeesStructure from "./Contents/Fees/FeesStructure";
import SubmitFee from "./Contents/Fees/SubmitFee";
import EditFeesStructure from "./Contents/Fees/EditFeesStructure";
import { ADMISSION_STD, FEES_STD_SET, ServiceDomain } from "../../Constants";
import UpdateToken from "../../UpdateToken";
import SubmittedFees from "./Contents/Fees/SubmittedFees";
import Settings from '../Settings/Settings';
import AddAttandance from "./Contents/Attandance/AddAttandance";
import ViewAttandance from "./Contents/Attandance/ViewAttandance";
import AttandanceReport from "./Contents/Attandance/AttandanceReport";
import CustomStandard from "./Contents/Registration/Settings/CustomStandard";
import AddStaff from "./Contents/Staff/AddStaff";
import StaffType from "./Contents/Staff/Settings/StaffType";
import StaffForm from "./Contents/Staff/Settings/StaffForm";

const Dashboard = (props) =>
{
	props = props.props;
	const history = useHistory();

	const ValidateLogin = useCallback(() =>
	{
		if (props.login === false)
		{
			history.push('/');
		}
	}, [history, props])

	const FetchStd = useCallback(() =>
	{
		if(props.admissionStd.length < 1 && props.feesStdSet.length < 1)
		{
			fetch(`${ServiceDomain}std`,
			{
				method:'GET',
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
			.then((response) =>
			{
				if(response.header.code === 200)
				{
					props.dispatch({type:ADMISSION_STD, payload:response.body.result.admission})
					props.dispatch({type:FEES_STD_SET, payload:response.body.result.fees})
				}
			})
		}
	},[props])
	
	useEffect(() => {
		ValidateLogin();
		FetchStd();
	}, [ValidateLogin, FetchStd]);

	return (
		<>
			<TopNavbar props={props}/>
			<LeftNavbar props={props} />
			<main className="mt-5 pt-3">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="card-c br-2 shadow-lg">
								<div className="card-body">
									<Switch>
										<Route path="/dashboard/home">
											<DashboardComponent  props={props}/>
										</Route>
										<Route path="/dashboard/list-students">
											<ListStudents props={props} />
										</Route>
										<Route path="/dashboard/add-students">
											<AddStudents props={props} />
										</Route>
										<Route path="/dashboard/forms">
											<ListSettings props={props} />
										</Route>
										<Route path="/dashboard/add-new-form">
											<AddForm props={props} />
										</Route>
										<Route path="/dashboard/view-student-details/:id">
											<ViewStudentDetails props={props} />
										</Route>
										<Route path="/dashboard/edit-student-details/:id" >
											<EditStudents props={props} />
										</Route>
										<Route path="/dashboard/add-fees-structure" >
											<AddFeesStructure props={props} />
										</Route>
										<Route path="/dashboard/fees-structure" >
											<FeesStructure props={props} />
										</Route>
										<Route path="/dashboard/submit-fees" >
											<SubmitFee props={props} />
										</Route>
										<Route path="/dashboard/edit-fees-structure/:id" >
											<EditFeesStructure props={props} />
										</Route>
										<Route path="/dashboard/submitted-fees" >
											<SubmittedFees props={props} />
										</Route>
										<Route path="/dashboard/settings" >
											<Settings props={props} />
										</Route>
										<Route path="/dashboard/add-attendance" >
											<AddAttandance props={props} />
										</Route>
										<Route path="/dashboard/view-attendance" >
											<ViewAttandance props={props} />
										</Route>
										<Route path="/dashboard/attandance-report" >
											<AttandanceReport props={props} />
										</Route>
										<Route path="/dashboard/new-std" >
											<CustomStandard props={props} />
										</Route>
										<Route path="/dashboard/add-staff" >
											<AddStaff props={props} />
										</Route>
										<Route path="/dashboard/staff-type" >
											<StaffType props={props} />
										</Route>
										<Route path="/dashboard/staff-form" >
											<StaffForm props={props} />
										</Route>
										<Route path="/" >
											<DashboardComponent props={props}/>
										</Route>
									</Switch>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}

export default Dashboard;