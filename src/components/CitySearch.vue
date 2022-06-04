<template>
    <div class="city">
        <div class="city__header">Выберете город</div>
        <div class="city__input">
            <input
                v-model="query"
                @input="searchHelp"
                :style="searchStyles"
                placeholder="Поиск города"
                type="text"
            />
            <div class="city__search">
                <div
                    class="city__tips"
                    v-for="item in searchSuggestions"
                    :key="item.value"
                    @click="setCity(item)"
                >
                    {{ item.value }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            url: "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
            query: "",
            token: "74978961c53a79474304faf762f67e15860eb867",
            searchSuggestions: [],
            searchStyles: {},
            cityId: 0,
        };
    },
    methods: {
        searchHelp(e) {
            this.$emit("update:modelValue", e.target.value);
            this.searchCity();
        },
        async searchCity() {
            const response = await axios.post(
                this.url,
                {
                    query: this.query,
                    from_bound: {
                        value: "city",
                    },
                    to_bound: {
                        value: "city",
                    },
                    locations: [{ country: "*" }],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Token " + this.token,
                    },
                }
            );
            this.searchSuggestions = response.data.suggestions;

            if (this.searchSuggestions.length > 0) {
                this.searchStyles.borderRadius = "15px 15px 0 0";
                this.searchStyles.borderBottom = "1px solid grey";
            } else {
                this.searchStyles.borderRadius = "15px";
                this.searchStyles.borderBottom = "none";
            }
        },
        setCity(item) {
            this.cityId = item.data.geoname_id;
            this.$emit("setCity", this.cityId);
            this.searchSuggestions = [];
            this.query = "";
            this.searchStyles.borderRadius = "15px";
            this.searchStyles.borderBottom = "none";
        },
    },
};
</script>

<style scoped>
.city {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 20px 20px 0;
}

.city__header {
    font-size: 28px;
    margin-bottom: 15px;
}

.city__input {
    position: relative;
    max-width: 400px;
    margin: 0 20px;
    width: 100%;
}

.city__input input {
    height: 40px;
    font-size: 18px;
    color: black;
    padding: 5px 15px;
    border: none;
    border-radius: 15px;
    width: 100%;
}

.city__input input:focus-visible {
    outline: none;
}

.city__search {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
}

.city__search .city__tips:last-child {
    border-radius: 0 0 15px 15px;
}

.city__tips {
    background-color: #fff;
    color: black;
    padding: 5px 10px;
}

.city__tips:hover {
    cursor: pointer;
    background-color: lightgray;
}
</style>