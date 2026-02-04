<template>
    <div class="comfort">
        <div ref="observerRef" class="comfort__header">КОМФОРТ</div>
        <div class="comfort__block">
            <div class="comfort__section">
                <div class="comfort__sub-header">Влажность</div>
                <div class="comfort__indicator">
                    <div class="comfort__humidity">{{ currentHumidity }} %</div>
                    <div class="comfort__count">
                        <div>0</div>
                        <div>100</div>
                    </div>
                    <svg class="comfort__scale" width="150" height="150">
                        <circle
                            class="comfort__circle"
                            stroke="grey"
                            stroke-width="10"
                            cx="75"
                            cy="75"
                            fill="transparent"
                            :r="radius"
                            :style="scaleStyles"
                        ></circle>
                        <circle
                            class="comfort__value"
                            stroke="white"
                            stroke-width="10"
                            cx="75"
                            cy="75"
                            fill="transparent"
                            :r="radius"
                            :style="indicatorStyles"
                        ></circle>
                    </svg>
                </div>
            </div>
            <div class="comfort__section">
                <div class="comfort__feels">
                    <span>Ощущается как:</span> {{ currentFeels }}&deg;
                </div>
                <div class="comfort__pressure">
                    <span>Атмосферное давление:</span>
                    {{ currentPressure }} мбар
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const props = defineProps<{
  currentHumidity: number
  currentFeels: number
  currentPressure: number
}>()

const radius = 55
const circumference = ref(0)
const scaleStyles = reactive({ strokeDashoffset: '', strokeDasharray: '' })
const indicatorStyles = reactive({ strokeDasharray: '345.575 345.575', strokeDashoffset: '345.712' })
const observerRef = ref<HTMLElement | null>(null)

const calculateCircumference = () => {
  circumference.value = 2 * Math.PI * radius
}

const animateCircle = (percent: number, styles: typeof scaleStyles) => {
  const offset = circumference.value - (percent / 100) * circumference.value
  styles.strokeDashoffset = offset.toString()
  styles.strokeDasharray = `${circumference.value} ${circumference.value}`
}

onMounted(() => {
  calculateCircumference()
  animateCircle(75, scaleStyles)

  if (observerRef .value) {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        const humidityPercent = Math.round(props.currentHumidity / 1.33)
        animateCircle(humidityPercent, indicatorStyles)
      }
    }, {
      threshold: 1.0
    })

    observer.observe(observerRef.value)
  }
})

watch(() => props.currentHumidity, (newHumidity) => {
  const humidityPercent = Math.round(newHumidity / 1.33)
  animateCircle(humidityPercent, indicatorStyles)
})
</script>

<style scoped>
.comfort {
    margin-top: 50px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 20px;
}
.comfort__header {
    font-size: 23px;
}
.comfort__scale {
    stroke-linecap: round;
}
.comfort__circle,
.comfort__value {
    transform-origin: center;
    transform: rotate(135deg);
}
.comfort__value {
    transition-duration: 3s;
    transition-property: stroke-dashoffset;
}
.comfort__block {
    display: flex;
    margin-top: 40px;
    text-align: center;
    justify-content: space-between;
    align-items: center;
}
.comfort__indicator {
    position: relative;
}
.comfort__humidity {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 25px;
}
.comfort__count {
    position: absolute;
    bottom: 15px;
    left: 0;
    display: flex;
    width: 100%;
    justify-content: space-around;
    font-size: 13px;
}
.comfort__count div {
    color: gray;
}
.comfort__pressure {
    margin-top: 15px;
}

.comfort__feels,
.comfort__pressure {
    padding-left: 15px;
}
</style>