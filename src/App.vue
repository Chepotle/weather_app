<template>
    <div class="wrapper" @click="menuClose">
        <div v-if="dataIsReady && noGeo == false" class="container">
            <div class="info">
                <div class="menu">
                    <img
                        src="../src/assets/icons/dots.png"
                        alt=""
                        class="menu__btn"
                        @click.stop="menuToggle"
                    />
                    <div class="menu__params" v-show="menuIsOpen">
                        <div class="menu__update" @click="updateWeather">
                            Обновить
                            <img src="../src/assets/icons/refresh.png" alt="" />
                        </div>
                        <div
                            @click="
                                noGeo = true;
                                dataIsReady = false;
                                geoIsOff = true;
                            "
                            class="menu__change"
                        >
                            Выбрать другой город
                        </div>
                    </div>
                </div>
                <div class="current__city">{{ city }}</div>
                <div class="current__icon">
                    <img src="../src/assets/icons/location.png" alt="" />
                </div>
            </div>
            <div class="current">
                <div class="current__temperature">{{ currentTemp }}&deg;</div>
                <div class="current__max-min">
                    {{ currentMax }}&deg; / {{ currentMin }}&deg;
                </div>
                <div class="current__wether">{{ currentDescription }}</div>
            </div>
            <hourly-weather
                :hourlyForcasts="hourlyForcasts"
                :iconSrc="iconSrc"
            />
            <daily-weather
                :dailyForcasts="dailyForcasts"
                :iconSrc="iconSrc"
                :lang="lang"
            />
            <current-comfort
                :currentHumidity="currentHumidity"
                :currentFeels="currentFeels"
                :currentPressure="currentPressure"
            />
            <current-wind
                :currentWindDegrees="currentWindDegrees"
                :currentWindSpeed="currentWindSpeed"
            />
            <current-sun
                :currentSunrise="currentSunrise"
                :currentSunset="currentSunset"
            />
        </div>
        <div v-if="dataIsReady == false && noGeo == false" class="preloader">
            <div class="preloader__gif">
                <img src="../src/assets/icons/preloader.svg" alt="" />
            </div>
            <div class="preloader__text">ЗАГРУЗКА ДАННЫХ</div>
        </div>
        <city-search
            @setCity="getWeather"
            v-if="dataIsReady == false && noGeo"
        />
    </div>
</template>

<script>
import HourlyWeather from "@/components/HourlyWeather.vue";
import DailyWeather from "@/components/DailyWeather.vue";
import CurrentComfort from "@/components/CurrentComfort.vue";
import CurrentWind from "@/components/CurrentWind.vue";
import CurrentSun from "@/components/CurrentSun.vue";
import CitySearch from "@/components/CitySearch.vue";
import axios from "axios";

