<template>
  <div class="city">
    <div class="city__header">Выберете город</div>
    <div class="city__input">
      <input
          v-model="query"
          @input="searchCity"
          :style="searchStyles"
          placeholder="Поиск"
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

<script setup lang="ts">
import axios from 'axios'
import { ref, reactive } from 'vue'
import type { DaDataSuggestion } from '@/types/dadata'

const emits = defineEmits<{
  setCity: [cityId: number | null]
}>()

const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
const token = process.env.VUE_APP_DADATA_TOKEN || null
const query = ref('')
const searchSuggestions = ref<DaDataSuggestion[]>([])
const searchStyles = reactive({
  borderRadius: '15px',
  borderBottom: 'none'
})
const cityId = ref<number | null>(null)

const searchCity = async () => {
  try {
    const response = await axios.post(url, {
      query: query.value,
      from_bound: { value: 'city' },
      to_bound: { value: 'city' },
      locations: [{ country: '*' }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    })

    searchSuggestions.value = response.data.suggestions as DaDataSuggestion[]

    if (searchSuggestions.value.length > 0) {
      searchStyles.borderRadius = '15px 15px 0 0'
      searchStyles.borderBottom = '1px solid grey'
    } else {
      searchStyles.borderRadius = '15px'
      searchStyles.borderBottom = 'none'
    }
  } catch (error) {
    console.error('Ошибка поиска города:', error)
    searchSuggestions.value = []
    searchStyles.borderRadius = '15px'
    searchStyles.borderBottom = 'none'
  }
}

const setCity = (item: DaDataSuggestion) => {
  cityId.value = item.data.geoname_id
  emits('setCity', cityId.value)
  searchSuggestions.value = []
  query.value = ''
  searchStyles.borderRadius = '15px'
  searchStyles.borderBottom = 'none'
}

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