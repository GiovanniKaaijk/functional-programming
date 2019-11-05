//Github CMDA 
const url =
    "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-02/sparql";
//Note that the query is wrapped in es6 template strings to allow for easy copy pasting
const query = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?cho ?placeName ?year WHERE {
    ?place skos:prefLabel ?placeName .
    ?cho dct:spatial ?place ;
            dct:created ?year .
    } 
    LIMIT 5000
`;

let results = [];

const runQuery = (url, query) => {
    // Call the url with the query attached, output data
    fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
    .then(res => res.json())
    .then(json => {
        results = json.results.bindings;
        console.log(results);
    });
};
runQuery(url, query);