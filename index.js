const svg = d3.select('svg');

const rendermap = function (d3, topojson) {
    const worldMap = d3.geoNaturalEarth1(); //comes in different styles on d3
    const pathCreator = d3.geoPath().projection(worldMap);

    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathCreator({type: 'Sphere'}));

    d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
        .then(json => {
        console.log(json, json.objects.countries);
            const countries = topojson.feature(json, json.objects.countries);
            svg.selectAll('path')
            .data(countries.features)
                .enter()
                    .append('path')
                    .attr('d', pathCreator)
                    .attr('class', 'country')
        });
}(d3, topojson);
  
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
    LIMIT 5
`;

let results = [];

const runQuery = (url, query) => {
    // Call the url with the query attached, output data
    fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
    .then(res => res.json())
    .then(json => {
        results = json.results.bindings;
        console.log(results);
        svg.append('g').attr('class', 'circles')
        d3.selectAll('.circles')
            .data(results)
            .enter()
                .append('circle')
                .attr('cx', 50)
                .attr('cy', 50)
                .attr('r', 10)
    });
};
runQuery(url, query);