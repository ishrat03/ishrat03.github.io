import Select from 'react-select'
const FormsTag = (props) =>
{
	const FileHandler = props.FileHandler;
	const updateData = props.updateData;
	const updateSelect = props.updateSelect;
	const addStudents = props.addStudents;
	const header = (props.header === undefined) ? 'New Student Registration' : props.header;
	const btnText = (props.btnText === undefined) ? 'Enroll Student' : props.btnText;
 
	props = props.data;

	const SwithForms = (data, i) =>
	{
		switch (data.type)
		{
			case 'text':
				return <CommonInputs
							key={i}
							props={data}
							type="text"
							updateData={updateData}
						/>
			case 'number':
				return <CommonInputs
							key={i}
							props={data}
							type="number"
							updateData={updateData}
						/>
			case 'email':
				return <CommonInputs
							props={data}
							type="email"
							key={i}
							updateData={updateData}
						/>
			case 'date':
				return <CommonInputs
							props={data}
							type="date"
							key={i}
							updateData={updateData}
						/>
			case 'select':
				return <Selects props={data} key={i} updateSelect={updateSelect}/>
			case 'textarea' :
				return <TextArea data={data} key={i} updateData={updateData} />
			case 'file' :
				return <File data={data} key={i} FileHandler={FileHandler}/>
			default:
				return ''
		}
	}
	return (
		<>
			<div className="row">
				<div className="col-md-4">

				</div>
				<div className="col-md-4">
					<div className="card card-body">
						<div className="text-center">
							<h2 style={{fontWeight:'lighter'}}>{header}</h2>
						</div>
						<hr />
						<form onSubmit={addStudents}>
							{
								props.map((data, i) =>
								{
									return SwithForms(data, i)
								})
							}
							<hr />
							<div className="row py-2">
								<div className="col-md-2"></div>
								<div className="col-md-8">
									<div className="d-grid gap-2">
										<button className="btn btn-lg btn-primary btn-sm" type="submit">{btnText}</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className="col-md-4">

				</div>
			</div>
		</>
	)
}

const CommonInputs = (props) =>
{
	const type = props.type;
	const updateData = props.updateData;
	props = props.props;

	return (
		<>
			<div className="form-group row py-2">
				<div className="col-4">
					<label htmlFor={props.name}><b>{props.label}</b></label>
				</div>
				<div className="col-8">
					<input
						type={type}
						className="form-control"
						placeholder={props.placeholder}
						disabled={props.disabled}
						required={props.required}
						name={props.name}
						onChange={updateData}
						defaultValue={props.value}
					/>
				</div>
			</div>
		</>
	)
}

const Selects = (props) =>
{
	const updateData = props.updateSelect;
	props = props.props;
	return (
		<>
			<div className="form-group row py-2">
				<div className="col-4">
					<label htmlFor={props.name}><b>{props.label}</b></label>
				</div>
				<div className="col-8">
					<Select
						disabled={props.disabled}
						required={props.required}
						name={props.name}
						options={props.option}
						onChange={(value) => {updateData(value, props.name)}}
						defaultValue={props.option.filter(option => option.value === props.value)}
					/>
				</div>
			</div>
		</>
	)
}

const File = (props) =>
{
	return (
		<>
			<div className="form-group row py-2">
				<div className="col-4">
					<label htmlFor={props.data.name}><b>{props.data.label}</b></label>
				</div>
				<div className="col-8">
					<input
						type="file"
						name={props.data.name}
						placeholder={props.data.placeholder}
						className="form-control"
						onChange={props.FileHandler}
					/>
				</div>
			</div>
		</>
	)
}

const TextArea = (props) =>
{
	return (
		<>
			<div className="form-group row py-2">
				<div className="col-4">
					<label htmlFor={props.data.name}><b>{props.data.label}</b></label>
				</div>
				<div className="col-8">
					<textarea name={props.data.name} className="form-control" onChange={props.updateData} defaultValue={props.data.value} ></textarea>
				</div>
			</div>
		</>
	)
}

export default FormsTag;