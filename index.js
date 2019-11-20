const zoom = d3.zoom();

const svg = d3.select('svg').append('g')
const g = d3.select('g');

const worldMap = d3.geoNaturalEarth1(); //natural earth gives a good realistic view of the map
const pathCreator = d3.geoPath().projection(worldMap);
const api = 'https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-02/sparql';
const playButton = document.querySelector('.play')
const currentSlider = document.querySelector('.current');

let state = {
    countryArray: [],
    cityArray: [],
    dataCount: [],
    highestCount: 0,
    uniqueNodes: [],
    currentTime: 0,
    nodeWidth: 0,
    timeFilter: {
        firstValue: 0,
        secondValue: 500
    }
}

//Create a div inside the parent group to show country name + object count
let tooltip = d3.select(".tooltip")
  .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")

// Fetch JSON with all capital cities + countries
const fetchCityToCountry = (fetchurl) => {
    fetch(fetchurl)
    .then(response => response.json())
    .then(json => {    
        state.cityArray = json;
    })
}
fetchCityToCountry('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-capital-city.json')

// Fetch map layout JSON + create an array containing unique countries
const rendermapLayout = (d3) => {     
    d3.json('https://enjalot.github.io/wwsd/data/world/world-110m.geojson')
        .then(json => {
            json.features.forEach((feature, i) => {
                state.countryArray.push(feature.properties.name);
                state.dataCount.push(feature)
                state.dataCount[i].properties.count = 0;
            });
        })
};
rendermapLayout(d3); 
// Used https://www.youtube.com/watch?v=Qw6uAg3EO64 to render the map. 
// I used this tutorial to get to know how to render a map. After i completed this tutorial, i changed it so that my own data get's rendered

// push unique values to array for the timeline later one
const pushToArray = function(element) {
    let node = element.textContent
    state.uniqueNodes.push(node)
}

// Take first + second value from timeline click to put in an array later on
const changeQuery = function() {
    let index = state.uniqueNodes.indexOf(this.textContent)
    state.currentTime = index
    currentSlider.style.left = state.nodeWidth * index + 'px';
    let content = state.uniqueNodes[index]
        content = content.split("-");
        let selectedTime = {
            firstValue: content[0],
            secondValue: content[1]
        }
        updateTime(selectedTime)
}


// Map zoom function
svg.call(zoom.on('zoom', () => {
    g.attr('transform', d3.event.transform);
}))

// Clean the date format from xxxx-xxxx to one number
const dateFormat = date => {
    date = date.split('-')
    date[1] = date[1].trim()
    date[0] = parseInt(date[0])
    date[1] = parseInt(date[1])
    date = Math.round((date[0] + date[1]) / 2)
}

// Change the city data to country
const changeCityToCountry = results => {
    results.forEach((result) => {
        if(!state.countryArray.includes(result.placeName)){
            state.cityArray.forEach((cityObject) => {
                if(cityObject.city == result.placeName){
                    result.placeName = cityObject.country;
                }
            });
        }
        if(!state.countryArray.includes(result.placeName)){
            let index = results.indexOf(result);
            results.splice(index, 1)
        }
    });
}
//check if any placename is equal to one of the countries, if so -> country count + 1
const countTracker = results => {
    state.dataCount.forEach(counter => {
        counter.properties.count = 0
    })
    state.highestCount = 0;
    results.forEach(result => {
        if(state.countryArray.includes(result.placeName)) {
            state.dataCount.forEach((counter) => {
                if(counter.properties.name == result.placeName){
                    counter.properties.count = counter.properties.count += 1;
                    if(counter.properties.count > state.highestCount) {
                        state.highestCount = counter.properties.count;
                    }
                }
            });
        }
    })
}
// Updates time filter
const updateTime = (time) => {
    state.timeFilter = {
        firstValue: time.firstValue,
        secondValue: time.secondValue
    }
    updateData()
}

// Returns the new query
const getQuery = () => {
    return `PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX gn: <http://www.geonames.org/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?cho ?placeName ?date WHERE {
        ?cho dct:spatial ?place .
        ?place skos:exactMatch/gn:parentCountry ?land .
        ?land gn:name ?placeName .
        ?cho dct:created ?date .
        FILTER(xsd:integer(?date) >= ${state.timeFilter.firstValue} && xsd:integer(?date) <= ${state.timeFilter.secondValue})
    } LIMIT 50000 `
}

