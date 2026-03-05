import { useEffect, useMemo, useState } from 'react'

const WEATHER_ICONS = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  77: '❄️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  85: '❄️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
}

const BG_THEMES = {
  cool: 'weather-theme-cool',
  mild: 'weather-theme-mild',
  warm: 'weather-theme-warm',
}

function getLastLine(text) {
  const lines = text.split('\n')
  return lines[lines.length - 1] || ''
}

function replaceLastLine(text, replacement) {
  const lines = text.split('\n')
  lines[lines.length - 1] = replacement
  return lines.join('\n')
}

export default function Weather() {
  const [cityInput, setCityInput] = useState('')
  const [status, setStatus] = useState('')
  const [weatherList, setWeatherList] = useState([])
  const [unit, setUnit] = useState('c')
  const [suggestions, setSuggestions] = useState([])
  const [coordsList, setCoordsList] = useState([])
  const [mode, setMode] = useState('single')

  const formatDay = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  }

  useEffect(() => {
    const locale = navigator.language || ''
    const region = locale.split('-')[1]
    const fahrenheitRegions = ['US', 'BS', 'BZ', 'KY', 'PW', 'MH', 'FM', 'LR']
    if (region && fahrenheitRegions.includes(region)) {
      setUnit('f')
    }
  }, [])

  useEffect(() => {
    const currentQuery = mode === 'multi' ? getLastLine(cityInput).trim() : cityInput.trim()
    if (!currentQuery) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            currentQuery
          )}&count=5`
        )
        const data = await res.json()
        if (!data.results) {
          setSuggestions([])
          return
        }
        setSuggestions(
          data.results.map((item) => ({
            label: `${item.name}, ${item.admin1 ? `${item.admin1}, ` : ''}${item.country}`,
            lat: item.latitude,
            lon: item.longitude,
            admin1: item.admin1,
            country: item.country,
            name: item.name,
          }))
        )
      } catch {
        setSuggestions([])
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [cityInput])

  const fetchWeatherByCoords = async ({ lat, lon, label = 'Your location' }) => {
    setStatus('Loading...')
    setWeatherList([])

    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&latitude=${lat}&longitude=${lon}`
      )
      const data = await weatherRes.json()

      const results = [
        {
          name: label,
          temperature: data.current.temperature_2m,
          feelsLike: data.current.apparent_temperature,
          wind: data.current.wind_speed_10m,
          code: data.current.weather_code,
          daily: data.daily,
          coords: { lat, lon },
        },
      ]

      setWeatherList(results)
      setCoordsList([{ lat, lon, name: label }])
      setStatus('')
    } catch (error) {
      setStatus('Something went wrong. Try again.')
    }
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported in this browser.')
      return
    }

    setStatus('Requesting location...')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        await fetchWeatherByCoords({ lat: latitude, lon: longitude })
      },
      () => {
        setStatus('Location access denied. Enter a city instead.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const fetchWeather = async (event) => {
    event.preventDefault()
    const rawLines = mode === 'multi' ? cityInput.split('\n').map((line) => line.trim()) : [cityInput.trim()]
    const cities = rawLines.filter(Boolean)
    if (!cities.length) return

    setStatus('Loading...')
    setWeatherList([])

    try {
      const results = []
      const coords = []

      for (const city of cities) {
        const primaryQuery = city.includes(',') ? city.split(',')[0].trim() : city
        let geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            primaryQuery
          )}&count=1`
        )
        let geo = await geoRes.json()

        if (!geo.results || !geo.results.length) {
          geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              city
            )}&count=1`
          )
          geo = await geoRes.json()
        }

        if (!geo.results || !geo.results.length) {
          continue
        }
        const { latitude, longitude, name, country, admin1 } = geo.results[0]
        coords.push({ lat: latitude, lon: longitude, name })

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&latitude=${latitude}&longitude=${longitude}`
        )
        const data = await weatherRes.json()

        results.push({
          name: `${name}, ${admin1 ? `${admin1}, ` : ''}${country}`,
          temperature: data.current.temperature_2m,
          feelsLike: data.current.apparent_temperature,
          wind: data.current.wind_speed_10m,
          code: data.current.weather_code,
          daily: data.daily,
          coords: { lat: latitude, lon: longitude },
        })
      }

      if (!results.length) {
        setStatus('City not found. Try again.')
        return
      }

      setWeatherList(results)
      setCoordsList(coords)
      setStatus('')
    } catch (error) {
      setStatus('Something went wrong. Try again.')
    }
  }

  const mapLocation = coordsList[0]
  const mapUrl = mapLocation
    ? `https://www.rainviewer.com/map.html?loc=${mapLocation.lat},${mapLocation.lon},8&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=0&oAR=0&oAS=1&oMW=0&lang=en&osm=1`
    : null

  const formatTemp = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '--'
    if (unit === 'c') return `${Math.round(value)}°C`
    return `${Math.round(value * 1.8 + 32)}°F`
  }

  const primaryWeather = weatherList[0]

  const themeClass = useMemo(() => {
    if (!primaryWeather) return BG_THEMES.mild
    const temp = primaryWeather.temperature
    if (temp >= 26) return BG_THEMES.warm
    if (temp <= 10) return BG_THEMES.cool
    return BG_THEMES.mild
  }, [primaryWeather])


  return (
    <section className="section weather-shell">
      <div className={`weather-page ${themeClass}`}>
        <h2>Weather</h2>
        <p>Search for multiple cities (one per line) to see current conditions and forecast.</p>

        <form className="weather-form" onSubmit={fetchWeather}>
          <div className="weather-input">
            {mode === 'multi' ? (
              <textarea
                className="input weather-textarea"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
                placeholder="Enter cities, one per line"
                rows={3}
              />
            ) : (
              <input
                className="input"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
                placeholder="Enter a city"
              />
            )}
            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="suggestion"
                    onClick={() => {
                      setCityInput((prev) =>
                        mode === 'multi' ? replaceLastLine(prev, item.label) : item.label
                      )
                      setSuggestions([])
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="button" type="submit">
            Get Weather
          </button>
          <button className="button ghost" type="button" onClick={handleUseLocation}>
            Use my location
          </button>
          <button
            className="button ghost"
            type="button"
            onClick={() => setUnit((prev) => (prev === 'c' ? 'f' : 'c'))}
          >
            °{unit === 'c' ? 'F' : 'C'}
          </button>
          <button
            className={`button ghost ${mode === 'multi' ? 'active' : ''}`}
            type="button"
            onClick={() => {
              setMode((prev) => (prev === 'multi' ? 'single' : 'multi'))
              setCityInput('')
              setSuggestions([])
              setWeatherList([])
              setStatus('')
            }}
          >
            {mode === 'multi' ? 'Multiple: On' : 'Multiple: Off'}
          </button>
        </form>

        {status && <p className="status">{status}</p>}

        {weatherList.length > 0 && (
          <div className="weather-grid">
            {weatherList.map((weather) => (
              <div key={weather.name} className="weather-card weather-main weather-spotlight">
                <div className="weather-icon">
                  {WEATHER_ICONS[weather.code] || '🌦️'}
                </div>
                <h3>{weather.name}</h3>
                <p className="weather-temp">{formatTemp(weather.temperature)}</p>
                <p className="muted">Feels like {formatTemp(weather.feelsLike)}</p>
                <p className="muted">Wind: {weather.wind} km/h</p>

                {weather.daily?.time && (
                  <div className="forecast-list">
                    {weather.daily.time.slice(0, 5).map((day, index) => (
                      <div className="forecast-row" key={day}>
                        <span>{formatDay(day)}</span>
                        <span className="forecast-icon">
                          {WEATHER_ICONS[weather.daily.weather_code?.[index]] || '🌦️'}
                        </span>
                        <span>
                          {formatTemp(weather.daily.temperature_2m_max?.[index])} /{' '}
                          {formatTemp(weather.daily.temperature_2m_min?.[index])}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {mapUrl && (
              <div className="weather-card map-card">
                <h3>Radar map</h3>
                <iframe
                  className="weather-map"
                  title="RainViewer radar"
                  src={mapUrl}
                  loading="lazy"
                />
                <p className="muted">Powered by RainViewer</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
