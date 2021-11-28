import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { ServiceDomain } from "../../../Constants";
import UpdateToken from "../../../UpdateToken";
import CanvasJSReact from '../../../assets/js/canvasjs.react';

const DashboardComponent = (props) =>
{
	const {addToast} = useToasts();
	const [data, updateData] = useState([]);
	const [loader, updateLoader] = useState(true)
	const [option, updateOption] = useState({})

	useEffect(() =>
	{
		fetch(`${ServiceDomain}dashboard`,
		{
			headers:{
				'Content-Type': 'application/json',
				'Authorization' : 'Bearer '+ localStorage.getItem('Session-ID')
			},
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
				updateData(result.body.result)

				let keys = Object.keys(result.body.result.classWisePayment)

				let options = {
					animationEnabled: true,
					exportEnabled: true,
					theme: "light2", //"light1", "dark1", "dark2"
					title:{
						text: "Standard Wise Fee Payment"
					},
					axisY: {
						includeZero: true
					},
					data: [{
						type: "column", //change type to bar, line, area, pie, etc
						// indexLabel: "{y}", //Shows y value on all Data Points
						indexLabelFontColor: "#5A5757",
						indexLabelPlacement: "outside",
						dataPoints: []
					}]
				}
				keys.forEach((resp, i) =>
				{
					options.data[0].dataPoints[i] = {
						label:resp,
						y:result.body.result.classWisePayment[resp]
					}
				})
				
				updateOption(options)
			}

			updateLoader(false)
		})
		.catch((error) =>
		{
			updateLoader(false)
			addToast(error.message, {appearance:'error', autoDismiss:true})
		})
	}, [addToast]);
	return (
		<>
			{
				(loader === false)
				? <DashboardBox
					data={data}
					options={option}
				/>
				: <div className="text-center">
					<h2 className="lighter-font">Loading....</h2>
				</div>
			}
		</>
	)
}

const DashboardBox = (props) =>
{
	return (
		<>
			<div className="row">
				<TopBox
					icon='bi bi-people-fill'
					title='Total Students'
					value={props.data.totalStudents}
					currency={false}
				/>

				<TopBox
					icon='bi bi-cash-stack'
					title='Yearly Total Fee'
					value={props.data.totalFees}
					currency={true}
				/>

				<TopBox
					icon='bi bi-cash-stack'
					title='Total Submitted Fee'
					value={props.data.totalSubmitted}
					currency={true}
				/>

				<TopBox
					icon='bi bi-cash-stack'
					title='Total Pending Fee'
					value={props.data.pending}
					currency={true}
				/>

			</div>
			
			<div className="row my-2">
				<div className="col-md-12">
					<div className="card-c br-1 shadow-lg card-body border-primary">
						<CanvasJSReact.CanvasJSChart 
							options = {props.options} 
						/>
					</div>
				</div>
			</div>
		</>
	)
}

const TopBox = (props) =>
{
	return (
		<>
			<div className="col-md-3">
				<div className="card-c br-1 shadow-lg card-body border-primary bg-primary text-white">
					<h4 className="text-center lighter-font">
						<i className={props.icon}></i> {props.title}
					</h4>
					<h5 className="text-center">
						{
							(props.currency)
							? <> &#8377; </> : null
						}
						{props.value}
					</h5>
				</div>
			</div>
		</>
	)
}

export default DashboardComponent;