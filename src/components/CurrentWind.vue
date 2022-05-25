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

<script>
export default {
    data() {
        return {
            animationSpeed: {
                animationDuration: "0s",
            },
            windInfo: "",
            bofortScale: 0,
            currentWindDirection: "",
        };
    },
    props: {
        currentWindDegrees: {
            type: Number,
            required: true,
        },
        currentWindSpeed: {
            type: Number,
            required: true,
        },
    },
    methods: {
        getBofortInfo(windSpeed) {
            if (windSpeed <= 0.2) {
                this.animationSpeed.animationDuration = "0s";
                this.bofortScale = "0";
                this.windInfo = "Штиль";
            } else if (windSpeed > 0.2 && windSpeed <= 1.5) {
                this.animationSpeed.animationDuration = "5s";
                this.bofortScale = "1";
                this.windInfo = "Тихий";
            } else if (windSpeed > 1.5 && windSpeed <= 3.3) {
                this.animationSpeed.animationDuration = "4s";
                this.bofortScale = "2";
                this.windInfo = "Лёгкий";
            } else if (windSpeed > 3.3 && windSpeed <= 5.4) {
                this.animationSpeed.animationDuration = "3s";
                this.bofortScale = "3";
                this.windInfo = "Слабый";
            } else if (windSpeed > 5.4 && windSpeed <= 7.9) {
                this.animationSpeed.animationDuration = "2.5s";
                this.bofortScale = "4";
                this.windInfo = "Умеренный";
            } else if (windSpeed > 7.9 && windSpeed <= 10.7) {
                this.animationSpeed.animationDuration = "2.2s";
                this.bofortScale = "5";
                this.windInfo = "Свежий";
            } else if (windSpeed > 10.7 && windSpeed <= 13.8) {
                this.animationSpeed.animationDuration = "2s";
                this.bofortScale = "6";
                this.windInfo = "Сильный";
            } else if (windSpeed > 13.8 && windSpeed <= 17.1) {
                this.animationSpeed.animationDuration = "1.8s";
                this.bofortScale = "7";
                this.windInfo = "Крепкий";
            } else if (windSpeed > 17.1 && windSpeed <= 20.7) {
                this.animationSpeed.animationDuration = "1.6s";
                this.bofortScale = "8";
                this.windInfo = "Очень крепкий";
            } else if (windSpeed > 20.7 && windSpeed <= 24.4) {
                this.animationSpeed.animationDuration = "1.4s";
                this.bofortScale = "9";
                this.windInfo = "Шторм";
            } else if (windSpeed > 24.4 && windSpeed <= 28.4) {
                this.animationSpeed.animationDuration = "1.2s";
                this.bofortScale = "10";
                this.windInfo = "Сильный шторм";
            } else if (windSpeed > 28.4 && windSpeed <= 32.6) {
                this.animationSpeed.animationDuration = "1s";
                this.bofortScale = "11";
                this.windInfo = "Жестокий шторм";
            } else if (windSpeed > 32.6) {
                this.animationSpeed.animationDuration = "0.8s";
                this.bofortScale = "12";
                this.windInfo = "Ураган";
            }
        },
        getWindDirection(windDirection) {
            if (windDirection > 330 || windDirection < 30) {
                this.currentWindDirection = "Северный";
            } else if (windDirection >= 30 && windDirection <= 60) {
                this.currentWindDirection = "Северо - Восточный";
            } else if (windDirection > 60 && windDirection < 120) {
                this.currentWindDirection = "Восточный";
            } else if (windDirection >= 120 && windDirection <= 150) {
                this.currentWindDirection = "Юго - Западный";
            } else if (windDirection > 150 && windDirection < 210) {
                this.currentWindDirection = "Южный";
            } else if (windDirection >= 210 && windDirection <= 240) {
                this.currentWindDirection = "Юго - Западный";
            } else if (windDirection > 240 && windDirection < 300) {
                this.currentWindDirection = "Западный";
            } else if (windDirection >= 300 && windDirection <= 330) {
                this.currentWindDirection = "Северо - Западный";
            }
        },
    },
    mounted() {
        this.getBofortInfo(this.currentWindSpeed);
        this.getWindDirection(this.currentWindDegrees);
    },
};
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