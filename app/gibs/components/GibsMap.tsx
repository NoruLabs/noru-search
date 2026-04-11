'use client';

import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix for default unconfigured map icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GibsMapProps {
  layer: string;
  date: string; // YYYY-MM-DD
}

const LAYER_CONFIG: Record<string, { format: string; tileMatrix: string; maxZoom: number }> = {
  'MODIS_Terra_CorrectedReflectance_TrueColor': {
    format: 'jpg',
    tileMatrix: 'GoogleMapsCompatible_Level9',
    maxZoom: 9
  },
  'MODIS_Terra_Land_Surface_Temp_Day': {
    format: 'png',
    tileMatrix: 'GoogleMapsCompatible_Level7',
    maxZoom: 7
  },
  'MODIS_Terra_Sea_Ice': {
    format: 'png',
    tileMatrix: 'GoogleMapsCompatible_Level7',
    maxZoom: 7
  },
  'MODIS_Terra_Aerosol': {
    format: 'png',
    tileMatrix: 'GoogleMapsCompatible_Level6',
    maxZoom: 6
  }
};

export default function GibsMap({ layer, date }: GibsMapProps) {
  // Base map - Blue Marble
  const baseMapUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/2023-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg';

  const activeConfig = layer !== 'none' ? LAYER_CONFIG[layer] : null;

  return (
    <MapContainer 
      center={[0, 0]} 
      zoom={3} 
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
      zoomControl={true}
    >
      <TileLayer
        url={baseMapUrl}
        attribution="NASA EOSDIS GIBS"
        maxZoom={8}
      />
      
      {activeConfig && (
        <TileLayer
          key={`${layer}-${date}`}
          url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/${activeConfig.tileMatrix}/{z}/{y}/{x}.${activeConfig.format}`}
          attribution="NASA EOSDIS GIBS"
          maxZoom={activeConfig.maxZoom}
          opacity={layer.includes('Thermal') || layer.includes('Temp') ? 1 : 0.7}
        />
      )}
    </MapContainer>
  );
}
