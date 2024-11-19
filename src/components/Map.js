import React from "react";
import { MapContainer, TileLayer, Popup, Polygon, Marker } from "react-leaflet";
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
    "Delta": "#9acd32",
};

const pinIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -15] 
});

const Map = ({ geoData, element }) => {
    console.log("geoData recibido en Map:", geoData); // Verifica la estructura de geoData

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


            {/* Renderizar los datos de geoData */}
            {geoData && geoData.length > 0 && geoData.map((feature, index) => {
                if (feature.element) {
                    const { coordinates, element } = feature;

                    if (!coordinates || coordinates.length === 0) {
                        return null; // Sin coordenadas, no renderizar 
                    }

                    const color = elementColors[element] || "#000000"; // Obtener el color según el elemento

                    // Calcular el centroide del polígono
                    const latSum = coordinates.reduce((acc, point) => acc + point[0], 0);
                    const lonSum = coordinates.reduce((acc, point) => acc + point[1], 0);
                    const centroid = [latSum / coordinates.length, lonSum / coordinates.length];

                    return (
                        <React.Fragment key={index}>
                            {/* Renderizar el Polígono */}
                            <Polygon
                                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.4 }} 
                                positions={coordinates} 
                            >
                                <Popup>
                                    Elemento: {element}
                                </Popup>
                            </Polygon>

                            {/* Añadir un marcador en el centro del polígono */}
                            <Marker
                                position={centroid}
                                icon={pinIcon}
                            >
                                <Popup>
                                    Elemento: {element} <br />
                                    Coordenadas: [{coordinates[0]}, {coordinates[1]}]
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                }

                else if (feature.name) {
                    const { name, d50, coordinates } = feature;

                    if (!coordinates || coordinates.length === 0) {
                        return null; 
                    }

                    return (
                        <React.Fragment key={index}>
                            {/* Añadir un marcador en el objeto */}
                            <Marker
                                position={[coordinates[0], coordinates[1]]}
                                icon={pinIcon}
                            >
                                <Popup>
                                    Name: {name} <br />
                                    D50: {d50} <br />
                                    Coordenadas: [{coordinates[0]}, {coordinates[1]}]
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    )
                }
                return null;
            })}
        </MapContainer>
    );
};

export default Map;