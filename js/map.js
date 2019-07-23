/**
 * Created by yevheniia on 15.06.19.
 */

var map;
if(window.innerWidth <= 800){
    map = L.map('map').setView([48, 29.51], 4);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by Carto',
        minZoom: 4,
        maxZoom: 10
    }).addTo(map);
}
if(window.innerWidth > 800){
    map = L.map('map').setView([49.35, 29.51], 6);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by Carto',
        minZoom: 6,
        maxZoom: 10
    }).addTo(map);
}

map.scrollWheelZoom.disable();
map.zoomControl.setPosition('topright');
map.attributionControl.setPosition('bottomleft');


//https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png  чорна
///https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png


L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Carto',
    minZoom: 6,
    maxZoom: 10
}).addTo(map);



//Шар з поточними виборами
var additionalLayer = new L.LayerGroup();


function getColor(d) {
    return d === 'Політична Партія Біла Церква разом' ? '#fb9a99' :
        d === 'політична партія Всеукраїнське об’єднання Батьківщина' ? 'red' :
            d === 'політична партія Всеукраїнське об’єднання Свобода'  ? '#fb9a99' :
                d === 'Політична Партія ГОЛОС'  ? '#fdae61' :
                    d === 'Політична партія Європейська Солідарність'   ? '#cab2d6' :
                        d === 'політична партія Єдиний Центр'   ? '#fb9a99' :
                            d === 'Політична партія Об’єднання САМОПОМІЧ'   ? '#fb9a99' :
                                d === 'Політична партія ОПОЗИЦІЙНА ПЛАТФОРМА – ЗА ЖИТТЯ'  ? '#0093C3' :
                                    d === 'Політична партія ОПОЗИЦІЙНИЙ БЛОК'  ? '#00BEFF' :
                                        d === 'ПОЛІТИЧНА ПАРТІЯ СЛУГА НАРОДУ' ? "#a6d96a":
                                            d === 'Самовисування' ? "#DEE3FB":
                                               'white';
}

//#ffffbf
function style(feature) {
    return {
        fillColor: getColor(feature.properties.winners_party),
        weight: 1,
        opacity: 0.5,
        color: '#666666',
        //dashArray: '3',
        fillOpacity: 1
    };
}

function onEachFeature(feature, layer) {
    if(feature.properties.winners_name != null){
        layer.bindPopup("<span style='font-size:15px; font-weight: 800'>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "</span><br>" +
            "<span style='font-size:15px; font-weight: 800'>" +feature.properties.winners_name + "</span> <br><br>" +
            "<span style='font-size:15px; font-weight: 800; color:red'>" + feature.properties.winners_percent + "% голосів</span> <br><br>" +
            "<div style='display:grid; grid-template-columns: auto 100px;'><div>" +
            feature.properties.winners_info +  "<br></div>" +
            "<image class='photo' src='" + feature.properties.winners_image + "'/></div>"

        );
    } else {
        layer.bindPopup("<b>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "<br>"+
                "Окупована територія"
        )
    }
}

var geojsonLayer = new L.GeoJSON.AJAX("data/all_tvo_with_result.geojson", { style: style,  onEachFeature: onEachFeature} );

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: #a6d96a"></i><span>Слуга народу</span><br>';
    div.innerHTML += '<i style="background: #E6EFFF"></i><span>Самовисуванці</span><br>';
    div.innerHTML += '<i style="background: #0093C3"></i><span>ОП - За життя</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>Батьківщина</span><br>';
    div.innerHTML += '<i style="background: #cab2d6"></i><span>ЄС</span><br>';
    div.innerHTML += '<i style="background: #fdae61"></i><span>Голос</span><br>';
    div.innerHTML += '<i style="background: #00BEFF"></i><span>Опоблок</span><br>';
    div.innerHTML += '<i style="background: #fb9a99"></i><span>Інші</span><br>';


    return div;
};



legend.addTo(map);
geojsonLayer.addTo(additionalLayer);
additionalLayer.addTo(map);



/*  Шар з тими, хто пройшов/пролетів*/

var old_rada = new L.LayerGroup();

function getColor_oldrada(d) {
    return d === 'true' ? '#F19AAC' :
                d === 'false' ? '#E6EFFF' :
                    'white';
}


