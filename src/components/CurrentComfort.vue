<template>
    <div class="comfort">
        <div ref="observer" class="comfort__header">КОМФОРТ</div>
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

<script>
export default {
    props: {
        currentHumidity: {
            type: Number,
            required: true,
        },
        currentFeels: {
            type: Number,
            required: true,
        },
        currentPressure: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            radius: 55,
            circumference: 0,
            scaleStyles: {},
            indicatorStyles: {
                strokeDasharray: "345.575 345.575",
                strokeDashoffset: "345.712",
            },
        };
    },
    methods: {
        getcircumference() {
            this.circumference = 2 * Math.PI * this.radius;
        },
        setScale(percent) {
            let offset =
                this.circumference - (percent / 100) * this.circumference;
            this.scaleStyles.strokeDashoffset = offset;
            this.scaleStyles.strokeDasharray = `${this.circumference} ${this.circumference}`;
        },
        setProgress(percent) {
            let offset =
                this.circumference - (percent / 100) * this.circumference;
            this.indicatorStyles.strokeDashoffset = offset;
            this.indicatorStyles.strokeDasharray = `${this.circumference} ${this.circumference}`;
        },
    },
    mounted() {
        this.getcircumference();
        this.setScale(75);

        const options = {
            rootMargin: "0px",
            threshold: 1.0,
        };
        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                this.setProgress(Math.round(this.currentHumidity / 1.33));
            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);
    },
};
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

/* 991 */

@media (max-width: 991px) {
}
</style>