<template>
    <div class="daily">
        <div class="daily__item" v-for="item in dailyForcasts" :key="item.dt">
            <div class="daily__date">
                {{
                    new Date(item.dt * 1000).toLocaleString(this.lang, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                    })
                }}
            </div>
            <div class="daily__icon">
                <img :src="iconSrc + item.weather[0].icon + '@2x.png'" alt="" />
            </div>
            <div class="daily__pop">
                Вероятность осадков: {{ Math.round(item.pop * 100) }}%
            </div>
            <div class="daily__temp">
                {{ Math.round(item.temp.max) }}&deg; /
                {{ Math.round(item.temp.min) }}&deg;
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        dailyForcasts: {
            type: Array,
            required: true,
        },
        iconSrc: {
            type: String,
            required: true,
        },
        lang: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
.daily {
    margin-top: 50px;
}
.daily__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.daily__temp {
    white-space: nowrap;
}

.daily__icon,
.daily__pop {
    padding: 0 10px;
}

.daily__icon img {
    width: 100px;
    height: 100px;
}

@media (max-width: 575px) {
    .daily__pop {
        display: none;
    }
}
</style>