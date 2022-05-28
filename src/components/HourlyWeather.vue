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
            <div class="hours__temp">{{ Math.round(item.temp) }}&deg;</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        hourlyForcasts: {
            type: Array,
            required: true,
        },
        iconSrc: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            mouseIsDown: false,
            startX: null,
            scrollLeft: null,
        };
    },
    methods: {
        mouseDown(e) {
            this.mouseIsDown = true;
            e.currentTarget.style.cursor = "grabbing";
            this.startX = e.pageX - e.currentTarget.offsetLeft;
            this.scrollLeft = e.currentTarget.scrollLeft;
        },
        mouseScroll(e) {
            if (this.mouseIsDown) {
                const x = e.pageX - e.currentTarget.offsetLeft;
                const scroll = x - this.startX;
                e.currentTarget.scrollLeft = this.scrollLeft - scroll;
            }
        },
        noScroll(e) {
            this.mouseIsDown = false;
            e.currentTarget.style.cursor = "grab";
        },
    },
};
</script>

<style scoped>
.hours {
    display: flex;
    overflow: auto;
    margin-top: 50px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    padding-bottom: 20px;
    user-select: none;
    cursor: grab;
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