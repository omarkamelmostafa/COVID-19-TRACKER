import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import './App.css';
import { InfoBox } from './InfoBox';
import { Table } from './Table';
import { LineGraph } from './LineGraph';
import { Map } from './Map';
import './../node_modules/leaflet/dist/leaflet.css';
import { sortData, prettyPrintStat } from './util';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    const apiURL = 'https://disease.sh/v3/covid-19/all';
    fetch(apiURL)
      .then(res => res.json())
      .then(data => setCountryInfo(data));
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      const apiURL = 'https://disease.sh/v3/covid-19/countries';
      await fetch(apiURL)
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const apiURL =
      countryCode === 'worldwide'
        ? (`https://disease.sh/v3/covid-19/all`)
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(apiURL)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === 'worldwide') setMapCenter([34.80746, -40.4796]);
        else setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(3);
      });
  };
  // console.log('countryInfo >>> ', countryInfo);
  return (
    <div className="App">
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 TRACKER</h1>

          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value='worldwide'>worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox isRed active={casesType === 'cases'} onClick={e => setCasesType('cases')} title='Corona Virus Cases' cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
          <InfoBox active={casesType === 'recovered'} onClick={e => setCasesType('recovered')} title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox isRed active={casesType === 'deaths'} onClick={e => setCasesType('deaths')} title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>

      {/* Header */}
      {/* Title + Select input dropdown field */}

      {/* InfoBoxs */}
      {/* InfoBoxs */}
      {/* InfoBoxs */}

      {/* Map */}

      {/* Tables */}
      {/* Graph */}

    </div>
  );
}

export default App;
