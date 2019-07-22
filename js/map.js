/**
 * Created by yevheniia on 15.06.19.
 */



var map = L.map('map').setView([49.35, 29.51], 6);


// var CartoDB_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
//     subdomains: 'abcd',
//     minZoom: 6,
//     maxZoom: 18
//
// }).addTo(map);

L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    subdomains: 'abcd',
    minZoom: 6,
    maxZoom: 18
}).addTo(map);


function getColor(d) {
    return d === 'Політична Партія Біла Церква разом' ? 'red' :
        d === 'політична партія Всеукраїнське об’єднання Батьківщина' ? '#e28671' :
            d === 'політична партія Всеукраїнське об’єднання Свобода'  ? 'red' :
                d === 'Політична Партія ГОЛОС'  ? 'orange' :
                    d === 'Політична партія Європейська Солідарність'   ? '#ca4c6e' :
                        d === 'політична партія Єдиний Центр'   ? 'red' :
                            d === 'Політична партія Об’єднання САМОПОМІЧ'   ? '#4fe6fc' :
                                d === 'Політична партія ОПОЗИЦІЙНА ПЛАТФОРМА – ЗА ЖИТТЯ'  ? 'blue' :
                                    d === 'Політична партія ОПОЗИЦІЙНИЙ БЛОК'  ? 'lightblue' :
                                        d === 'ПОЛІТИЧНА ПАРТІЯ СЛУГА НАРОДУ' ? "#7ade24":
                                            d === 'Самовисування' ? "#fae41a":
                                               'lightgrey';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.winners_party),
        weight: 1,
        opacity: 1,
        color: 'black',
        //dashArray: '3',
        fillOpacity: 0.7
    };
}


function whenClicked(d) {
    // e = event
    console.log(d.target.feature.properties.winners_party);
    // You can make your ajax call declaration here
    //$.ajax(...
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
        layer.bindPopup("<b>ВИБОРЧИЙ ОКРУГ № " + feature.properties.id + "<br>" + feature.properties.winners_name + "</b> <br>" + feature.properties.winners_info);

}

// var geojsonLayer = new L.GeoJSON.AJAX("data/okrugi_shp.geojson");
var geojsonLayer = new L.GeoJSON.AJAX("data/all_tvo_with_result.geojson", { style: style,  onEachFeature: onEachFeature} );

geojsonLayer.addTo(map);









