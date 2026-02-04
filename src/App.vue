<template>
  <div class="wrapper" @click="menuClose">
    <div v-if="dataIsReady && !noGeo" class="container">
      <WeatherMain
          :city="city"
          :menu-is-open="menuIsOpen"
          :current-temp="currentTemp ?? 0"
          :current-max="currentMax ?? 0"
          :current-min="currentMin ?? 0"
          :current-description="currentDescription"
          :current-humidity="currentHumidity ?? 0"
          :current-feels="currentFeels ?? 0"
          :current-pressure="currentPressure ?? 0"
          :current-wind-speed="currentWindSpeed ?? 0"
          :current-wind-degrees="currentWindDegrees ?? 0"
          :current-sunrise="currentSunrise ?? 0"
          :current-sunset="currentSunset ?? 0"
          :hourly-forcasts="hourlyForcasts"
          :daily-forcasts="dailyForcasts"
          :icon-src="iconSrc"
          :lang="lang"
          @update-weather="updateWeather"
          @select-other-city="handleSelectOtherCity"
          @menu-toggle="menuToggle"
      />
    </div>

    <div v-else-if="!dataIsReady && !noGeo" class="preloader">
      <div class="preloader__gif">
        <img src="../src/assets/icons/preloader.svg" alt="" />
      </div>
      <div class="preloader__text">ЗАГРУЗКА ДАННЫХ</div>
    </div>

    <CitySearch
        v-if="!dataIsReady && noGeo"
        @setCity="getWeather"
    />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import CitySearch from '@/components/CitySearch.vue'
import WeatherMain from '@/components/WeatherMain.vue'
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  ForecastItem,
  ReverseGeoItem,
  DailyForecast,
} from '@/types/openweather'

const dataIsReady = ref(false)
const noGeo = ref(false)
const geoIsOff = ref(false)
const menuIsOpen = ref(false)

const cityId = ref<number | null>(null)
const lat = ref<number | null>(null)
const lon = ref<number | null>(null)
const city = ref('')
const lang = ref('')

const apiKey = process.env.VUE_APP_WEATHER_API_KEY || null

const currentTemp = ref<number | null>(null)
const currentFeels = ref<number | null>(null)
const currentMax = ref<number | null>(null)
const currentMin = ref<number | null>(null)
const currentDescription = ref('')
const currentHumidity = ref<number | null>(null)
const currentPressure = ref<number | null>(null)
const currentWindSpeed = ref<number | null>(null)
const currentWindDegrees = ref<number | null>(null)
const currentSunrise = ref<number | null>(null)
const currentSunset = ref<number | null>(null)

const hourlyForcasts = ref<ForecastItem[]>([])
const dailyForcasts = ref<DailyForecast[]>([])
const iconSrc = ref('https://openweathermap.org/img/wn/')

const updateLang = () => {
  lang.value = (navigator.language || (navigator as any).userLanguage || 'en').slice(0, 2)
}

const applyCurrentWeather = (weatherCurrent: CurrentWeatherResponse) => {
  city.value = weatherCurrent.name
  currentTemp.value = Math.round(weatherCurrent.main.temp)
  currentFeels.value = Math.round(weatherCurrent.main.feels_like)
  currentDescription.value = weatherCurrent.weather[0]?.description ?? ''
  currentHumidity.value = weatherCurrent.main.humidity
  currentPressure.value = weatherCurrent.main.pressure
  currentWindSpeed.value = weatherCurrent.wind.speed
  currentWindDegrees.value = weatherCurrent.wind.deg
  currentSunrise.value = weatherCurrent.sys.sunrise
  currentSunset.value = weatherCurrent.sys.sunset
  lat.value = weatherCurrent.coord.lat
  lon.value = weatherCurrent.coord.lon
}

