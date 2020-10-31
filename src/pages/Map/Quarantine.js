/* eslint-disable no-console */
/* globals google */
import React, { useEffect, useRef } from 'react'


const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env
const chamonixCenter = { lat: 45.923183187683215, lng: 6.869751360383987 }


function getLocation() {
  return new Promise(resolve => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0,
      })
    } else {
      console.log('Geolocation is not supported by this browser.')
      resolve(null)
    }
  })
}


function addMarker(map, geo) {
  const centre = new google.maps.LatLng(geo.lat, geo.lng)

  // Drop a pin at the user location
  const marker = new google.maps.Marker({
    position: centre,
    map,
    animation: google.maps.Animation.DROP,
    draggable: true,
    title: 'This is you!',
  })

  // Create a 1km circle around the user
  const bufferCircle = new google.maps.Circle({
    center: centre,
    radius: 1000, // meters
    strokeColor: '#61a0e9',
    strokeOpacity: 1,
    strokeWeight: 1,
    fillColor: '#61a0e9',
    fillOpacity: 0.4,
    map,
    visible: false,
  })

  setTimeout(() => {
    const infowindow = new google.maps.InfoWindow({
      content: '<strong>Your location</strong><br>You can drag me!',
    })
    infowindow.open(map, marker)
    setTimeout(() => infowindow.close(), 5000)
    bufferCircle.setVisible(true)
  }, 600)

  // Move the circle after moving the pin
  google.maps.event.addListener(marker, 'dragend', event => {
    console.log('New pos', event.latLng.lat(), event.latLng.lng())
    bufferCircle.setCenter(event.latLng)
  })
}


async function main(mapContainer) {
  const map = new google.maps.Map(mapContainer, {
    zoom: 14,
    center: chamonixCenter,
    styles: [{
      featureType: 'poi.attraction',
      stylers: [{ visibility: 'off' }],
    }],
  })

  const pos = await getLocation()
  const geo = (pos && pos.coords && pos.coords.latitude)
    ? { lat: pos.coords.latitude, lng: pos.coords.longitude }
    : chamonixCenter
  console.log('Pos', pos, 'Geo', geo)

  addMarker(map, geo)
}


function Quarantine() {
  const mapContainer = useRef()

  useEffect(() => {
    if (window.initQuarantineMap || !mapContainer.current) return
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initQuarantineMap`
    script.defer = true
    window.initQuarantineMap = () => {
      main(mapContainer.current)
        .catch(err => console.log('Failed:', err))
    }
    document.head.appendChild(script)
  }, [mapContainer])

  return (
    <div>
      <div className="space-between">
        <h1>Map</h1>
        {/* <div>
          <input className="input" placeholder="Address" />
        </div> */}
      </div>
      <div className="quarantine-map" ref={mapContainer} />
    </div>
  )
}


export default Quarantine
