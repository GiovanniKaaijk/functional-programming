let string = `
Geen studieschuld
1000-5000
Geen studieschuld
10000-15000
Geen studieschuld
Meer dan 25000
Geen studieschuld
Geen studieschuld
1000-5000
Geen studieschuld
Geen studieschuld
Geen studieschuld
1000-5000
Geen studieschuld
Geen studieschuld
Geen studieschuld
15000-20000
Geen studieschuld
1000-5000
20000-25000
Geen studieschuld
5000-10000
5000-10000, 15000-20000
Geen studieschuld
5000-10000
5000-10000
Geen studieschuld
Geen studieschuld
Geen studieschuld
15000-20000
10000-15000
Geen studieschuld
Geen studieschuld
Meer dan 25000
1000-5000
1000-5000
5000-10000
Geen studieschuld
5000-10000
20000-25000
10000-15000
15000-20000
Geen studieschuld
Geen studieschuld
Geen studieschuld
10000-15000
15000-20000
Meer dan 25000
Geen studieschuld
Geen studieschuld
1000-5000
Geen studieschuld
1000-5000
1000-5000
5000-10000
5000-10000
10000-15000
10000-15000
1000-5000
Meer dan 25000
5000-10000
5000-10000
15000-20000
10000-15000
20000-25000

20000-25000
20000-25000
Geen studieschuld
Meer dan 25000
15000-20000

1000-5000
15000-20000
10000-15000
5000-10000
15000-20000
Geen studieschuld
Meer dan 25000


Geen studieschuld

`
let stringArray = string.split("\n");
let newArray = [];

for(let thisString of stringArray){
    if(thisString.includes("Geen studieschuld")) {
        newArray.push(thisString.replace("Geen studieschuld", 0))
    } else if (thisString.includes("Meer dan 25000")) {
        newArray.push('25000+')
    } else if (thisString.length > 0) {
        let currentItem = thisString.split("-")
            .map(item => parseInt(item))
            .reduce((val1, val2) => (val1 + val2)/2);
        newArray.push(currentItem)
    }
}
newArray = newArray.join("\n");

// function filterData(string, oldValue, newValue) {
//     return string.map(currentString => currentString.replace(oldValue, newValue))
// }
// filterData(stringArray, 'Geen studieschuld', 0);


let string2 = `
Muziek maken; muziek produceren; uitgaan met vrienden
Drummen; Gamen; Chillen
Fitness; Voetbal; Tennis; Uitgaan; Tekenen
Films, muziek, games
Feesten ; borrelen ; netflixen ; vakantie 
Schilderen; computeren
Voetbal; Gamen; Bioscoop;
gamen; netflix kijken; sporten
Hobbies zijn voor de delusionals
Hockey
Varen; zwemmen; pianospelen; dansen
Gamen
Gamen, uitgaan
handbal
Sporten; muziek luisteren; series kijken; films kijken; met vrienden uithangen
Zingen; Gitaar spelen; Fotograferen
tennis
Muziek luisteren en zoeken
voetballen, boxen, tekenen, dansen, zingen
Tekenen; Serie's kijken; Drankje drinken
Dichten ; blowen
Series kijken ; Muziek luisteren ; Afspreken met mensen ; Festivallen bezoeken ; Lekker eten
Volleybal; graphic design; basketbal
Reizen; zwemmen; muziek luisteren
Netflix; borrelen; slapen
Gamen, afspreken met vrienden, uitgaan
vormgeven; gamen; tafeltennis; bioscoop
hockey;netflix;uitgaan
voetballen, feesten
Tekenen; muziek maken
Gamen; Lezen
Fotografie; plantenverzorging; slapen; festivalbezoeken
Voetbal
gamen; wandelen; fietsen door mooie gebieden; leuke dingen met vrienden; festival bezoeken; koffie drinken; veel planten verzamelen
muziek; slapen; films; chillen
Gamen, karten
netflix; festival; shoppen
voetbal;muziek;vakantie;strand;vrienden
Basketbal;uitgaan
Gamen;
Netflixen, vrienden meeten, reizen
Tekenen; gamen(nintendo); lezen; wandelen;  
Motorrijden;Gamen
Series kijken; Sporten; Lezen
Graffiti, snowboarden; films kijken; koken; reizen
Honkbal; Auto's; 
Voetballen;netflixen:fifa
Fitness, 
Gamen; Serie kijken; terrass pakken
Voetbal, Gamen, Design, Schoenen verzamelen
Series kijken; Tekenen
Fotografie;DJ
Coderen; Tennis; Voetbalwedstrijden analyseren
Netflix; Tekenen; Eten
Wielrennen; Voetballen; Gitaarspelen
voetbal, gezelligheid, kleding
Films en series
slapen, films kijken
Chillen, sporten, uitgaan
Schilderen en winkelen
Tekenen; ukelele spelen; schilderen; koken; bakken; haken; films; video's maken; fotografie
rollerskaten;snowboarden;tekenen;tv kijken;drankjes doen
Muziek;Games;
relaxen;hockey;biertjedrinken
bier drinken; muziek luisteren; sporten;
tekenen; voetballen 
Sporten;computeren
skateboarden, fotograferen, filmen, drummen
Chillen
vliegvissen; programmeren; reizen; netflix; dansen; uit gaan; wandelen
Netflix, fitness
gamen; leven
Tekenen, gamen, lezen, schrijven
pianospelen; films kijken; simsen; voetballen; tennissen; sporten
eten, bios pakken, muziek luisteren, dansen op festivals, rijden
Lopen
Gitaar spelen; gamen; waterpolo; wandelen; reizen
Skien, surfen, kitesurfen, wielrennen
Voetbal;Mountainbiking;Computer-hardware;Handel in technologie;Video-gamen;Meubel-restoraties;Sci-Fi boeken lezen;Japanse cultuur;


Games, tekenen, gitaar, muziek maken
`
// /\w*;\w*\b|\w*;/g
function removeSpace(stringArray) {
    stringArray.map(current => { 
        current = current.split(";").map(stringItem => stringItem.trim());
        for(let i=0; i<current.length -1 ;i++) {
            current[i] = current[i] + ';';
        }
    })
    return stringArray.join("\n")
}


let newStringArray = string2.split("\n").map(current => current.replace(/,/g, ";"))//.join("\n");
newStringArray = removeSpace(newStringArray);
console.log(newStringArray);

//console.log(newStringArray);
