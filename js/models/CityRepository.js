class CityRepository{
    constructor(citiesURL = "../../data/cities.json"){
        this._url = citiesURL;
    }

    getCities(){
        return fetch(this._url).then(function (res){
            if(!res.ok){
                throw new Error("Error al obtener ciudades")
            } else {
                return res.json();
            }
        })
    }
}