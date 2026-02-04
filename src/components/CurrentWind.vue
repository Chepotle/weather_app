<template>
    <div class="wind">
        <div class="wind__header">ВЕТЕР</div>
        <div class="wind__block">
            <div class="wind__section">
                <div class="wind__icon">
                    <img
                        src="../assets/icons/windmill.png"
                        :style="animationSpeed"
                        alt=""
                    />
                </div>
            </div>
            <div class="wind__section">
                <div class="wind__direction">
                    Направление ветра: {{ currentWindDirection }}
                </div>
                <div class="wind__speed">
                    Скорость ветра: {{ currentWindSpeed }} м/с
                    <div class="wind__scale">
                        {{ bofortScale }} из 12 по шкале Бофорта ({{
                            windInfo
                        }})
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'

const props = defineProps<{
  currentWindDegrees: number
  currentWindSpeed: number
}>()

const animationSpeed = reactive({
  animationDuration: '0s'
})

const windInfo = ref('Штиль')
const bofortScale = ref('0')
const currentWindDirection = ref('Северный')

const beaufortData = [
  { maxSpeed: 0.2, duration: '0s', scale: '0', info: 'Штиль' },
  { maxSpeed: 1.5, duration: '5s', scale: '1', info: 'Тихий' },
  { maxSpeed: 3.3, duration: '4s', scale: '2', info: 'Лёгкий' },
  { maxSpeed: 5.4, duration: '3s', scale: '3', info: 'Слабый' },
  { maxSpeed: 7.9, duration: '2.5s', scale: '4', info: 'Умеренный' },
  { maxSpeed: 10.7, duration: '2.2s', scale: '5', info: 'Свежий' },
  { maxSpeed: 13.8, duration: '2s', scale: '6', info: 'Сильный' },
  { maxSpeed: 17.1, duration: '1.8s', scale: '7', info: 'Крепкий' },
  { maxSpeed: 20.7, duration: '1.6s', scale: '8', info: 'Очень крепкий' },
  { maxSpeed: 24.4, duration: '1.4s', scale: '9', info: 'Шторм' },
  { maxSpeed: 28.4, duration: '1.2s', scale: '10', info: 'Сильный шторм' },
  { maxSpeed: 32.6, duration: '1s', scale: '11', info: 'Жестокий шторм' },
  { maxSpeed: Infinity, duration: '0.8s', scale: '12', info: 'Ураган' }
]

const windDirections = [
  { min: 0, max: 30, dir: 'Северный' },
  { min: 30, max: 60, dir: 'Северо-Восточный' },
  { min: 60, max: 120, dir: 'Восточный' },
  { min: 120, max: 150, dir: 'Юго-Восточный' },
  { min: 150, max: 210, dir: 'Южный' },
  { min: 210, max: 240, dir: 'Юго-Западный' },
  { min: 240, max: 300, dir: 'Западный' },
  { min: 300, max: 330, dir: 'Северо-Западный' },
  { min: 330, max: 360, dir: 'Северный' }
]

const getBeaufortInfo = (speed: number): void => {
  const level = beaufortData.find(item => speed <= item.maxSpeed)
  if (level) {
    animationSpeed.animationDuration = level.duration
    bofortScale.value = level.scale
    windInfo.value = level.info
  }
}

const getWindDirection = (degrees: number): void => {
  const direction = windDirections.find(dir =>
      degrees >= dir.min && degrees < dir.max
  ) || windDirections[0] // fallback

  currentWindDirection.value = direction.dir
}

onMounted(() => {
  getBeaufortInfo(props.currentWindSpeed)
  getWindDirection(props.currentWindDegrees)
})

watch(() => props.currentWindSpeed, getBeaufortInfo)
watch(() => props.currentWindDegrees, getWindDirection)
</script>

<style>
.wind {
    margin-top: 50px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 20px;
}
.wind__header {
    font-size: 23px;
}
.wind__block {
    display: flex;
    margin-top: 40px;
    text-align: center;
    justify-content: space-between;
    align-items: center;
}
.wind__icon img {
    width: 120px;
    height: 120px;
    animation-name: bladeSpin;

    animation-iteration-count: infinite;
    animation-timing-function: linear;
    transform-origin: center;
}
.wind__speed {
    margin-top: 15px;
}
.wind__scale {
    margin-top: 15px;
}

.wind__direction,
.wind__speed {
    padding-left: 15px;
}

@keyframes bladeSpin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>