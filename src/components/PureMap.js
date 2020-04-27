import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import geoLocation from '../data/geoLocation.js';
import indiaData from '../data/indiaData.json';

const center = [22.9734, 78.6569]
const style = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}

export default function MapContainer () {
  const[map,setMap] = useState();
  useEffect(()=>{
    L.map('map', {
      center: [49.8419, 24.0315],
      zoom: 16,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ]
    });
  },[])
  return (<div id="map"></div>)
}
