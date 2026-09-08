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

// CountryListItem
const CountryListItem = ({ name }) => {
    let [show, setShow] = useState(false);

    const toggleShow = () => {
        console.log('show:', show);
        setShow(!show);
    }

    return (
        <div>
            {name}
            <button onClick={toggleShow}>
                {show ? "hide" : "show"}
            </button>
            {show && <CountryInfo name={name} />}
        </div>
    )
}

// App
const App = () => {

    /* STATE */
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
                    ? matches.map((name) =>
                        <CountryListItem key={name} name={name} />
                    )
                    : matches.length == 0
                        ? <div>no countries filtered</div>
                        : <CountryInfo name={matches[0]} />
            }
        </section>
    )
}

export default App;
