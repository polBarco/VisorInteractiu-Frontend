// src/components/Map.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Cartography from './Cartography'; // Asegúrate de que esta ruta sea correcta

// Coordenadas de la Universidade SAVE
const position = [-24.7026, 34.7473];

function MapComponent() {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MapContainer center={position} zoom={10} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Universidade SAVE, Mozambique
          </Popup>
        </Marker>
      </MapContainer>
      {/* Renderiza Cartography aquí, que manejará la lógica de la API */}
      {/* <Cartography /> */}
    </div>
  );
}

export default MapComponent;





// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import Cartography from "./Cartography";

// // Coordenadas de la Universidade SAVE
// const position = [-24.7026, 34.7473];

// function MapComponent() {

//   const [geoData, setGeoData] = useState(null);

//   const handleDataReady = (data) => {
//       setGeoData(data);
//   };

//   return (
//     <MapContainer center={position} zoom={10} style={{ width: "100vw", height: "100vh" }}>
//       {/* TileLayer con el URL de OpenStreetMap */}
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {/* Componente para obtener los datos */}
//       <Cartography onDataReady={handleDataReady} />

//       {/* Renderizar la geometría recibida */}
//       {geoData && (
//         <GeoJSON
//           data={geoData}
//           style={{ color: 'brown', fillColor: 'lightbrown', weight: 1, fillOpacity: 0.5 }}
//         />
//       )}

//       {/* Ejemplo de algunos marcadores a lo largo de la costa */}
//       <Marker position={position}>
//         <Popup>
//           Universidade SAVE, Mozambique
//         </Popup>
//       </Marker>
//     </MapContainer>
//   );
// }

// export default MapComponent;
