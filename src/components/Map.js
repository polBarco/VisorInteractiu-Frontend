import React from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Asegúrate de que la URL sea accesible
    iconSize: [25, 41], // Tamaño del icono
    iconAnchor: [12, 41], // Posición del ancla
});

const Map = ({ geoData }) => {
    console.log("geoData recibido en Map:", geoData); // Verifica la estructura de geoData

    return (
        <MapContainer
            center={[41.3851, 2.1734]} // Centra el mapa en Cataluña por defecto
            zoom={8} // Ajusta el zoom para ver Cataluña
            className="map-container"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Renderizar cada polígono en el MultiPolygon solo si `geoData` tiene la estructura correcta */}
            {geoData && geoData.length > 0 && geoData.map((coordinate, index) => (
                <Marker
                    key={index}
                    position={coordinate} // Ya en formato [latitud, longitud]
                    icon={customIcon}
                >
                    <Popup>
                        Coordenadas: [{coordinate[0]}, {coordinate[1]}]
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