export default {
    components: {
        HourlyWeather,
        DailyWeather,
        CurrentComfort,
        CurrentWind,
        CurrentSun,
        CitySearch,
    },
    data() {
        return {
            dataIsReady: false,
            noGeo: false,
            geoIsOff: false,
            menuIsOpen: false,
            cityId: 0,
            lat: 0,
            lon: 0,
            city: "",
            lang: "",
            apiKey: "46703270cd3690f0c8a1347198110f48",
            currentTemp: 0,
            currentFeels: 0,
            currentMax: 0,
            currentMin: 0,
            currentDescription: "",
            currentHumidity: 0,
            currentPressure: 0,
            currentWindSpeed: 0,
            currentWindDegrees: 0,
            hourlyForcasts: [],
            dailyForcasts: [],
            currentSunrise: 0,
            currentSunset: 0,
            iconSrc: "https://openweathermap.org/img/wn/",
        };
    },
    methods: {
        updateWeather() {
            this.dataIsReady = false;
            if (this.geoIsOff) {
                this.getWeather(this.cityId);
            } else {
                this.dataIsReady = false;
                this.getData();
            }
        },
        menuClose() {
            if (this.menuIsOpen) {
                this.menuIsOpen = false;
            }
        },
        menuToggle() {
            if (this.menuIsOpen) {
                this.menuIsOpen = false;
            } else {
                this.menuIsOpen = true;
            }
        },
        async getWeather(cityId) {
            this.noGeo = false;
            this.cityId = cityId;
            this.lang = navigator.language || navigator.userLanguage;
            try {
                const weatherCurrent = await axios.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    {
                        params: {
                            id: this.cityId,
                            lang: this.lang,
                            units: "metric",
                            appid: this.apiKey,
                        },
                    }
                );
                this.city = weatherCurrent.data.name;
                this.currentTemp = Math.round(weatherCurrent.data.main.temp);
                this.currentFeels = Math.round(
                    weatherCurrent.data.main.feels_like
                );
                this.currentDescription =
                    weatherCurrent.data.weather[0].description;
                this.currentHumidity = weatherCurrent.data.main.humidity;
                this.currentPressure = weatherCurrent.data.main.pressure;
                this.currentWindSpeed = weatherCurrent.data.wind.speed;
                this.currentWindDegrees = weatherCurrent.data.wind.deg;
                this.currentSunrise = weatherCurrent.data.sys.sunrise;
                this.currentSunset = weatherCurrent.data.sys.sunset;
                this.lat = weatherCurrent.data.coord.lat;
                this.lon = weatherCurrent.data.coord.lon;

                const weatherGlobal = await axios.get(
                    "https://api.openweathermap.org/data/2.5/onecall",
                    {
                        params: {
                            lat: this.lat,
                            lon: this.lon,
                            lang: this.lang,
                            units: "metric",
                            exclude: "minutely,current,alerts",
                            appid: this.apiKey,
                        },
                    }
                );
                this.hourlyForcasts = weatherGlobal.data.hourly.filter(
                    (item, index) => {
                        if (index > 0 && index < 25) {
                            return true;
                        }
                    }
                );
                this.dailyForcasts = weatherGlobal.data.daily.filter(
                    (item, index) => {
                        if (index > 0) {
                            return true;
                        }
                    }
                );
                this.hourlyTime = this.hourlyForcasts[0].dt;
                this.currentMax = Math.round(
                    weatherGlobal.data.daily[0].temp.max
                );
                this.currentMin = Math.round(
                    weatherGlobal.data.daily[0].temp.min
                );
                this.dataIsReady = true;
            } catch (e) {
                alert("Для данного города, прогноз погоды недоступен");
                this.noGeo = true;
                this.dataIsReady = false;
            }
        },
        async getData() {
            this.lang = navigator.language || navigator.userLanguage;
            try {
                const cityResponse = await axios.get(
                    "https://api.openweathermap.org/geo/1.0/reverse?",
                    {
                        params: {
                            lat: this.lat,
                            lon: this.lon,
                            appid: this.apiKey,
                        },
                    }
                );
                this.city = cityResponse.data[0].local_names[this.lang];

                const weatherCurrent = await axios.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    {
                        params: {
                            q: this.city,
                            lang: this.lang,
                            units: "metric",
                            appid: this.apiKey,
                        },
                    }
                );
                this.currentTemp = Math.round(weatherCurrent.data.main.temp);
                this.currentFeels = Math.round(
                    weatherCurrent.data.main.feels_like
                );
                this.currentDescription =
                    weatherCurrent.data.weather[0].description;
                this.currentHumidity = weatherCurrent.data.main.humidity;
                this.currentPressure = weatherCurrent.data.main.pressure;
                this.currentWindSpeed = weatherCurrent.data.wind.speed;
                this.currentWindDegrees = weatherCurrent.data.wind.deg;
                this.currentSunrise = weatherCurrent.data.sys.sunrise;
                this.currentSunset = weatherCurrent.data.sys.sunset;

                const weatherGlobal = await axios.get(
                    "https://api.openweathermap.org/data/2.5/onecall",
                    {
                        params: {
                            lat: this.lat,
                            lon: this.lon,
                            lang: this.lang,
                            units: "metric",
                            exclude: "minutely,current,alerts",
                            appid: this.apiKey,
                        },
                    }
                );

                this.hourlyForcasts = weatherGlobal.data.hourly.filter(
                    (item, index) => {
                        if (index > 0 && index < 25) {
                            return true;
                        }
                    }
                );
                this.dailyForcasts = weatherGlobal.data.daily.filter(
                    (item, index) => {
                        if (index > 0) {
                            return true;
                        }
                    }
                );

                this.hourlyTime = this.hourlyForcasts[0].dt;

                this.currentMax = Math.round(
                    weatherGlobal.data.daily[0].temp.max
                );
                this.currentMin = Math.round(
                    weatherGlobal.data.daily[0].temp.min
                );

                this.dataIsReady = true;
                this.geoIsOff = false;
            } catch (e) {
                alert("Ошибка");
            }
        },
    },
    created() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.lat = position.coords.latitude;
                this.lon = position.coords.longitude;
                this.getData();
            },
            () => {
                this.noGeo = true;
                this.geoIsOff = true;
            },
            {
                enableHighAccuracy: true,
            }
        );
    },
};
</script>

<style>
* {
    box-sizing: border-box;
    font-family: "Arimo", sans-serif;
    margin: 0;
    color: white;
}

.menu {
    position: absolute;
    right: -10px;
    top: 15px;
}

.menu img {
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.menu__params {
    background-color: gray;
    white-space: nowrap;
    position: absolute;
    right: 45px;
    top: 0;
    border-radius: 10px;
}

.menu__update {
    padding: 10px 15px;
    border-bottom: 1px solid white;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 10px 10px 0 0;
}

.menu__change {
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 0 0 10px 10px;
}

.menu__update:hover,
.menu__change:hover {
    background-color: darkgrey;
}

.menu__update img {
    width: 16px;
    height: 16px;
    margin-left: 10px;
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

.current {
    text-align: center;
}

.info {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-top: 15px;
    position: sticky;
    top: 0;
    background-color: #112936;
}

.current__city {
    font-size: 28px;
}

.current__temperature {
    font-size: 50px;
}
.current__wether {
    margin-top: 5px;
}

.current__icon img {
    width: 25px;
    height: 25px;
    margin-left: 5px;
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
.preloader__gif img {
    width: 60px;
    height: 60px;
}

/* 991 */

@media (max-width: 991px) {
}
</style>