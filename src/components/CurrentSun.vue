<template>
    <div class="sun">
        <div ref="observerRef" class="sun__header">ВОСХОД И ЗАКАТ</div>
        <div class="sun__block">
            <div class="sun__line" ref="sunLineRef">
                <div class="sun__path" :style="pathStyles">
                    <div class="sun__icon">
                        <img ref="sun" src="../assets/icons/sunny.png" alt="" />
                    </div>
                </div>
            </div>
            <div class="sun__info">
                <div class="sun__rise">
                    {{
                        new Date(currentSunrise * 1000).toLocaleString("ru", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                    }}
                </div>
                <div class="sun__set">
                    {{
                        new Date(currentSunset * 1000).toLocaleString("ru", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'

const props = defineProps<{
  currentSunrise: number
  currentSunset: number
}>()

const pathStyles = reactive({
  width: '',
  height: '',
  transform: '',
  transitionDuration: ''
})
const timePercent = ref(0)
const sunLineRef = ref<HTMLElement | null>(null)
const observerRef = ref<HTMLElement | null>(null)

const getWindowSize = (): number => window.innerWidth

const setSunlineWidth = (): void => {
  if (sunLineRef.value) {
    const width = sunLineRef.value.offsetWidth * 0.8 + 'px'
    pathStyles.width = width
    pathStyles.height = width
  }
}

const calculateTimePercent = (): void => {
  const currentTime = Math.round(Date.now() / 1000)

  const dayDuration = props.currentSunset - props.currentSunrise
  const timeLeftToSunset = props.currentSunset - currentTime

  if (currentTime <= props.currentSunset) {
    timePercent.value = 100 - Math.round((timeLeftToSunset / dayDuration) * 100)
  } else {
    timePercent.value = 100

    if (sunLineRef.value?.querySelector('.sun')) {
      (sunLineRef.value.querySelector('.sun') as HTMLElement)?.style.setProperty('opacity', '.5')
    }
  }
}

const getRotationAngle = (percent: number): number => {
  const width = getWindowSize()

  if (width <= 991 && width > 767) return (145 * percent) / 100 + 17
  if (width <= 767 && width > 575) return (157 * percent) / 100 + 11
  if (width <= 575) return (180 * percent) / 100
  return (119.5 * percent) / 100 + 30
}

const getTransform = (percent: number): string => {
  const angle = getRotationAngle(percent)
  const translateY = getWindowSize() <= 575 ? '-50%' :
      getWindowSize() <= 767 ? '-40%' : '-25%'

  return `translate(-50%, ${translateY}) rotate(${angle}deg)`
}

const setSunPosition = (percent: number): void => {
  pathStyles.transitionDuration = percent !== 100 ? `${percent * 0.08}s` : '0s'
  pathStyles.transform = getTransform(percent)
}

const setInitialTransform = (): void => {
  const angle = getRotationAngle(0)
  const translateY = getWindowSize() <= 575 ? '-50%' :
      getWindowSize() <= 767 ? '-40%' : '-35%'

  pathStyles.transform = `translate(-50%, ${translateY}) rotate(${angle}deg)`
}

onMounted(() => {
  setInitialTransform()
  setSunlineWidth()
  calculateTimePercent()

  if (observerRef.value) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSunPosition(timePercent.value)
      }
    }, { threshold: 1.0 })

    observer.observe(observerRef.value)
  }
})

watch([() => props.currentSunrise, () => props.currentSunset], calculateTimePercent)
watch(timePercent, setSunPosition)
</script>

<style>
.sun {
    margin-top: 50px;
    overflow: hidden;
}
.sun__header {
    font-size: 23px;
}
.sun__block {
    margin-top: 250px;
}
.sun__line {
    width: 100%;
    height: 1px;
    position: relative;
    background-color: rgba(255, 255, 255, 0.5);
}
.sun__icon {
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
}
.sun__icon img {
    width: 24px;
    height: 24px;
}
.sun__path {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 0;
    transform: translate(-50%, -25%) rotate(30deg);
    background-color: transparent;
    border-radius: 50%;
    border: 2px solid white;
}
.sun__info {
    display: flex;
    justify-content: space-between;
    padding: 5px 40px 30px;
    position: relative;
    z-index: 1;
    background-color: #112936;
}

@media (max-width: 991px) {
    .sun__info {
        padding: 5px 25px 30px;
    }
}

@media (max-width: 767px) {
    .sun__info {
        padding: 5px 15px 30px;
    }
    .sun__block {
        margin-top: 230px;
    }
}

@media (max-width: 450px) {
    .sun__block {
        margin-top: 190px;
    }
}
</style>