import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import CountryInfo from './components/CountryInfo';

async function getAllCountries() {
    let names = [];
    await axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(res => {
            names = res.data.map(obj => obj.name.common);
        })
        .catch(err => {
            console.error(`unable to fetch country names. err:`, err);
        });
    console.log('inside:', names.length);
    return names;
}

function App() {

    /* STATE */
    const [countryInfo, setCountryInfo] = useState(null);
    const [value, setValue] = useState('');
    const [matches, setMatches] = useState([]);
    const [countryNames, setCountryNames] = useState([]);


    useEffect(() => {
        const fetchCountryNames = async () => {
            console.log('fetching all country names');
            let names = await getAllCountries();
            setCountryNames(names);
            console.log(`fetched ${names.length} countries from api`);
        }
        fetchCountryNames();
    }, []);


    const onInputChange = async (e) => {
        const value = e.target.value.toLowerCase();
        setValue(value);
        // console.log(`input changed: ${value}`);

        // ensure all countries
        if (countryNames.length == 0) {
            console.error('no country names fetched from api');
            return;
        }

        // filter countries
        let f = countryNames.filter(name => {
            return (name.toLowerCase().includes(value));
        })
        setMatches(f);
    }

    // useEffect(() => {
    //     if (matches.length == 1) {
    //     }

    // }, [matches]);

    /* JSX */
    return (
        <section>
            <div>
                find countries
                <input value={value} onChange={onInputChange}></input>
            </div>
            {matches.length > 10
                ? <div>more than 10</div>
                : matches.length > 1
                    ? matches.map((name, i) =>
                        <div key={i}>{name}</div>
                    )
                    : matches.length == 0
                        ? <div>no countries filtered</div>
                        : <CountryInfo name={matches[0]} />
            }
        </section>
    )
}

export default App;
