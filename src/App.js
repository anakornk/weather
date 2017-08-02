import React, { Component } from 'react';
import weather_blank from './img/weather_blank.png';
import loading_gif from './img/loading.gif';
import 'animate.css';
import './App.css';
import config from './config.js';
import cities from 'cities-list';

var API_BASE = "https://api.apixu.com/v1/current.json";
var API_KEY = config.API_KEY; //REPLACE WITH YOUR API KEY

class FilterList extends Component {

  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    // console.log(e.target.value);
    this.props.callback(e.target.innerHTML);
  }

  render(){
    if(!this.props.show || this.props.filterString === "") return null;

    var filterString = this.props.filterString
    //console.log(filterString);

    var filtered = Object.keys(cities).filter(function(city){
      return city.match(RegExp("^"+filterString,"i"));
    }).slice(0,5);

    var component = this;
    var list = filtered.map(function(city){
      return <li onClick={component.handleClick} key={city}>{city}</li>
    })
    return (
      <div className="filter-list-wrapper">
        <ul className="filter-list">
          {list}
        </ul>
      </div>
    );

  }
}


class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {searchValue: "", showFilterList: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.setSearchValue = this.setSearchValue.bind(this);
    this.filterSearch = this.filterSearch.bind(this);

  }

  handleChange(e){
    this.setSearchValue(e.target.value);
  }

  handleSubmit(e){
    e.preventDefault();
    this.get_weather_data(this.state.searchValue);
    this.setSearchValue("");
    this.inputElement.blur();
  }

  handleFocus(e){
    this.setState({showFilterList:true})
  }

  handleBlur(e){
    var component = this;
    setTimeout(function(){
      component.setState({showFilterList:false})
    },200);
  }

  setSearchValue(value){
    this.setState({searchValue: value});
  }

  filterSearch(value){
    this.setSearchValue(value);
    this.get_weather_data(this.state.searchValue);
    this.setSearchValue("");
  }


  get_weather_data(city){
    var component = this;
    var url = API_BASE + "?key=" + API_KEY + "&q=" + city;
    component.props.callback({loading: true});
    fetch(url).then(function(response){
      response.json().then(function(jsonData){
        // console.log(jsonData);
        component.props.callback(jsonData)
      });
    });
  }

  render() {
    return(
      <div className="searchbar">
        <form action="" onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.searchValue} onChange={this.handleChange} placeholder="Enter City Name" onFocus={this.handleFocus} onBlur={this.handleBlur} ref={e => this.inputElement = e}/>
          <FilterList show={this.state.showFilterList} filterString={this.state.searchValue} callback={this.filterSearch} />
        </form>
      </div>
    );
  }
}

class Weather extends Component {
  render(){
    var weatherData = this.props.data;
    if(typeof(weatherData.error) !== "undefined") {
      return (
        <div className="weather shake">
          <img src={weather_blank} alt="Enter something" width="50%"/>
        </div>
      )
    }else if(weatherData.loading){
      return (
        <div className="weather">
          <img src={loading_gif} alt="Enter something" width="50%"/>
        </div>
      );
    }


    var city = weatherData.location.name;
    // var country = weatherData.location.country;
    var temp_c = weatherData.current.temp_c;
    var condition = weatherData.current.condition.text;
    var conditionIconUrl = "https://" + weatherData.current.condition.icon.slice(2);
    var backgroundImageStr = "linear-gradient(-225deg, rgba(0,101,168,0.6) 0%, rgba(0,36,61,0.6) 50%), url('https://kitt.lewagon.com/placeholder/cities/" + city.toLowerCase() +  "')";
    var style = {backgroundImage: backgroundImageStr};
    return (
      <div className="weather" style={style}>
        <h2 className="city">{city}</h2>
        <div className="condition"><span>{condition}</span><img src={conditionIconUrl} alt={condition}/></div>
        <p className="temperature">{temp_c}&#176; c</p>
      </div>
    );
  }
}


class App extends Component {
  constructor(props){
    super(props);
    this.state = {weatherData: {error: "Please search"}};
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
