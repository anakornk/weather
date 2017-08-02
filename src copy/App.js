import React, { Component } from 'react';
import logo from './logo.svg';
import weather_blank from './img/weather_blank.png'
import './App.css';

var API_BASE = "https://api.apixu.com/v1/current.json";
var API_KEY = "6b524a27c03d442b98823802170208"


class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {searchValue: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e){
    this.setState({searchValue: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    this.get_weather_data(this.state.searchValue);
  }

  get_weather_data(city){
    var component = this;
    var url = API_BASE + "?key=" + API_KEY + "&q=" + city;
    fetch(url).then(function(response){
      response.json().then(function(jsonData){
        console.log(jsonData);
        component.props.callback(jsonData)
      });
    });
  }

  render() {
    return(
      <div className="searchbar">
        <form action="" onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.searchValue} onChange={this.handleChange} placeholder="Enter City Name" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

class Weather extends Component {
  render(){
    var weatherData = this.props.data;
    if(!weatherData) {
      return (
        <div className="weather">
          <img src={weather_blank} alt="Enter something" />
        </div>
      )
    }
    /*
      You should start by showing at least the city name, the current temperature, the current condition, such as “sunny” or “partly cloudy”.
    */
    var city = weatherData.location.name;
    var country = weatherData.location.country;
    var temp_c = weatherData.current.temp_c;
    var condition = weatherData.current.condition.text;
    var conditionIconUrl = "https://" + weatherData.current.condition.icon.slice(2)

    return (
      <div className="weather">
        <h2 className="city">{city}</h2>
        <div className="condition"><span>{condition}</span><img src={conditionIconUrl} alt={condition}/></div>
        <p className="temperature">{temp_c}</p>
      </div>
    );
  }
}


class App extends Component {
  constructor(props){
    super(props);
    this.state = {weatherData: null};
    this.setWeatherData = this.setWeatherData.bind(this);
  }

  setWeatherData(data){
    this.setState({weatherData: data});
  }

  render() {
    return (
      <div className="App">
        <SearchBar callback={this.setWeatherData} />
        <Weather data={this.state.weatherData} />
      </div>
    );
  }
}

export default App;
