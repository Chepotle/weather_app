<template>
  <div class="weather-layout">
    <div class="info">
      <div class="menu">
        <img
            src="@/assets/icons/dots.png"
            alt=""
            class="menu__btn"
            @click.stop="$emit('menu-toggle')"
        />
        <div class="menu__params" v-show="menuIsOpen">
          <div class="menu__update" @click="$emit('update-weather')">
            Обновить
            <img src="@/assets/icons/refresh.png" alt="" />
          </div>
          <div
              class="menu__change"
              @click="$emit('select-other-city')"
          >
            Выбрать другой город
          </div>
        </div>
      </div>
      <div class="current__city">{{ city }}</div>
      <div class="current__icon">
        <img src="@/assets/icons/location.png" alt="" />
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
</template>

<script setup lang="ts">
import HourlyWeather from '@/components/HourlyWeather.vue'
import DailyWeather from '@/components/DailyWeather.vue'
import CurrentComfort from '@/components/CurrentComfort.vue'
import CurrentWind from '@/components/CurrentWind.vue'
import CurrentSun from '@/components/CurrentSun.vue'

import type {
  ForecastItem,
  DailyForecast
} from '@/types/openweather'

defineProps<{
  city: string
  menuIsOpen: boolean
  currentTemp: number
  currentMax: number
  currentMin: number
  currentDescription: string
  currentHumidity: number
  currentFeels: number
  currentPressure: number
  currentWindSpeed: number
  currentWindDegrees: number
  currentSunrise: number
  currentSunset: number
  hourlyForcasts: ForecastItem[]
  dailyForcasts: DailyForecast[]
  iconSrc: string
  lang: string
}>()
</script>


<style scoped>
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

.current {
  text-align: center;
}

.info {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 15px 0;
  position: sticky;
  top: 0;
  background-color: #112936;
  z-index: 10;
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

.preloader__gif img {
  width: 60px;
  height: 60px;
}
</style>