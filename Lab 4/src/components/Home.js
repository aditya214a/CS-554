import "../App.css";

function Home() {
  return (
    <div className="App">
      <h1>Home</h1>
      <h3>Welcome to a TicketMaster Website !!</h3>
      <p>
        {" "}
        Tap into the Ticketmaster open developer network which gives you the
        flexibility and scale to bring unforgettable live events to fans. It's
        our technology - your way around Events, Venues and Attractions.
      </p>

      <ul>
        <li>
          To get the most out of your experience, register for an API or log in
          to your account now. We'll render links in examples and code samples
          into active link using your own API Key. If you prefer to jump right
          into the APIs and make live calls, check out the Events, Venues and
          Attractions.
        </li>
        <li>
          We currently offer event discovery APIs with various access tiers.
          Upon registration and obtaining your API key, you will be able to
          access our Events, Venues and Attractions instantly. Using these APIs
          allows you to create a meaningful event discovery experience for your
          fans.
        </li>
        <li>
          Note: The International Events, Venues and Attractions is currently
          being consolidated with the Events, Venues and Attractions, therefore
          we recommend that developers plan to use this single service for
          access to global events.
        </li>

        <li>Event coverage is global.</li>
      </ul>
    </div>
  );
}

export default Home;
