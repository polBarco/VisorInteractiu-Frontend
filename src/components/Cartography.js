// src/components/Cartography.js
import React, { useEffect, useState } from "react";

function Cartography() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchCartographyData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/cartography/1'); // Cambia a tu endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGeoData(data); // Guardar el primer registro
      } catch (error) {
        console.error('Error fetching cartography data:', error);
      }
    };

    fetchCartographyData();
  }, []);

  return (
    <div style={{
      position: "absolute",
      top: 10,
      left: 10,
      backgroundColor: "white",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      zIndex: 1000 // Asegúrate de que esté por encima del mapa
    }}>
      {geoData ? (
        <>
          <h3>Primer Registro:</h3>
          <p>Elemento: {geoData.element}</p>
          <p>Área (m²): {geoData.area_m2}</p>
          <p>Área (km²): {geoData.area_km2}</p>
        </>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default Cartography;







// import React, { useEffect } from 'react';

// const Cartography = ({ onDataReady }) => {
//     useEffect(() => {
//         const fetchCartography = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/api/cartography/1'); // Cambia el endpoint si es necesario
//                 const data = await response.json();

//                 // Mapea los datos al formato GeoJSON
//                 const coordinates = data.geom.coordinates[0].map(ring =>
//                     ring.map(coord => [coord[1], coord[0]])
//                 );

//                 const feature = {
//                     type: 'Feature',
//                     geometry: {
//                         type: 'MultiPolygon',
//                         coordinates: coordinates,
//                     },
//                     properties: {
//                         element: data.element,
//                     },
//                 };

//                 onDataReady(feature);
//             } catch (error) {
//                 console.error('Error fetching cartography data:', error);
//             }
//         };

//         fetchCartography();
//     }, [onDataReady]);

//     return null;
// };

// export default Cartography;