function style_oldrada(feature) {
    return {
        fillColor: getColor_oldrada(feature.properties.deputes_14_exit),
        weight: 1,
        opacity: 0.5,
        color: '#666666',
        //dashArray: '3',
        fillOpacity: 1
    };
}

function onEachFeature_oldrada(feature, layer) {

    if(feature.properties.deputes_14_name != "NA" && feature.properties.deputes_14_name != null && feature.properties.deputes_14_exit === "true"){
        layer.bindPopup("<span style='font-size:15px; font-weight: 800'>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "</span><br>" +
            "<span style='font-size:15px; font-weight: 800'>" +feature.properties.deputes_14_name + "</span><br><br>" +
            "<span style='font-size:15px; font-weight: 800; color:red'> ПРОГРАВ </span> <br><br>" +
            "<div style='display:grid; grid-template-columns: auto 100px;'><div>" +
            feature.properties.deputes_14_info +  "<br></div>" +
            "<image class='photo' src='" + feature.properties.deputes_14_image + "'/></div>"

        );
    } else if(feature.properties.deputes_14_name != "NA" && feature.properties.deputes_14_name != null && feature.properties.deputes_14_exit === "false"){
        layer.bindPopup("<span style='font-size:15px; font-weight: 800'>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "</span><br>" +
            "<span style='font-size:15px; font-weight: 800'>" +feature.properties.deputes_14_name + "</span><br><br>" +
            "<span style='font-size:15px; font-weight: 800; color:red'> ВИГРАВ </span> <br><br>" +
            "<div style='display:grid; grid-template-columns: auto 100px;'><div>" +
            feature.properties.deputes_14_info +  "<br></div>" +
            "<image class='photo' src='" + feature.properties.deputes_14_image + "'/></div>"

        );
    } else if(feature.properties.deputes_14_name === "NA"){
        layer.bindPopup("<span style='font-size:15px; font-weight: 800'>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "</span><br>" +
            "<span style='font-size:15px; font-weight: 800'>"+ titleCase(feature.properties.deputes_14_joinName) + "</span></b>" + "<br><br>"+
            "<span style='font-size:15px; font-weight: 800; color:red'> НЕ ВИСУВАВСЯ </span> <br><br>"
        );

    }  else if(feature.properties.deputes_14_name === null) {
        layer.bindPopup("<b>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "<br>"+
            "Окупована територія"
        )
    }
}

var legend_oldrada = L.control({position: 'bottomleft'});

legend_oldrada.onAdd = function () {
    var div = L.DomUtil.create("div", "legend_oldrada");
    div.innerHTML += '<i style="background: #F19AAC"></i><span>Попрощався з округом</span><br>';
    div.innerHTML += '<i style="background: #E6EFFF"></i><span>Залишився на окрузі</span><br>';

    return div;
};


//депутати 2014 року
var geojsonLayer_oldrada = new L.GeoJSON.AJAX("data/all_tvo_2014.geojson", { style: style_oldrada, onEachFeature: onEachFeature_oldrada} );
geojsonLayer_oldrada.addTo(old_rada);

document.getElementById('winners').style.background = "#08B930";
document.getElementById('losers').style.background = "linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)";
document.getElementById('winners').style.color = "white";



/* Переключення між кнопками */


const winners = document.getElementById('winners');
winners.addEventListener('click', function(e) {
    document.getElementById('winners').style.background = "#08B930";
    document.getElementById('winners').style.color = "white";
    document.getElementById('losers').style.background = "linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)";
    document.getElementById('losers').style.color = " #666666";
    map.removeControl(legend_oldrada);
    legend.addTo(map);

    additionalLayer.remove(geojsonLayer);
    geojsonLayer.addTo(additionalLayer);
    additionalLayer.addTo(map);
    // additionalLayer.addTo(map);
    old_rada.remove(geojsonLayer_oldrada);

});

const losers = document.getElementById('losers');
losers.addEventListener('click', function(e) {
    document.getElementById('losers').style.background = "#F19AAC";
    document.getElementById('losers').style.color = "white";
    document.getElementById('winners').style.background = "linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)";
    document.getElementById('winners').style.color = "#666666";
    map.removeControl(legend);
    legend_oldrada.addTo(map);



    additionalLayer.remove(geojsonLayer);
    geojsonLayer_oldrada.addTo(old_rada);
    old_rada.addTo(map);

});


function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

