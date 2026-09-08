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
            {languages.map((lng) =>
                <li key={lng}>{lng}</li>
            )}
            <img src={info.flags.png}></img>
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
    });

    return (
        <div>
            <InfoContainer info={info} />
        </div>
    )
}

export default CountryInfo;
