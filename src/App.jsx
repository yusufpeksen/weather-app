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

  // Find user's first location and set the weather
  useEffect(() => {
    axios.get('https://ipapi.co/json').then((response) => {
    setCity(response.data.city);
  });
  }, [])

  // Change the city for search
  useEffect(() => {
    if (city) {
      axios
        .get(
          `https://api.weatherapi.com/v1/forecast.json?key=6cf74598e9e0485d991182324231310&q=${city}&days=7`
        )
        .then((response) => {
          const data = response.data;
          const nextForecastDatas = data.forecast.forecastday.slice(1, 3);
          setImgWeather(data.current.condition.icon);
          setCountry(data.location.country);
          setDegree(data.current.feelslike_c);
          setForeCast(data.current.condition.text);
          setNextForeCasts(nextForecastDatas);
        })
        .catch((err) => {
          console.log("This city had not found.");
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
        .catch((error) => {
          console.error(error);
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
    <div className="max-[600px]:min-h-[1200px] rounded-[25px] flex items-center flex-col">
      <div className="flex mt-[50px]">
        <div className="flex flex-col">
          <div className="relative">
            <input
              ref={inputRef}
              placeholder="Search City"
              className="rounded-[20px] px-[15px] text-center h-[35px] w-[350px] text-white focus:outline-1 focus:outline-white bg-[#000000a5]"
              onChange={handleInputChange}
            />
            <AiOutlineSearch className="absolute top-[0.4rem] right-2 text-[22px] text-white transform rotate-90 placeholder:text-white" />
            <ul className="absolute top-[100%] left-0 w-[350px] bg-white block overflow-y-auto rounded-[10px] mt-2">
              {searchResults.map((location) => (
                <li
                  key={location.id}
                  onClick={() => handleResultClick(location)}
                  className="cursor-pointer text-[14px] border-b-[0.2px] border-gray-300 border-solid pl-[15px] py-[20px] px-[10px] w-full flex items-center h-[30px] hover:bg-blue-700 hover:text-white last:border-none"
                >
                  {location.name + " , " + location.country}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-[100px] font-bold p-[50px] text-white text-[20px] flex flex-col items-center text-center rounded-[10px] bg-[#000000a5]">
        Today
        <img className="pt-[10px]" src={imgWeather} />
        {foreCast && <h2 className="text-white text-[20px] font-bold">{foreCast}</h2>}
        {city && country && (
          <h2 className="text-white font-normal text-[20px]">
            {city.toUpperCase()} / {country}
          </h2>
        )}
        {degree && <h2 className="text-white text-[20px]">{degree} °C</h2>}

        <div className="flex gap-52 mt-[25px] max-[600px]:flex-col max-[600px]:gap-5">
        {nextForeCasts.map((forecast,i) => (
          <div key={i} className="flex flex-col items-center justify-center bg-[#e1e1e116] w-[200px] p-[20px] rounded-[10px]">
            <p className="text-white">{forecast.date}</p>
            <img className="" src={forecast.day.condition.icon}></img>
            <h3 className="text-white text-[20px] font-bold">
              {forecast.day.condition.text}
            </h3>
            <h3 className="text-white text-[20px]">
              AVG : {forecast.day.avgtemp_c} °C
            </h3>
          </div>
        ))}
      </div>

      </div>
    </div>
  );
}

export default App;
