import axios from "axios"
import { useRef, useState } from "react"

function App() {

  const inputRef = useRef("")

  const [city , setCity] = useState("")
  const [imgWeather , setImgWeather] = useState("")
  const [country , setCountry] = useState("")
  const [degree , setDegree] = useState("")
  const [foreCast , setForeCast] = useState("")
  

  axios.get(`http://api.weatherapi.com/v1/forecast.json?key=6cf74598e9e0485d991182324231310&q=${city}&days=7`)
    .then(response => {
      //console.log(response.data.forecast.forecastday[0])
      setImgWeather(response.data.current.condition.icon)
      setCountry(response.data.location.country)
      setDegree(response.data.current.feelslike_c)
      setForeCast(response.data.current.condition.text)
    }).catch(err => {
      console.log("Does not exist this city.")
      setImgWeather(null)
      setCountry(null)
      setDegree(null)
      setForeCast(null)
    })


  return (
    <div className="bg-[#542274] w-[650px] h-[500px] rounded-[25px] flex items-center flex-col">
      <div>
        <input ref={inputRef} placeholder="Search City" className="mt-[50px] rounded-[10px] outline-none px-[15px] h-[30px] w-[250px]"></input>
        <button onClick={() => setCity(inputRef.current.value)} className="bg-[#9639d9] rounded-[10px] px-[10px] py-[4px] ml-[8px] text-white text-center transition-colors duration-300 hover:bg-[#b570e7]">Search</button>
      </div>
      <div className="mt-[50px] flex flex-col items-center">
        <img className="h-[150px]" src={imgWeather}></img>
        {foreCast && <h2 className="text-white text-[30px]">{foreCast}</h2>}
        {city && country && <h2 className="text-white text-[30px]">{city.toUpperCase() + " / " + country}</h2>}
        {degree && <h2 className="text-white text-[30px]">{degree} °C</h2>}
      </div>
    </div>
  )
}

export default App
