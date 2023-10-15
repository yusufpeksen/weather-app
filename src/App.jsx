import axios from "axios";
import React, { useRef, useState, useEffect } from "react";

function App() {
  const inputRef = useRef("");
  const [city, setCity] = useState("");
  const [imgWeather, setImgWeather] = useState("");
  const [country, setCountry] = useState("");
  const [degree, setDegree] = useState("");
  const [foreCast, setForeCast] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (city) {
      axios
        .get(
          `http://api.weatherapi.com/v1/forecast.json?key=6cf74598e9e0485d991182324231310&q=${city}&days=7`
        )
        .then((response) => {
          const data = response.data;
          setImgWeather(data.current.condition.icon);
          setCountry(data.location.country);
          setDegree(data.current.feelslike_c);
          setForeCast(data.current.condition.text);
        })
        .catch((err) => {
          console.log("Belirtilen şehir bulunamadı.");
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
          console.log(response.data)
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
    <div className="bg-[#542274] w-[650px] h-[600px] rounded-[25px] flex items-center flex-col">
      <div className="flex mt-[50px]">
        <div className="flex flex-col">
        <input
          ref={inputRef}
          placeholder="Şehir Ara"
          className="rounded-[10px] outline-none px-[15px] h-[30px] w-[250px]"
          onChange={handleInputChange}
        />
        <ul className="block h-[100px] overflow-y-auto">
          {searchResults.map((location) => (
            <li
              key={location.id}
              onClick={() => handleResultClick(location)}
              className="cursor-pointer text-white bg-purple-500 my-[3px] rounded-[10px] px-[8px]"
            >
              {location.name}
            </li>
          ))}
        </ul>
        </div>
        <button
          onClick={() => setCity(inputRef.current.value)}
          className="bg-[#9639d9] h-[30px] rounded-[10px] px-[10px] py-[4px] ml-[8px] text-white text-center transition-colors duration-300 hover:bg-[#b570e7]"
        >
          Ara
        </button>
      </div>
      <div className="mt-[50px] flex flex-col items-center">
        <img className="h-[150px]" src={imgWeather} />
        {foreCast && <h2 className="text-white text-[30px]">{foreCast}</h2>}
        {city && country && (
          <h2 className="text-white text-[30px]">
            {city.toUpperCase()} / {country}
          </h2>
        )}
        {degree && <h2 className="text-white text-[30px]">{degree} °C</h2>}
      </div>
    </div>
  );
}

export default App;
