import React from 'react';
import { Circle } from 'react-leaflet';

export default function PopCircle(props){

    const initMarker = ref => {
      if (ref) {
        ref.leafletElement.openPopup()
      }
    }
  
    return <Circle ref={initMarker} {...props}/>
  }