// Render all elements on the SVG
const renderSVG = () => {
    g.append('path')
        .attr('class', 'sphere')
        .attr('d', pathCreator({type: 'Sphere'}));
    let scaleColor = d3.scaleLinear()
        .domain([0, (state.highestCount)])
        .range(['#ffffff', 'red']);
    g.selectAll('path')
    .data(state.dataCount) 
    .enter()
    .append('path')
        .attr('d', pathCreator)
        .attr('class', 'country')
        .style('stroke', 'black')
        .style('stroke-opacity', 0.2)
        .style('fill', "white")
        .on('mouseover', function() {
            d3.select(this)
                .style('stroke-opacity', 1)
        })
        .on('mouseout', function() {
            d3.select(this)
                .style('stroke-opacity', 0.2)
            tooltip.style("visibility", "hidden")
        })
        .on("click", (d) => { 
            tooltip
            .style("visibility", "visible")
            .text(d.properties.name + ': ' + d.properties.count + ' objecten')
        })
        .on("mousemove", (d) => {
            tooltip
            .style("top", (event.pageY-40)+"px")
            .style("left",(event.pageX-35)+"px")})
        .transition()
        .duration(300)
        .style('fill', (d) => scaleColor(d.properties.count));
        
        playButton.addEventListener('click', playTimeline)
}

// Run the SPAQRL query, render every element, create counts for the heatmap
const runQuery = (api, query) => {
    // Call the url with the query attached, output data
    fetch(api + "?query=" + encodeURIComponent(query) + "&format=json")
    .then(res => res.json())
    .then(json => {
        //change results placename to match more items in the following forEach. If item is not in city JSON -> delete
        let results = json.results.bindings;
        console.log(results)
        results.forEach((result, i) => {
            if(result.date.value.includes('-')) {
                dateFormat(result.date.value)
            }
            results[i] = {
                placeName: result.placeName.value,
                date: result.date.value
            }
        })
        changeCityToCountry(results)
        countTracker(results)
        renderSVG()
    })
};
runQuery(api, getQuery());

// Create eventlistener for every timeline object
const timeLine = () => {
    let nodes = document.querySelectorAll('.timeline p')
    let currentWidth = screen.width / nodes.length
    state.nodeWidth = currentWidth
    currentSlider.style.width = state.nodeWidth+'px'
    nodes.forEach(element => {
        pushToArray(element)
        element.addEventListener('click', changeQuery)
    })
}
timeLine();

// Updates data
async function updateData() {
    let newQuery = getQuery()

    await runNewQuery(api, newQuery)
    let scaleColor = d3.scaleLinear()
        .domain([0, (state.highestCount)])
        .range(['#ffffff', 'red']);
    svg.selectAll('g')
        .data(state.dataCount)
        .enter()
        .selectAll('.country')
        .transition()
        .duration(300)
        .style('fill', (d) => scaleColor(d.properties.count))
}

async function runNewQuery(api, query) {
    await fetch(api + "?query=" + encodeURIComponent(query) + "&format=json")
    .then(res => res.json())
    .then(json => {
        console.log(json.results.bindings)
        let results = json.results.bindings;
        results.forEach((result, i) => {
            if(result.date.value.includes('-')) {
                dateFormat(result.date.value)
            }
            results[i] = {
                placeName: result.placeName.value,
                date: result.date.value
            }
        })
        countTracker(results)
    })
}

const playTimeline = () => {
    callbackFn(0, callbackFn)
}

function callbackFn(index, callback) {
    currentSlider.classList.contains('active') ? null : currentSlider.classList.add('active')
    console.log(state.uniqueNodes[index]);
    let length = state.uniqueNodes.length
    state.currentTime != length-1 ?
        state.currentTime += 1 :
        state.currentTime = 0
    setTimeout(() => {
        currentSlider.style.left = state.nodeWidth * index + 'px';
    }, 300);
    
    let content = state.uniqueNodes[state.currentTime]
    content = content.split('-')
    console.log(content)
    let selectedTime = {
        firstValue: content[0],
        secondValue: content[1]
    }
    updateTime(selectedTime)
    setTimeout(() => {
        index < state.uniqueNodes.length-1
        ? callbackFn(index + 1, callback)
        : null;
    }, 1500);
}
