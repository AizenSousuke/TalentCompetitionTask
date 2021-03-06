﻿import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import LoggedInBanner from "../../Layout/Banner/LoggedInBanner.jsx";
import { LoggedInNavigation } from "../../Layout/LoggedInNavigation.jsx";
import { JobSummaryCard } from "./JobSummaryCard.jsx";
import { BodyWrapper, loaderData } from "../../Layout/BodyWrapper.jsx";
import {
	Pagination,
	Icon,
	Dropdown,
	Checkbox,
	Accordion,
	Form,
	Segment,
	Card,
	Button,
	Label,
	Container,
	Grid,
	ButtonGroup,
	Divider,
} from "semantic-ui-react";
import { TALENT_SERVICES_TALENT } from "../../HOSTNAME.js";
import { Select } from "../../Form/Select.jsx";
import moment from "moment";

export default class ManageJob extends React.Component {
	constructor(props) {
		super(props);
		let loader = loaderData;
		loader.allowedUsers.push("Employer");
		loader.allowedUsers.push("Recruiter");
		//console.log(loader)
		this.state = {
			loadJobs: [],
			loaderData: loader,
			activePage: 1,
			sortBy: {
				date: "desc",
			},
			filter: {
				showActive: true,
				showClosed: true,
				showDraft: true,
				showExpired: true,
				showUnexpired: true,
			},
			totalPages: 1,
			activeIndex: "",
		};
		this.loadData = this.loadData.bind(this);
		this.init = this.init.bind(this);
		this.loadNewData = this.loadNewData.bind(this);
		//your functions go here
		this.handleClose = this.handleClose.bind(this);
		this.closeJob = this.closeJob.bind(this);

		this.filters = [
			{
				key: 1,
				text: "Show Active",
				value: "showActive",
			},
			{
				key: 2,
				text: "Show Closed",
				value: "showClosed",
			},
			{
				key: 3,
				text: "Show Draft",
				value: "showDraft",
			},
			{
				key: 4,
				text: "Show Expired",
				value: "showExpired",
			},
			{
				key: 5,
				text: "Show Unexpired",
				value: "showUnexpired",
			},
		];

		this.sortBy = [
			{
				key: 1,
				text: "Newest first",
				value: "desc",
			},
			{
				key: 2,
				text: "Oldest first",
				value: "asc",
			},
		];
	}

	init() {
		console.log("Init\\Refresh page", this.state);
		let loaderData = TalentUtil.deepCopy(this.state.loaderData);
		loaderData.isLoading = true;

		//set loaderData.isLoading to false after getting data
		this.loadData((data) => {
			console.log("Data loaded: ", data);
			loaderData.isLoading = false;
			this.setState(
				{ loaderData: loaderData, loadJobs: data.myJobs },
				() => {
					// console.log("Loader Data: ", this.state.loaderData);
				}
			);
		});
	}

	componentDidMount() {
		this.init();
	}

	handleChange(event, value, callback = null) {
		// Change event for filters
		console.log(value);
		switch (value) {
			case "asc":
				this.setState({ sortBy: { date: "asc" } }, (data) => {
					callback(data);
				});
				break;
			case "desc":
				this.setState({ sortBy: { date: "desc" } }, (data) => {
					callback(data);
				});
				break;
			default:
				this.setState(
					{ filter: { [value]: true, [!value]: false } },
					(data) => {
						callback(data);
					}
				);
				break;
		}
	}

	loadData(callback = () => {}, params = null) {
		console.log("Calling loadData");
		var link = `${TALENT_SERVICES_TALENT}/listing/listing/getSortedEmployerJobs`;
		var cookies = Cookies.get("talentAuthToken");
		// your ajax call and other logic goes here
		var header = {
			Authorization: "Bearer " + cookies,
			"Content-Type": "application/json; charset=utf-8",
		};

		var obj = {
			showActive: this.state.filter.showActive,
			showClosed: this.state.filter.showClosed,
			showDraft: this.state.filter.showDraft,
			showExpired: this.state.filter.showExpired,
			showUnexpired: this.state.filter.showUnexpired,
			sortbyDate: this.state.sortBy.date,
		};
		console.log("Sorting with: ", obj);

		var url = new URL(link);
		// Append params to url
		Object.keys(obj).forEach((key) => {
			if (obj[key] != false) {
				url.searchParams.append(key, obj[key]);
			}
		});
		console.log("New URL with params: ", url);
		link = url;

		fetch(link, {
			method: "GET",
			headers: header,
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				console.log("GET RESPONSE: ", data);
				callback(data);
			});
	}

	loadNewData(data) {
		console.log("Loading new data", data);
		var loader = this.state.loaderData;
		loader.isLoading = true;
		data[loaderData] = loader;
		this.setState(data, () => {
			this.loadData(() => {
				loader.isLoading = false;
				this.setState({
					loadData: loader,
				});
			});
		});
	}

	handleClose(id) {
		this.closeJob(id, (data) => {
			console.log(data);
		});
	}

