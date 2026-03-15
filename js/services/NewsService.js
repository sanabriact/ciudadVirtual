class NewsService{
    constructor(){
        this.newsUrl = "https://newsapi.org/v2/top-headlines";
        this.apiKey = "4a3bc36a6daf4c7bb48ff123d0e3c3ce";
        this.proxy   = "https://cors-anywhere.herokuapp.com/";
    }

    getNews(countryCode){
        let url = this.proxy + this.newsUrl
            + "?country=" + countryCode
            + "&pageSize=5"
            + "&apikey=" + this.apiKey

        return fetch(url).then(function(res){
            if(!res){
                throw new Error("Error al conseguir noticias.")
            }

            return res.json();
        })
    }
}