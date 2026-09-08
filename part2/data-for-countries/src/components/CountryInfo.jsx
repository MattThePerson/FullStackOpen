import { useState, useEffect } from 'react';
import axios from 'axios';

/* Info Container */
const InfoContainer = ({ info }) => {

    // error return
    if (!info) {
        return (
            <div>
                info is none
            </div>
        )
    }

    const languages = Array.from(Object.values(info.languages));

    return (
        <div>
            <h2>{info.flag} {info.name.common}</h2>
            <div>capital {info.capital}</div>
            <div>area {info.area}</div>
            <h3>Languages</h3>
            <ul>
                {languages.map((lng) =>
                    <li key={lng}>{lng}</li>
                )}
            </ul>
            <img src={info.flags.png}></img>
        </div>
    )
}

/* Weather Container */
const WeatherContainer = ({ info }) => {

    const [weatherInfo, setWeatherInfo] = useState(null);

    const api_key = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

    // fetch after load
    useEffect(() => {
        if (!info) return;
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${info.capital[0]}&APPID=${api_key}`)
            .then(res => {
                console.log(res.data);
                setWeatherInfo(res.data);
            })
            .catch(err => {
                console.error("openweathermap not working, perchance api key is wrong?", err);
            })
    }, [info]);

    const getEl = () => {
        return (
            <div className="weather-container">
                <div>Temperature {Math.round((weatherInfo.main.temp - 273.15)*100)/100} Celsius</div>
                <img src={`https://openweathermap.org/payload/api/media/file/${weatherInfo.weather[0].icon}.png`}></img>
                <div>Wind {weatherInfo.wind.speed} m/s</div>
            </div>
        )
    }

    // JSX
    if (!info) return (<></>)
    return (
        <div>
            <h3>The Weather in {info.capital[0]}</h3>
            {weatherInfo ? getEl() : "waiting for openweathermap response ..."}
        </div>
    )
}

/* Country Info */
const CountryInfo = ({ name }) => {

    console.log('CountryInfo:', name);

    const [info, setInfo] = useState(null);

    useEffect(() => {
        axios
            .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
            .then(response => {
                console.log(response.data);
                setInfo(response.data);
            })
    }, []);

    return (
        <div>
            <InfoContainer info={info} />
            <WeatherContainer info={info} />
        </div>
    )
}

export default CountryInfo;
