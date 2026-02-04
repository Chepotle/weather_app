export interface CurrentWeatherResponse {
    coord: { lat: number; lon: number }
    weather: Array<{
        id: number
        main: string
        description: string
        icon: string
    }>
    main: {
        temp: number
        feels_like: number
        temp_min: number
        temp_max: number
        pressure: number
        humidity: number
    }
    wind: {
        speed: number
        deg: number
    }
    sys: {
        sunrise: number
        sunset: number
    }
    name: string
}

export interface ForecastItem {
    dt: number
    dt_txt: string
    temp: {
        day: number
        min: number
        max: number
        night: number
        eve: number
        morn: number
    }
    main: {
        temp: number
        feels_like: number
        temp_min: number
        temp_max: number
        pressure: number
        humidity: number
    }
    weather: Array<{
        id: number
        main: string
        description: string
        icon: string
    }>
    pop?: number
}

export interface ForecastResponse {
    list: ForecastItem[]
}

export interface ReverseGeoItem {
    name: string
    local_names?: Record<string, string>
    lat: number
    lon: number
}

export interface DailyForecast {
    dt: number
    temp: {
        min: number
        max: number
    }
    weather: ForecastItem['weather']
    pop: number
}
