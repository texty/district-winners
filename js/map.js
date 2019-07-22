/**
 * Created by yevheniia on 15.06.19.
 */

var map;
if(window.innerWidth <= 800){
    map = L.map('map').setView([43.35, 29.51], 4);
}
if(window.innerWidth > 800){
    map = L.map('map').setView([49.35, 29.51], 6);
}

map.zoomControl.setPosition('bottomright');
map.attributionControl.setPosition('bottomleft');


//https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png  чорна
///https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png


L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Carto',
    minZoom: 4,
    maxZoom: 10
}).addTo(map);



//Шар з поточними виборами
var additionalLayer = new L.LayerGroup();


function getColor(d) {
    return d === 'Політична Партія Біла Церква разом' ? '#fb9a99' :
        d === 'політична партія Всеукраїнське об’єднання Батьківщина' ? '#fdae61' :
            d === 'політична партія Всеукраїнське об’єднання Свобода'  ? '#fb9a99' :
                d === 'Політична Партія ГОЛОС'  ? '#d53e4f' :
                    d === 'Політична партія Європейська Солідарність'   ? '#cab2d6' :
                        d === 'політична партія Єдиний Центр'   ? '#fb9a99' :
                            d === 'Політична партія Об’єднання САМОПОМІЧ'   ? '#fb9a99' :
                                d === 'Політична партія ОПОЗИЦІЙНА ПЛАТФОРМА – ЗА ЖИТТЯ'  ? '#66c2a5' :
                                    d === 'Політична партія ОПОЗИЦІЙНИЙ БЛОК'  ? '#a6cee3' :
                                        d === 'ПОЛІТИЧНА ПАРТІЯ СЛУГА НАРОДУ' ? "#a6d96a":
                                            d === 'Самовисування' ? "#ffffbf":
                                               'white';
}


function style(feature) {
    return {
        fillColor: getColor(feature.properties.winners_party),
        weight: 1,
        opacity: 1,
        color: 'grey',
        //dashArray: '3',
        fillOpacity: 1
    };
}

function onEachFeature(feature, layer) {
    if(feature.properties.winners_name != null){
        layer.bindPopup("<div style='display:grid; grid-template-columns: auto 100px;'>" +
            "<div><b>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "<br>" +
            feature.properties.winners_name + "</b> <br>" +
            feature.properties.winners_info +  "<br></div>" +
            "<image class='photo' src='" + feature.properties.winners_image + "'/>"

        );
    } else {
        layer.bindPopup("<b>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "<br>"+
                "Вибори не проводились. Окупована територія"
        )
    }
}

var geojsonLayer = new L.GeoJSON.AJAX("data/all_tvo_with_result.geojson", { style: style,  onEachFeature: onEachFeature} );

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Кольорами позначено:</h4>";
    div.innerHTML += '<i style="background: #a6d96a"></i><span>Слуга народу</span><br>';
    div.innerHTML += '<i style="background: #ffffbf"></i><span>Самовисуванці</span><br>';
    div.innerHTML += '<i style="background: #66c2a5"></i><span>Оппозиційна платформа - За життя</span><br>';
    div.innerHTML += '<i style="background: #fdae61"></i><span>Батьківщина</span><br>';
    div.innerHTML += '<i style="background: #cab2d6"></i><span>Європейська солідарність</span><br>';
    div.innerHTML += '<i style="background: #d53e4f"></i><span>Голос</span><br>';
    div.innerHTML += '<i style="background: #a6cee3"></i><span>Оппозиційний блок</span><br>';
    div.innerHTML += '<i style="background: #fb9a99"></i><span>Інші</span><br>';


    return div;
};



legend.addTo(map);
geojsonLayer.addTo(additionalLayer);
additionalLayer.addTo(map);



/*  Шар з тими, хто пройшов/пролетів*/

var old_rada = new L.LayerGroup();

function getColor_oldrada(d) {
    return d === 'true' ? '#ffffbf' :
                d === 'false' ? '#a6d96a' :
                    'white';
}


function style_oldrada(feature) {
    return {
        fillColor: getColor_oldrada(feature.properties.deputes_14_exit),
        weight: 0.5,
        opacity: 1,
        color: 'grey',
        //dashArray: '3',
        fillOpacity: 1
    };
}

function onEachFeature_oldrada(feature, layer) {
    layer.bindPopup("<b>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "<br>" + feature.properties.deputes_14_name + "</b>");
}

var legend_oldrada = L.control({position: 'bottomleft'});

legend_oldrada.onAdd = function () {
    var div = L.DomUtil.create("div", "legend_oldrada");
    div.innerHTML += "<h4>Кольорами позначено:</h4>";
    div.innerHTML += '<i style="background: #a6d96a"></i><span>Втримались</span><br>';
    div.innerHTML += '<i style="background: #ffffbf"></i><span>Не втримались</span><br>';
    return div;
};


//депутати 2014 року
var geojsonLayer_oldrada = new L.GeoJSON.AJAX("data/all_tvo_2014.geojson", { style: style_oldrada, onEachFeature: onEachFeature_oldrada} );
geojsonLayer_oldrada.addTo(old_rada);

document.getElementById('winners').style.background = "#C5E1A5";


/* Переключення між кнопками */


const winners = document.getElementById('winners');
winners.addEventListener('click', function(e) {
    document.getElementById('winners').style.background = "#C5E1A5";
    // document.getElementById('winners').style.color = "white";
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
    document.getElementById('losers').style.background = "#C5E1A5";
    // document.getElementById('losers').style.color = "white";
    document.getElementById('winners').style.background = "linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%)";
    document.getElementById('winners').style.color = " #666666";
    map.removeControl(legend);
    legend_oldrada.addTo(map);



    additionalLayer.remove(geojsonLayer);
    geojsonLayer_oldrada.addTo(old_rada);
    old_rada.addTo(map);

});
