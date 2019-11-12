const svg = d3.select('svg');
const countryArray = [];
let cities = [];
let dataCount = [];

const cityToCountry = (fetchurl) => {
    fetch(fetchurl)
    .then(response => response.json())
    .then(json => {       
        cities = json;
    })
}
cityToCountry('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-capital-city.json')

const rendermap = (d3) => {
        
        d3.json('http://enjalot.github.io/wwsd/data/world/world-110m.geojson')
            .then(json => {
                json.features.forEach((feature, i) => {
                    countryArray.push(feature.properties.name);
                    dataCount.push(feature)
                    dataCount[i].properties.count = 0;
                });
            })
};
rendermap(d3);
  
//https://www.youtube.com/watch?v=Qw6uAg3EO64

//Github CMDA 
const url =
    "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-02/sparql";
//Note that the query is wrapped in es6 template strings to allow for easy copy pasting
const query = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?cho ?placeName WHERE {
    ?place skos:prefLabel ?placeName .
    ?cho dct:spatial ?place ;
            dct:created ?year .
    } 
    LIMIT 10000
`;

let results = [];

const runQuery = (url, query) => {
    // Call the url with the query attached, output data
    fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
    .then(res => res.json())
    .then(json => {
        let highestCount = 0;

        results = json.results.bindings;
        results.forEach((result) => {
            if(!countryArray.includes(result.placeName.value)){
                cities.forEach((city) => {
                    if(city.city == result.placeName.value){
                        result.placeName.value = city.country;
                    }
                });
            }
        });
        results.forEach(result => {
            if(countryArray.includes(result.placeName.value)) {
                dataCount.forEach((counter) => {
                    if(counter.properties.name == result.placeName.value){
                        counter.properties.count = counter.properties.count += 1;
                        if(counter.properties.count > highestCount) {
                            highestCount = counter.properties.count;
                        }
                    }
                });
            }
        })
        const worldMap = d3.geoNaturalEarth1(); //comes in different styles on d3
        const pathCreator = d3.geoPath().projection(worldMap);
        svg.append('path')
            .attr('class', 'sphere')
            .attr('d', pathCreator({type: 'Sphere'}));
        console.log(dataCount);
        let scale = d3.scaleLinear()
            .domain([0, highestCount])
            .range(['#c6c6c6', '#033033']);
        svg.selectAll('path')
            .data(dataCount) 
            .enter()
            .append('path')
                .attr('d', pathCreator)
                .attr('class', 'country')
                .style('fill', function (d) { return scale(d.properties.count) })

    })
};
runQuery(url, query);