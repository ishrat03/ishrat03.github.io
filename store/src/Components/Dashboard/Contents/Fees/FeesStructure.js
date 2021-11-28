import { useToasts } from "react-toast-notifications";
import Select from 'react-select'
import { useCallback, useEffect, useState } from "react";
import { FEES_STD, ServiceDomain, UPDATE_CURRENCY } from "../../../../Constants";
import UpdateToken from "../../../../UpdateToken";
import { Loading } from "../../../../CommonFunctions";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const FeesStructure = (props) =>
{
	const { addToast } = useToasts();
	const [fees, updateFees] = useState({body:[], header:[]});
	const [loading, updateLoading] = useState(false);
	const [selectedOption, updateSelected] = useState('');
	
	const FetchFees =useCallback((value, searchname = '') =>
	{
		updateLoading(true);
		props.props.dispatch({type:FEES_STD, payload:value.value});
		let std = value.value;
		updateSelected(std)
		let url = `${ServiceDomain}feesstructure?std=${std}`;
		
		if(searchname !== '')
		{
			url = url + '&name=' + searchname;
		}
		
		fetch(url,
		{
			headers:{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('Session-ID')
			}
		})
		.then((resp) =>
		{
			UpdateToken(resp.headers, resp.status)
			return resp.json();
		})
		.then((result) =>
		{
			updateLoading(false);
			if(result.header.code === 200)
			{
				updateFees(result.body.result);
				if(result.body.result.currency !== undefined)
				{
					props.props.dispatch({type:UPDATE_CURRENCY, payload:result.body.result.currency});
				}
			}
		})
		.catch((error) =>
		{
			updateLoading(false);
			addToast(error.message, {appearance:'error', autoDismiss:true})
		});
	},[addToast, props])
	
	const DeleteFees = (id) =>
	{
		Swal.fire(
			{
				title: 'Are you sure?',
				text: "You won't be able to recover",
				icon:'info',
				showCancelButton: true,
				confirmButtonText: `Yes Delete it`,
				showLoaderOnConfirm:true,
				preConfirm: () =>
				{
					return fetch(`${ServiceDomain}deletefees/${id}`,{method:'delete', headers:{'Content-Type':'application/json', 'Authorization':'Bearer ' + localStorage.getItem('Session-ID')}})
							.then(response =>
								{
									if (!response.ok)
									{
										throw new Error(response.statusText)
									}
									UpdateToken(response.headers, response.status);

									return response.json()
								})
							.catch(error =>
							{
								Swal.showValidationMessage(
									`Request failed: ${error}`
								)
							})
						},
						allowOutsideClick: () => !Swal.isLoading()
			})
			.then((result) =>
			{
				if (result.isConfirmed)
				{
					addToast(result.value.header.msg, {appearance:result.value.header.status, autoDismiss:true});

					FetchFees({value:selectedOption});
				}
			}
		)
	}

	const SearchByName = (e) =>
	{
		if(e.target.value !== '')
		{
			FetchFees({value:props.props.feesStd}, e.target.value)
		}
	}

	useEffect(() =>
	{
		if(props.props.feesStd !== '')
		{
			FetchFees({value:props.props.feesStd});
		}
	}, [props, FetchFees])
	return (
		<>
			<div className="card card-body">
				<div className="row">
					<div className="col-md-4 py-2">
						<div className="form-group row">
							<div className="col-md-3">
								<label><b>Standard</b></label>
							</div>
							<div className="col-md-9">
								<Select
									options={props.props.feesStdSet}
									onChange={(value) => {FetchFees(value)}}
									id="std"
									defaultValue={props.props.feesStdSet.filter(option => option.value === props.props.feesStd)}
								/>
							</div>
						</div>
					</div>
					<div className="col-md-4 py-2">
						<div className="form-group row">
							<div className="col-md-4">
								<b>Search By Name</b>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" placeholder="Enter Name here" name="searchByName" onChange={SearchByName}/>
							</div>
						</div>
					</div>
					<div className="col-md-4 py-2">

					</div>
				</div>
			</div>
			<hr />
			<div className="card card-body">
				{
					(loading)
					?
						<Loading />
					:
						(fees.body.length > 0)
						?
							<Table
								header={fees.header}
								body={fees.body}
								currency={props.props.currency}
								DeleteFees={DeleteFees}
							/>
						:
							<div className="text-center">
								<h3 className="lighter-font">No Data Found</h3>
							</div>
				}
			</div>
		</>
	)
}

const Table = (props) =>
{
	return (
		<>
			<div className="table-response">
				<table className="table table-sm border-primary table-bordered table-striped table-hover">
					<thead>
						<tr>
						{
							props.header.map((data , i) =>
							{
								return (data !== 'Id') ? <th className="text-center align-middle" key={i}>
									{data}
								</th>
								:
									null
							})
						}
							<th className="text-center">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{
							props.body.map((data , i) =>
							{
								return <tr key={i}>
									{
										Object.keys(data).map((resp, i) =>
										{
											return (resp !== 'id') ? <td className="text-center align-middle" key={i}>
												{(resp === 'amount') ? <><b>&#8377;</b></> : null} {data[resp]} 
											</td>
											: null
										})
									}
									<td className="text-center align-middle">
										<div className="btn-group btn-sm" role="group" aria-label="Basic example">
											<Link 
												to={`/dashboard/edit-fees-structure/${data.id}`}
												className="btn btn-warning btn-sm"
											><i className="bi bi-pencil-square"></i>
											</Link>
											<button type="button" className="btn btn-danger btn-sm" onClick={() => {props.DeleteFees(data.id)}}><i className="bi bi-trash-fill"></i></button>
										</div>
									</td>
								</tr>
							})
						}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default FeesStructure;