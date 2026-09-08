
const CountryInfo = ({ info }) => {

    // error return
    if (!info) {
        return (
            <div>
                info is none
            </div>
        )
    }

    console.log("CountryInfo:", info);

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

export default CountryInfo;