	closeJob(id, callback) {
		console.log("Calling closeJob");
		console.log(id);
		var link = `${TALENT_SERVICES_TALENT}/listing/listing/closeJob`;
		var cookies = Cookies.get("talentAuthToken");
		// your ajax call and other logic goes here
		var header = {
			Authorization: "Bearer " + cookies,
			"Content-Type": "application/json; charset=utf-8",
		};
		var body = id.toString();

		fetch(link, {
			method: "POST",
			headers: header,
			body: body,
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				console.log("GET RESPONSE: ", data);
				callback(data);
			});
	}

	handleOpen(job) {
		// this.openJob(job, (data) => {
		// 	console.log(data);
		// });
	}

	// openJob(job, callback) {
	// 	console.log("Calling openJob");
	// 	console.log(job);
	// 	var link = `${TALENT_SERVICES_TALENT}/listing/listing/createUpdateJob`;
	// 	var cookies = Cookies.get("talentAuthToken");
	// 	// your ajax call and other logic goes here
	// 	var header = {
	// 		Authorization: "Bearer " + cookies,
	// 		"Content-Type": "application/json; charset=utf-8",
	// 	};
	// 	var body = job;

	// 	fetch(link, {
	// 		method: "POST",
	// 		headers: header,
	// 		body: JSON.stringify(body),
	// 	})
	// 		.then((data) => {
	// 			return data.json();
	// 		})
	// 		.then((data) => {
	// 			console.log("GET RESPONSE: ", data);
	// 			callback(data);
	// 		});
	// }

	handleEdit(id) {
		console.log("Calling handleEdit: ", id);
		// Go to the page with href
		this.props.history.push("/EditJob/" + id);
	}

	checkExpiry(dateTime1, dateTimeCurrent = Date.now()) {
		// console.log(dateTime1);
		var currentDateTime = moment(dateTimeCurrent).toISOString();
		// console.log(currentDateTime);
		if (dateTime1 > currentDateTime) {
			// console.log("Not expired");
			return false;
		} else {
			// console.log("Expired");
			return true;
		}
	}

	render() {
		return (
			<BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
				<Container>
					<h1>List of Jobs</h1>
					<Icon name="filter" />
					Filter:{" "}
					<Dropdown
						placeholder="Choose filter"
						options={this.filters}
						onChange={(e, { value }) => {
							this.handleChange(e, value, () => {
								this.loadData((data) => {
									this.setState(
										{ loadJobs: data.myJobs },
										() => console.log("Set new sorting")
									);
								});
							});
						}}
					/>
					<Icon name="calendar" />
					Sort by date:{" "}
					<Dropdown
						placeholder="Newest first"
						options={this.sortBy}
						defaultValue={this.sortBy[0].value}
						onChange={(e, { value }) => {
							this.handleChange(e, value, () => {
								this.loadData((data) => {
									this.setState(
										{ loadJobs: data.myJobs },
										() => console.log("Set new sorting")
									);
								});
							});
						}}
					/>
					{/* <Divider /> */}
					<div style={{'marginTop': 20}}></div>
					<Card.Group itemsPerRow={2}>
						{this.state.loadJobs.length > 0 ? (
							this.state.loadJobs.map((jobs) => {
								return (
									<Card key={jobs.id}>
										<Card.Content>
											<Card.Header>
												{jobs.title}
											</Card.Header>
											<Label color="black" ribbon="right">
												<Icon name="user" />
												{jobs.noOfSuggestions}
											</Label>
											<Card.Meta>
												{jobs.location.country},{" "}
												{jobs.location.city}
											</Card.Meta>
											<Card.Description>
												{jobs.summary}
												<br></br>
											</Card.Description>
										</Card.Content>
										<Card.Content>
											{this.checkExpiry(jobs.expiryDate) == false ? (
												<Button.Group
													compact
													floated={"left"}
												>
													<Button color="green">
														Open
													</Button>
												</Button.Group>
											) : (
												<Button.Group
													compact
													floated={"left"}
												>
													<Button color="red">
														Expired
													</Button>
												</Button.Group>
											)}
											{jobs.status === 0 ? (
												<Button.Group
													compact
													floated={"right"}
												>
													<Button
														basic
														color="blue"
														onClick={(e) => {
															console.log(
																"Closing job",
																jobs
															);
															this.handleClose(
																jobs.id
															);
														}}
													>
														<Icon name="close" />
														Close
													</Button>
													<Button
														basic
														color="blue"
														onClick={(e) => {
															console.log(
																"Editing job: ",
																jobs.id
															);
															this.handleEdit(
																jobs.id
															);
														}}
													>
														<Icon name="edit" />
														Edit
													</Button>
													<Button basic color="blue">
														<Icon name="copy" />
														Copy
													</Button>
												</Button.Group>
											) : (
												<Button.Group
													compact
													floated={"right"}
												>
													<Button basic color="blue">
														<Icon name="envelope open outline" />
														Reopen
													</Button>
												</Button.Group>
											)}
										</Card.Content>
									</Card>
								);
							})
						) : (
							<Container>No Jobs Found</Container>
						)}
					</Card.Group>
					<Grid columns={"equal"}>
						<Grid.Row>
							<Grid.Column></Grid.Column>
							<Grid.Column>
								<Pagination
									defaultActivePage={1}
									totalPages={1}
								/>
							</Grid.Column>
							<Grid.Column></Grid.Column>
						</Grid.Row>
					</Grid>
					{/* <Divider /> */}
				</Container>
			</BodyWrapper>
		);
	}
}
