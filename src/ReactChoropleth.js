import React from 'react';
import Choropleth from 'react-leaflet-choropleth'
import districtData from './data/kerala_district'
import {
  Circle,
  CircleMarker,
  Map,
  Polygon,
  Polyline,
  Popup,
  Tooltip,
  Rectangle,
  TileLayer,
  GeoJSON,
} from 'react-leaflet';

const style = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}
const center = [10.3915668, 76.5221531]
export default function map(){
  console.log(districtData)
  const geoJSONStyle = {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      fillColor: '#fff2af',
    }
  const onEachFeature = (feature: Object, layer: Object) => {
    const popupContent = ` <Tooltip><p>Customizable Popups <br />with feature information.</p><pre>Borough: <br />${feature.properties.name}</pre></Tooltip>`
    layer.bindPopup(popupContent)
  }
  return (
  <Map center={center} zoom={8} minZoom={7}>
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    />
    <Choropleth
      data={{type: 'FeatureCollection', features: districtData.features}}
      valueProperty={(feature) => feature.properties.value}
      visible={(feature) => true}
      scale={['#b3cde0', '#011f4b']}
      steps={7}
      mode='e'
      style={style}
      onEachFeature={(feature, layer) => layer.bindPopup(feature.properties.label)}
    />
  </Map>
)}
