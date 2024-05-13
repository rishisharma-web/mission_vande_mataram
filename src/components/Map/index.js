import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css';
import { parseCSV } from '../../utils/parseCSV';
import { parsePortsCSV } from '../../utils/parsePortsCSV';
import shipData from '../../data/geo_stats_data_7_days.csv';

mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtcmlzaGkiLCJhIjoiY2x3MHdzNWhwMDY2djJscXM5djZsaDZ6byJ9.xk72G2aD10QenONknYE1cg';

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [portLocations, setPortLocations] = useState([]);

  useEffect(() => {
    parseCSV(shipData, setParsedData);
    parsePortsCSV(setPortLocations);
  }, []);


  useEffect(() => {
    if (parsedData.length > 0 && portLocations.length > 0 && !map) {
      const newMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [77.888, 29.8543],
        zoom: 5,
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      newMap.on('load', () => {
        newMap.addSource('ships', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: parsedData.map((row) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(row.location_longitude), parseFloat(row.location_latitude)],
              },
              properties: {
                title: row.site_name,
              },
            })),
          },
        });

        newMap.addLayer({
          id: 'ships',
          type: 'circle',
          source: 'ships',
          paint: {
            'circle-radius': 7,
            'circle-color': 'red',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'white',
          },
        });

        // Add port markers
        newMap.addSource('ports', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: portLocations.map((port) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(port.geo_location_longitude), parseFloat(port.geo_location_latitude)],
              },
              properties: {
                title: port.port_name,
              },
            })),
          },
        });

        newMap.addLayer({
          id: 'ports',
          type: 'circle',
          source: 'ports',
          paint: {
            'circle-radius': 5, // Reduced size of purple port markers
            'circle-color': 'purple',
            'circle-stroke-width': 2,
            'circle-stroke-color': 'white',
          },
        });

        newMap.on('mouseenter', 'ships', (e) => {
          const shipName = e.features[0].properties.title;
          
          popup.setLngLat(e.lngLat).setHTML(`<div>${shipName}</div>`).addTo(newMap);
        });

        newMap.on('mouseleave', 'ships', () => {
          popup.remove();
        });

        // Add mouseover/mouseout event handlers for port markers
        newMap.on('mouseenter', 'ports', (e) => {
          const portName = e.features[0].properties.title;
          popup.setLngLat(e.lngLat).setHTML(`<div>${portName}</div>`).addTo(newMap);
        });

        newMap.on('mouseleave', 'ports', () => {
          popup.remove();
        });
      });

      setMap(newMap);
    }
  }, [parsedData, portLocations]);

  useEffect(() => {
    const cleanup = () => {
      if (map) {
        map.off('mouseenter', 'ships');
        map.off('mouseleave', 'ships');
        map.off('mouseenter', 'ports');
        map.off('mouseleave', 'ports');
        map.remove();
      }
    };
    return cleanup;
  }, [map]);

  return <div ref={mapContainerRef} style={{ height: '100vh' }} />;
};

export default Map;
