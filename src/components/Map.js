import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Popup, Polygon, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./css/Map.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


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

    "Barra rompientes": "#ff4500",
    "DB rompientes": "#ffd700",
    "Barra seca": "#1e90ff",
    "DB seca": "#8b4513",

    "LitoralCellsCollection": "#fc0505",
    "SedimentTransportCollection": "#1f77b4",
    "Era5NodeCollection": "#ff7f0e",
    "RiverCollection": "#0000ff",

    "East": "#ffd700",
    "North": "#1e90ff",
    "South": "#32cd32",
    "West": "#ff8c00",
};

const getCustomIcon = (color) => {
    return new L.DivIcon({
        html: `<i class="fa-solid fa-location-dot" style="font-size: 24px; color: ${color}; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"></i>`,
        className: 'custom-div-icon',
        iconSize: [10, 10],
    });
};

const Map = ({ geoData, element }) => {
    console.log("geoData recibido en Map:", geoData); 

    const [zoomLevel, setZoomLevel] = useState(6); // Initial zoom level
    const shuffledGeoDataRef = useRef([]); // Ref to store shuffled geoData
    const uniqueHurricaneColors = useRef({});  // Map to assign unique colors for hurricane

    /* Update zoom level */
    function ZoomHandler() {
        const map = useMapEvents({
            zoomend: () => {
                setZoomLevel(map.getZoom());
            },
        });
        return null;
    }

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

            <ZoomHandler />

            {/* Render geoData */}
            {geoData && geoData.length > 0 && geoData.map((feature, index) => {
                const { coordinates, element, type } = feature;

                if (!coordinates || coordinates.length === 0) {
                    return null; 
                }

                if (type === "CartographyCollection") {
                    const { area_m2, area_km2, longitud, perimet_km } = feature;
                    const color = elementColors[element]; 

                    /* Shuffle the data randomly */
                    if (shuffledGeoDataRef.current.length === 0) {
                        shuffledGeoDataRef.current = geoData
                            .map((item, index) => ({ ...item, originalIndex: index })) 
                            .sort(() => Math.random() - 0.5); // Shuffle the data
                    }

                    /* Calculate the centroid of the polygon */
                    const latSum = coordinates.reduce((acc, point) => acc + point[0], 0);
                    const lonSum = coordinates.reduce((acc, point) => acc + point[1], 0);
                    const centroid = [latSum / coordinates.length, lonSum / coordinates.length];

                    /* Calculate the visible markers */
                    const totalMarkers = shuffledGeoDataRef.current.length;
                    const maxZoomLevel = 12;

                    /* Calculate the initial percentage of markers to show */
                    const initialPercentage = 0.05;
                    const initialMarkers = Math.ceil(totalMarkers * initialPercentage);

                    /* Calculate the number of markers to show based on the zoom level */
                    let markersToShow = initialMarkers; 
                    if (zoomLevel > 6) {
                        markersToShow = Math.ceil((zoomLevel / maxZoomLevel) * totalMarkers); 
                    }
                    if (zoomLevel >= maxZoomLevel) {
                        markersToShow = totalMarkers; 
                    }

                    /* Select the visible elements */
                    const visibleMarkerIndices = new Set(
                        shuffledGeoDataRef.current
                            .slice(0, markersToShow) 
                            .map(item => item.originalIndex)
                    );

                    /* Determine if this marker should be displayed  */
                    const shouldShowMarker = visibleMarkerIndices.has(index);

                    return (
                        <React.Fragment key={index}>
                            {/* Render Polygon */}
                            <Polygon
                                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.4 }} 
                                positions={coordinates} 
                            >
                                <Popup>
                                    <strong>Element:</strong> {element} <br />
                                    <strong>Area (m2):</strong> {area_m2} <br />
                                    <strong>Area (km2):</strong> {area_km2} <br />
                                    <strong>Longitude:</strong> {longitud} <br />
                                    <strong>Perimeter (km):</strong> {perimet_km}
                                </Popup>
                            </Polygon>

                            {/* Marker center Polygon */}
                            {shouldShowMarker && (
                                <Marker
                                    position={centroid}
                                    icon={getCustomIcon(color)}
                                >
                                    <Popup>
                                        <strong>Element:</strong> {element} <br />
                                        <strong>Area (m2):</strong> {area_m2} <br />
                                        <strong>Area (km2):</strong> {area_km2} <br />
                                        <strong>Longitude:</strong> {longitud} <br />
                                        <strong>Perimeter (km):</strong> {perimet_km} <br />
                                        <strong>Coordinates:</strong> 
                                        <ul>
                                            {coordinates.map((coord, index) => (
                                                <li key={index}>
                                                    [{coord[0].toFixed(6)}, {coord[1].toFixed(6)}]
                                                </li>
                                            ))}
                                        </ul>
                                    </Popup>
                                </Marker>
                            )}
                        </React.Fragment>
                    );
                }

                else if (type === "D50Collection") {
                    const { name, d50 } = feature;

                    const color = elementColors[name];
    
                    return (
                        <React.Fragment key={index}>
                            <Marker
                                position={[coordinates[0], coordinates[1]]}
                                icon={getCustomIcon(color)}
                            >
                                <Popup>
                                    <strong>Name:</strong> {name} <br />
                                    <strong>D50</strong> {d50} <br />
                                    <strong>Coordinates:</strong> 
                                    <ul>
                                        <li>[{coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}]</li>
                                    </ul>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    )
                }

                else if (type === "LitoralCellsCollection") {
                    const { name, length, length_km, coord_xfin, coord_yfin, coord_xini, coord_yini, par_impar } = feature;
    
                    return (
                        <React.Fragment key={index}>
                            <Polyline
                                pathOptions={{ fillOpacity: 0.6 }} 
                                positions={coordinates} 
                            >
                                <Popup>
                                    <strong>Name:</strong> {name} <br />
                                    <strong>Length (m):</strong> {length} <br />
                                    <strong>Length (km):</strong> {length_km} <br />
                                    <strong>Par_impar:</strong> {par_impar} <br />
                                    <strong>Initial Coordinate:</strong> 
                                    <ul>
                                        <li>[{coord_xini.toFixed(6)}, {coord_yini.toFixed(6)}]</li>
                                    </ul>
                                    <strong>Final Coordinate:</strong> 
                                    <ul>
                                        <li>[{coord_xfin.toFixed(6)}, {coord_yfin.toFixed(6)}]</li>
                                    </ul>
                                </Popup>
                            </Polyline>

                            {coordinates.map((point, pointIndex) => {
                                const [lat, lng] = point;

                                /* Marker initial coordinate */
                                if (pointIndex === 0) {
                                    return (
                                        <Marker
                                            key={`start-${index}`}
                                            position={[lat, lng]}
                                            icon={getCustomIcon(elementColors[type])}
                                        >
                                            <Popup>
                                                <strong>Name:</strong> {name} <br />
                                                <strong>Length (m):</strong> {length} <br />
                                                <strong>Length (km):</strong>{length_km} <br />
                                                <strong>Par_impar:</strong> {par_impar} <br />
                                                <strong>Initial coordinate:</strong> 
                                                <ul>
                                                    <li>[{lat.toFixed(6)}, {lng.toFixed(6)}]</li>
                                                </ul>
                                            </Popup>
                                        </Marker>
                                    );
                                }

                                /* Marker final coordinate */
                                if (pointIndex === coordinates.length - 1) {
                                    return (
                                        <Marker
                                            key={`end-${index}`}
                                            position={[lat, lng]}
                                            icon={getCustomIcon(elementColors[type])}
                                        >
                                            <Popup>
                                                <strong>Name:</strong> {name} <br />
                                                <strong>Length (m):</strong> {length} <br />
                                                <strong>Length (km):</strong>{length_km} <br />
                                                <strong>Par_impar:</strong> {par_impar} <br />
                                                <strong>Final coordinate:</strong>
                                                <ul>
                                                    <li>[{lat.toFixed(6)}, {lng.toFixed(6)}]</li>
                                                </ul>
                                            </Popup>
                                        </Marker>
                                    );
                                }

                                return null;
                            })}
                        </React.Fragment>
                    );
                }

                else if (type === "SedimentTransportCollection") {
                    const { id, transport, percent } = feature;
    
                    return (
                        <React.Fragment key={index}>
                            <Marker
                                position={[coordinates[0], coordinates[1]]}
                                icon={getCustomIcon(elementColors[type])}
                            >
                                <Popup>
                                    <strong>ID:</strong> {id} <br />
                                    <strong>Transport</strong> {transport} <br />
                                    <strong>Percent</strong> {percent} <br />
                                    <strong>Coordinates:</strong>
                                    <ul>
                                        <li>[{coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}]</li>
                                    </ul>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    )
                }

                else if (type === "Era5NodeCollection") {
                    const { id } = feature;
                
                    return (
                        <React.Fragment key={index}>
                            <Marker
                                position={[coordinates[0], coordinates[1]]}
                                icon={getCustomIcon(elementColors[type])} 
                            >
                                <Popup>
                                    <strong>ID:</strong> {id} <br />
                                    <strong>Coordinates:</strong> 
                                    <ul>
                                        <li>[{coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}]</li>
                                    </ul>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                }

                else if (type === "HurricaneCollection") {
                    const { name, year, hurricaneType } = feature;

                    const colorPalette = ["#ff0000", "#02ba24", "#0000ff", "#800080", "#ffa500"];
                
                    /* Assign a unique color to each hurricane based on its name */
                    if (!uniqueHurricaneColors.current[name]) {
                        const currentLength = Object.keys(uniqueHurricaneColors.current).length;
                        uniqueHurricaneColors.current[name] = colorPalette[currentLength % colorPalette.length];
                    }
                
                    return (
                        <React.Fragment key={index}>
                            <Polyline
                                pathOptions={{
                                    color: uniqueHurricaneColors.current[name], 
                                    fillOpacity: 0.6,
                                }}
                                positions={coordinates}
                            >
                                <Popup>
                                    <strong>Name:</strong> {name} <br />
                                    <strong>Year:</strong> {year} <br />
                                    <strong>Type:</strong> {hurricaneType} <br />
                                </Popup>
                            </Polyline>
                        </React.Fragment>
                    );
                }

                else if (type === "RiversMozambiqueCollection") {
                    const { arcid, up_cells, region } = feature;

                    return (
                        <React.Fragment key={index}>
                            <Polyline
                                pathOptions={{
                                    color: elementColors[region],  
                                    fillOpacity: 0.6,
                                }}
                                positions={coordinates}
                            >
                                <Popup>
                                    <strong>Arc ID:</strong> {arcid} <br />
                                    <strong>Up Cells:</strong> {up_cells} <br />
                                    <strong>Region:</strong> {region}
                                </Popup>
                            </Polyline>
                        </React.Fragment>
                    );
                }

                // else if (type === "RiverCollection") {
                //     const { arcid, up_cells } = feature; 

                //     return (
                //         <React.Fragment key={index}>
                //             <Polyline
                //                 pathOptions={{
                //                     color: elementColors[type] || "blue",  
                //                     fillOpacity: 0.6,
                //                 }}
                //                 positions={coordinates}
                //             >
                //                 <Popup>
                //                     <strong>Arc ID:</strong> {arcid} <br />
                //                     <strong>Up Cells:</strong> {up_cells} 
                //                 </Popup>
                //             </Polyline>
                //         </React.Fragment>
                //     );
                // }
                    else {
                        console.warn("Tipo de elemento desconocido:", type);
                        return null;
                    }

            })}
        </MapContainer>
    );
};

export default Map;