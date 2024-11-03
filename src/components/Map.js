import React from "react";
import { MapContainer, TileLayer, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";


const elementColors = {
    "Estuary": "#99ccff",
    "Rocky coast": "#666666",
    "Aeolionite": "#f2e394",
    "Sandy beach": "#ffe4b5",
    "Foredune": "#b2d8b2",
    "Barrier system": "#66b3ff",
    "Coral reef": "#ff7f50",
    "Island": "#228b22",
    "Coral fringe": "#e74c3c",
    "Ebb-flood delta": "#20b2aa",
    "Delta": "#9acd32"
};

// const createCustomIcon = (color) => {
//     return new L.DivIcon({
//         html: `
//             <div style="width: 30px; height: 30px; border: 3px solid ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
//                 <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" style="width: 20px; height: 20px;" />
//             </div>`,
//         className: "",
//         iconSize: [20, 20], // Tamaño del icono
//         iconAnchor: [10, 10] // Posición del ancla
//     });
// };

const Map = ({ geoData, element }) => {
    console.log("geoData recibido en Map:", geoData); // Verifica la estructura de geoData

    const color = elementColors[element] || "#000000";

    return (
        <MapContainer
            center={[-18.9004, 35.4016]} 
            zoom={6}
            className="map-container"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />


            {/* Renderizar cada polígono en `geoData` */}
            {geoData && geoData.length > 0 && geoData.map((feature, index) => {
                const { coordinates, element } = feature;

                if (!coordinates || coordinates.length === 0) {
                    return null; // Si no hay coordenadas, no renderizar nada
                }

                const color = elementColors[element] || "#000000"; // Obtener el color según el elemento

                return (
                    <Polygon
                        key={index}
                        pathOptions={{ color: color, fillColor: color, fillOpacity: 0.4 }} // Definir color y opacidad del polígono
                        positions={coordinates} // Asignar las coordenadas para dibujar el polígono
                    >
                        <Popup>
                            Elemento: {element} <br />
                            Coordenades: {coordinates}
                        </Popup>
                    </Polygon>
                );
            })}
        </MapContainer>
    );
};

export default Map;



// {/* Renderizar cada polígono en el MultiPolygon solo si `geoData` tiene la estructura correcta */}
// {geoData && geoData.length > 0 && geoData.map((coordinate, index) => (
//     <Marker
//         key={index}
//         position={coordinate} // Ya en formato [latitud, longitud]
//         icon={createCustomIcon(color)}
//     >
//         <Popup>
//             Element: {element} <br />
//             Coordenadas: [{coordinate[0]}, {coordinate[1]}]
//         </Popup>
//     </Marker>
// ))}