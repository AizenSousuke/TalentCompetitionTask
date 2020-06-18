import React from "react";
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
				showClosed: false,
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

		this.filters = [
			{
				key: 1,
				text: "Show Active",
				value: this.state.filter.showActive,
			},
			{
				key: 2,
				text: "Show Closed",
				value: this.state.filter.showClosed,
			},
			{
				key: 3,
				text: "Show Draft",
				value: this.state.filter.showDraft,
			},
			{
				key: 4,
				text: "Show Expired",
				value: this.state.filter.showExpired,
			},
			{
				key: 5,
				text: "Show Unexpired",
				value: this.state.filter.showUnexpired,
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

		console.log(this.filters);
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

	loadData(callback) {
		console.log("Calling loadData");
		var link =
			"http://localhost:51689/listing/listing/getSortedEmployerJobs";
		var cookies = Cookies.get("talentAuthToken");
		// your ajax call and other logic goes here
		var header = {
			Authorization: "Bearer " + cookies,
			"Content-Type": "application/json; charset=utf-8",
		};

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

	render() {
		return (
			<BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
				<Container>
					<h1>List of Jobs</h1>
					<Icon name="filter" />
					Filter:{" "}
					<Dropdown
						placeholder="Choose filter"
						multiple
						options={this.filters}
					/>
					<Icon name="calendar" />
					Sort by date:{" "}
					<Dropdown
						options={this.sortBy}
						defaultValue={this.state.sortBy.date}
					/>
					<Divider />
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
											{jobs.status === 0 ? (
												<Button.Group
													compact
													floated={"left"}
												>
													<Button color="green">
														{jobs.expiryDate}
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
											<Button.Group
												compact
												floated={"right"}
											>
												<Button basic color="blue">
													<Icon name="close" />
													Close
												</Button>
												<Button basic color="blue">
													<Icon name="edit" />
													Edit
												</Button>
												<Button basic color="blue">
													<Icon name="copy" />
													Copy
												</Button>
											</Button.Group>
										</Card.Content>
									</Card>
								);
							})
						) : (
							<div>No Jobs Found</div>
						)}
					</Card.Group>
					<Divider />
				</Container>
			</BodyWrapper>
		);
	}
}
