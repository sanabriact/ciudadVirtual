class WeatherService{
    constructor(){
        this._baseURL = "https://api.openweathermap.org/data/2.5/weather";
        this.apiKey = "ed5c2857daa0827293da3b4f9b584ff0"
    }

    getWeather(lat,lon){
        let url = this._baseURL
            + "?lat=" + lat
            + "&lon=" + lon
            + "&appid=" + this.apiKey
            + "&units=metric"
            + "&lang=es"

        return fetch(url).then(function(res){
            if(!res){
                throw new Error("Error al conseguir clima.")
            }

            return res.json();
        });
    }
}