const applyForecast = (forecastResponse: ForecastResponse) => {
  hourlyForcasts.value = forecastResponse.list.slice(0, 8)

  const dailyMap: Record<
      string,
      {
        dt: number
        temp: { min: number; max: number }
        weather: ForecastItem['weather']
        popSum: number
        popCount: number
      }
  > = {}

  forecastResponse.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0]
    const temp = item.main.temp
    const pop = item.pop ?? 0

    if (!dailyMap[date]) {
      dailyMap[date] = {
        dt: item.dt,
        temp: { min: temp, max: temp },
        weather: item.weather,
        popSum: pop,
        popCount: 1,
      }
    } else {
      dailyMap[date].temp.min = Math.min(dailyMap[date].temp.min, temp)
      dailyMap[date].temp.max = Math.max(dailyMap[date].temp.max, temp)
      dailyMap[date].popSum += pop
      dailyMap[date].popCount += 1
    }
  })

  const dailyArray: DailyForecast[] = Object.values(dailyMap).map((day) => ({
    dt: day.dt,
    temp: day.temp,
    weather: day.weather,
    pop: day.popCount ? day.popSum / day.popCount : 0,
  }))

  dailyForcasts.value = dailyArray.slice(1)

  const today = dailyArray[0]
  currentMax.value = Math.round(today.temp.max)
  currentMin.value = Math.round(today.temp.min)
}

const menuClose = () => {
  if (menuIsOpen.value) menuIsOpen.value = false
}

const menuToggle = () => {
  menuIsOpen.value = !menuIsOpen.value
}

const handleSelectOtherCity = () => {
  noGeo.value = true
  dataIsReady.value = false
  geoIsOff.value = true
}

const getWeather = async (id: number | null) => {
  if (!id) return

  noGeo.value = false
  cityId.value = id
  updateLang()
  dataIsReady.value = false

  try {
    const { data: weatherCurrent } = await axios.get<CurrentWeatherResponse>(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            id: cityId.value,
            lang: lang.value,
            units: 'metric',
            appid: apiKey,
          },
        }
    )

    applyCurrentWeather(weatherCurrent)

    if (lat.value == null || lon.value == null) throw new Error('No coords')

    const { data: forecastResponse } = await axios.get<ForecastResponse>(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            lat: lat.value,
            lon: lon.value,
            lang: lang.value,
            units: 'metric',
            appid: apiKey,
          },
        }
    )

    applyForecast(forecastResponse)
    dataIsReady.value = true
  } catch {
    alert('Для данного города, прогноз погоды недоступен')
    noGeo.value = true
    dataIsReady.value = false
  }
}

const getData = async () => {
  updateLang()
  dataIsReady.value = false

  try {
    if (lat.value == null || lon.value == null) throw new Error('No coords')

    const { data: cityResponse } = await axios.get<ReverseGeoItem[]>(
        'https://api.openweathermap.org/geo/1.0/reverse',
        {
          params: {
            lat: lat.value,
            lon: lon.value,
            limit: 1,
            appid: apiKey,
          },
        }
    )

    const geoItem = cityResponse[0]
    city.value = geoItem?.local_names?.[lang.value] ?? geoItem?.name ?? ''

    const { data: weatherCurrent } = await axios.get<CurrentWeatherResponse>(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            q: city.value,
            lang: lang.value,
            units: 'metric',
            appid: apiKey,
          },
        }
    )

    applyCurrentWeather(weatherCurrent)

    if (lat.value == null || lon.value == null) throw new Error('No coords')

    const { data: forecastResponse } = await axios.get<ForecastResponse>(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            lat: lat.value,
            lon: lon.value,
            lang: lang.value,
            units: 'metric',
            appid: apiKey,
          },
        }
    )

    applyForecast(forecastResponse)

    dataIsReady.value = true
    geoIsOff.value = false
  } catch {
    noGeo.value = true
    geoIsOff.value = true
  }
}

const updateWeather = () => {
  dataIsReady.value = false
  if (geoIsOff.value && cityId.value) {
    getWeather(cityId.value)
  } else {
    getData()
  }
}

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
      (position) => {
        lat.value = position.coords.latitude
        lon.value = position.coords.longitude
        getData()
      },
      () => {
        noGeo.value = true
        geoIsOff.value = true
      },
      { enableHighAccuracy: true }
  )
})
</script>


<style>
* {
  box-sizing: border-box;
  font-family: "Arimo", sans-serif;
  margin: 0;
  color: white;
}

.wrapper {
  background-color: #112936;
  min-height: 100vh;
  position: relative;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.preloader {
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  font-size: 22px;
}

.preloader__text {
  margin-left: 15px;
}
</style>
