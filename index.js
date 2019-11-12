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

const rendermapLayout = (d3) => {     
    d3.json('http://enjalot.github.io/wwsd/data/world/world-110m.geojson')
        .then(json => {
            json.features.forEach((feature, i) => {
                countryArray.push(feature.properties.name);
                dataCount.push(feature)
                dataCount[i].properties.count = 0;
            });
        })
};
rendermapLayout(d3);
  
//https://www.youtube.com/watch?v=Qw6uAg3EO64


const runQuery = (url, query) => {
    // Call the url with the query attached, output data
    fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
    .then(res => res.json())
    .then(json => {
        let highestCount = 0;
        //change results placename to match more items in the following forEach. If item is not in city JSON -> delete
        let results = json.results.bindings;
        results.forEach((result) => {
            if(!countryArray.includes(result.placeName.value)){
                cities.forEach((city) => {
                    if(city.city == result.placeName.value){
                        result.placeName.value = city.country;
                    }
                });
            }
            if(!countryArray.includes(result.placeName.value)){
                let index = results.indexOf(result);
                results.splice(index, 1)
            }
        });
        console.log(countryArray)
        console.log(results)
        //check if any placename is equal to one of the countries, if so -> country count + 1
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
        const worldMap = d3.geoNaturalEarth1(); //natural earth gives a good realistic view of the map
        const pathCreator = d3.geoPath().projection(worldMap);
        svg.append('path')
            .attr('class', 'sphere')
            .attr('d', pathCreator({type: 'Sphere'}));
        let scaleColor = d3.scaleLinear()
            .domain([0, highestCount])
            .range(['#e6e6e6', '#033033']);
        let scaleStroke = d3.scaleLinear()
            .domain([0, highestCount])
            .range(['#000000', '#ffffff'])
        svg.selectAll('path')
            .data(dataCount) 
            .enter()
            .append('path')
                .attr('d', pathCreator)
                .attr('class', 'country')
                .style('fill', (d) => scaleColor(d.properties.count))
                .style('stroke', (d) => scaleStroke(d.properties.count))

    })
};


const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-02/sparql";
const query = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?cho ?placeName WHERE {

    ?placeBroader skos:prefLabel ?placeName .
    ?cho dct:spatial ?place ;
            dct:created ?year .
    ?place skos:broader ?placeBroader .
    } 
    LIMIT 50000
`;

runQuery(url, query);

const timeLine = () => {
    let nodes = document.querySelectorAll('.timeline div')
    nodes.forEach(element => {
        let content = element.textContent;
        content = content.split("-")
        let selectedTime = {
            firstValue: content[0],
            secondValue: content[1]
        } 
        console.log(selectedTime)
    })
}

timeLine();