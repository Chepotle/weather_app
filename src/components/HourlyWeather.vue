<template>
    <div
        class="hours"
        @mousedown="mouseDown"
        @mousemove="mouseScroll"
        @mouseleave="noScroll"
        @mouseup="noScroll"
    >
        <div v-for="item in hourlyForcasts" :key="item.dt" class="hours__item">
            <div class="hours__time">
                {{ new Date(item.dt * 1000).getHours() }}:00
            </div>
            <div class="hours__icon">
                <img :src="iconSrc + item.weather[0].icon + '@2x.png'" alt="" />
            </div>
            <div class="hours__temp">{{ Math.round(item.main.temp) }}&deg;</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ForecastItem } from '@/types/openweather'

defineProps<{
  hourlyForcasts: ForecastItem[]
  iconSrc: string
}>()

const mouseIsDown = ref(false)
const startX = ref<number | null>(null)
const scrollLeft = ref<number | null>(null)

const mouseDown = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  mouseIsDown.value = true
  target.style.cursor = 'grabbing'
  startX.value = e.pageX - target.offsetLeft
  scrollLeft.value = target.scrollLeft
}

const mouseScroll = (e: MouseEvent) => {
  if (mouseIsDown.value) {
    const target = e.currentTarget as HTMLElement
    const x = e.pageX - target.offsetLeft
    const scroll = x - Number(startX.value!)
    target.scrollLeft = Number(scrollLeft.value!) - scroll
  }
}

const noScroll = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  mouseIsDown.value = false
  target.style.cursor = 'grab'
}
</script>

<style scoped>
.hours {
    justify-content: center;
    display: flex;
    overflow: auto;
    margin-top: 50px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 20px;
    user-select: none;
}

.hours::-webkit-scrollbar {
    height: 6px;
    border-radius: 15px;
    display: none;
}

.hours::-webkit-scrollbar-thumb {
    background-color: rgb(21 81 99);
    border-radius: 15px;
}

.hours::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 15px;
}

.hours__item {
    margin-right: 35px;
    text-align: center;
}

.hours__time {
    white-space: nowrap;
}

.hours__icon img {
    width: 50px;
    height: 50px;
    -webkit-user-drag: none;
}
</style>