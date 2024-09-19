import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";

function App() {
  const inputRef = useRef("");
  const [city, setCity] = useState("");
  const [imgWeather, setImgWeather] = useState("");
  const [country, setCountry] = useState("");
  const [degree, setDegree] = useState("");
  const [foreCast, setForeCast] = useState("");
  const [nextForeCasts, setNextForeCasts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios.get("https://ipapi.co/json").then((response) => {
      setCity(response.data.city);
    });
  }, []);

  useEffect(() => {
    if (city) {
      axios
        .get(
          `https://api.weatherapi.com/v1/forecast.json?key=6cf74598e9e0485d991182324231310&q=${city}&days=7`
        )
        .then((response) => {
          const data = response.data;
          const nextForecastDatas = data.forecast.forecastday;
          setImgWeather(data.current.condition.icon);
          setCountry(data.location.country);
          setDegree(data.current.feelslike_c);
          setForeCast(data.current.condition.text);
          setNextForeCasts(nextForecastDatas);
        })
        .catch(() => {
          console.log("City not found.");
          setImgWeather(null);
          setCountry(null);
          setDegree(null);
          setForeCast(null);
        });
    }
  }, [city]);

  const handleInputChange = (e) => {
    const query = e.target.value;

    if (query.length >= 3) {
      axios
        .get(
          `https://api.weatherapi.com/v1/search.json?key=6cf74598e9e0485d991182324231310&q=${query}`
        )
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch(() => {
          setSearchResults([]);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (location) => {
    setCity(location.name);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 main-content">
      <div className="max-w-4xl min-w-[550px] w-full bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center space-y-6">
        {/* Arama Barı */}
        <div className="relative w-full">
          <input
            ref={inputRef}
            placeholder="Search City"
            className="rounded-2xl px-5 py-3 w-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleInputChange}
          />
          <AiOutlineSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500" />
          {/* Arama Sonuçları */}
          {searchResults.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 z-10">
              {searchResults.map((location) => (
                <li
                  key={location.id}
                  onClick={() => handleResultClick(location)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                >
                  {location.name}, {location.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bugünün Hava Durumu */}
        <div className="text-center">
          <img src={imgWeather} alt="Weather icon" className="mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-gray-800">
            {city.toUpperCase()}, {country}
          </h2>
          <h3 className="text-xl text-gray-600">{foreCast}</h3>
          <h3 className="text-4xl text-gray-800 font-bold">{degree} °C</h3>
        </div>

        {/* 3 Günlük Hava Durumu */}
        <div className="flex justify-center space-x-4 mt-6">
          {nextForeCasts.map((forecast, i) => (
            <div
              key={i}
              className="bg-blue-100 rounded-xl p-4 flex flex-col items-center shadow-md"
            >
              <p className="text-gray-700 font-semibold">{forecast.date}</p>
              <img
                src={forecast.day.condition.icon}
                alt="Forecast icon"
                className="w-16 h-16"
              />
              <p className="text-gray-600">{forecast.day.condition.text}</p>
              <p className="text-xl font-bold text-gray-800">
                {forecast.day.avgtemp_c} °C
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
