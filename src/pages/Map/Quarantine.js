/* eslint-disable no-console */
/* globals google */
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'


const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env
const chamonixCenter = { lat: 45.923183187683215, lng: 6.869751360383987 }


// eslint-disable-next-line one-var, one-var-declaration-per-line
let map, marker, bufferCircle, infowindow


function setMarker(latLng, includeMarker = true) {
  if (includeMarker) marker.setPosition(latLng)
  bufferCircle.setCenter(latLng)
  map.panTo(latLng)

  const elevator = new google.maps.ElevationService()
  elevator.getElevationForLocations({ locations: [latLng] }, (results, status) => {
    if (status === 'OK' && results[0] && results[0].elevation) {
      infowindow.setContent(`<strong>Elevation:</strong> ${Math.ceil(results[0].elevation)}m`)
      infowindow.open(map, marker)
    } else {
      console.log('Elevation service failed due to:', status)
    }
  })
}


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


function addMarker(geo) {
  const centre = new google.maps.LatLng(geo.lat, geo.lng)

  // Drop a pin at the user location
  marker = new google.maps.Marker({
    position: centre,
    map,
    animation: google.maps.Animation.DROP,
    draggable: true,
    title: 'This is you!',
  })

  // Create a 1km circle around the user
  bufferCircle = new google.maps.Circle({
    center: centre,
    radius: 10000, // meters
    strokeColor: '#61a0e9',
    strokeOpacity: 1,
    strokeWeight: 1,
    fillColor: '#61a0e9',
    fillOpacity: 0.4,
    map,
    visible: false,
  })

  infowindow = new google.maps.InfoWindow({
    content: '<strong>Your location</strong><br>You can drag me!',
  })
  setTimeout(() => {
    infowindow.open(map, marker)
    bufferCircle.setVisible(true)
  }, 600)

  // Move the circle after moving the pin
  google.maps.event.addListener(marker, 'dragend', event => {
    console.log('New pos', event.latLng.lat(), event.latLng.lng())
    setMarker(event.latLng, true)
  })
}


async function main(mapContainer) {
  map = new google.maps.Map(mapContainer, {
    zoom: 11,
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

  addMarker(geo)
}


function Quarantine() {
  const [address, setAddress] = useState('')
  const mapContainer = useRef()
  const geocoderRef = useRef()

  const lockdown = new Date(2020, 11, 15)
  const difference = Date.now() - lockdown.getTime()
  const dayOfLockdown = Math.ceil(difference / (1000 * 3600 * 24))


  useEffect(() => {
    if (window.initQuarantineMap || !mapContainer.current) return
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initQuarantineMap`
    script.defer = true
    window.initQuarantineMap = () => {
      geocoderRef.current = new google.maps.Geocoder()
      main(mapContainer.current)
        .catch(err => console.log('Failed:', err))
    }
    document.head.appendChild(script)
  }, [mapContainer])

  function onSubmit(evt) {
    evt.preventDefault()
    if (!geocoderRef.current) return
    geocoderRef.current.geocode({ address, region: 'FR' }, (results, status) => {
      if (status !== 'OK' || !results[0]) return
      setMarker(results[0].geometry.location)
    })
  }

  return (
    <div>
      <div className="space-between">
        <h1>Lockdown map</h1>
        <h1>
          Day <strong>{dayOfLockdown}</strong> of
          {' '}<Link to="/curfew/am-i-allowed-outside">curfew</Link>
        </h1>
      </div>

      <div className="box box--padded box--row space-between lockdown">
        <div className="lockdown__text">
          <p>
            This is an interactive map where you can drag
            {' '}the pin and the circle has a 10km.
          </p>
          <strong>Update:</strong>
          {' '}As there is a new curfew you can check
          {' '}<Link to="/curfew/am-i-allowed-outside">here</Link>
          {' '}if you are allowed outside
        </div>
        <form className="lockdown__form" onSubmit={onSubmit}>
          <label htmlFor="address">Address</label>
          <div className="lockdown__group">
            <input
              placeholder="Enter a french address"
              className="input"
              id="address"
              value={address}
              onChange={evt => setAddress(evt.target.value)}
            />
            <button type="submit" className="btn">Move marker</button>
          </div>
        </form>
      </div>

      <div className="quarantine-map" ref={mapContainer} />
    </div>
  )
}


export default Quarantine
