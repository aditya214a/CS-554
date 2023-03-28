import React, { Component } from "react";
import { Link } from "react-router-dom";
import noImage from "../img/download.jpeg";
import { axiosLists } from "../AxiosLinks";
class EventsList extends Component {
  constructor(props) {
    super(props);
    this.state = { eventsData: undefined };
  }
  async getEvents() {
    try {
      const data = await axiosLists(`events`, 5); //@@@@@@@@@@@@@@@@@@@
      console.log(data);
      this.setState({ eventsData: data._embedded.events });
    } catch (e) {
      console.log(e);
    }
  }
  componentDidMount() {
    this.getEvents();
  }
  render() {
    return (
      <div className="App-body">
        <ul>
          {this.state.eventsData &&
            this.state.eventsData.map((event) => (
              <li key={event.id}>
                <Link to={`/events/${event.id}`}>{event.name}</Link>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
export default EventsList;
