<template>
    <div class="sun">
        <div ref="observer" class="sun__header">ВОСХОД И ЗАКАТ</div>
        <div class="sun__block">
            <div class="sun__line" ref="sunLine">
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

<script>
export default {
    props: {
        currentSunrise: {
            type: Number,
            required: true,
        },
        currentSunset: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            pathStyles: {},
            timePercent: 0,
        };
    },
    methods: {
        setSunlineWidth() {
            let width = this.$refs.sunLine.offsetWidth * 0.8 + "px";
            this.pathStyles.width = width;
            this.pathStyles.height = width;
        },
        getTimePercent() {
            let currentTime = Math.round(Date.now() / 1000);

            let day = this.currentSunset - this.currentSunrise;
            if (currentTime <= this.currentSunset) {
                let lastSunTime = this.currentSunset - currentTime;
                this.timePercent = 100 - Math.round((lastSunTime / day) * 100);
            } else {
                this.timePercent = 100;
                this.$refs.sun.style.opacity = ".5";
            }
        },

        setSunPosition(percent) {
            if (percent != 100) {
                this.pathStyles.transitionDuration = percent * 0.08 + "s";
            } else {
                this.pathStyles.transitionDuration = "0s";
            }
            if (window.innerWidth <= 991 && window.innerWidth > 767) {
                let position = (145 * percent) / 100 + 17;
                this.pathStyles.transform =
                    "translate(-50%, -35%) " + `rotate(${position}deg)`;
            } else if (window.innerWidth <= 767 && window.innerWidth > 575) {
                let position = (157 * percent) / 100 + 11;
                this.pathStyles.transform =
                    "translate(-50%, -40%) " + `rotate(${position}deg)`;
            } else if (window.innerWidth <= 575) {
                let position = (180 * percent) / 100;
                this.pathStyles.transform =
                    "translate(-50%, -50%) " + `rotate(${position}deg)`;
            } else {
                let position = (119.5 * percent) / 100 + 30;
                this.pathStyles.transform =
                    "translate(-50%, -25%) " + `rotate(${position}deg)`;
            }
        },
    },
    mounted() {
        if (window.innerWidth <= 991 && window.innerWidth > 767) {
            this.pathStyles.transform =
                "translate(-50%, -35%) " + "rotate(17deg)";
        } else if (window.innerWidth <= 767 && window.innerWidth > 575) {
            this.pathStyles.transform =
                "translate(-50%, -40%) " + "rotate(11deg)";
        } else if (window.innerWidth <= 575) {
            this.pathStyles.transform =
                "translate(-50%, -50%) " + "rotate(0deg)";
        }
        this.setSunlineWidth();
        this.getTimePercent();

        const options = {
            rootMargin: "0px",
            threshold: 1.0,
        };
        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                this.setSunPosition(this.timePercent);
            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);
    },
};
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