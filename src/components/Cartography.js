import React, { useEffect } from "react";

const Cartography = ({ element, onDataFetched }) => {
    useEffect(() => {
        const fetchCartographyData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cartography?element=${encodeURIComponent(element)}`);
                if (!response.ok) {
                    throw new Error("Error fetching cartography data");
                }

                const data = await response.json();
                console.log("Datos de la API:", data); // Verifica la estructura completa de los datos

                // Extrae y convierte todas las coordenadas de los polígonos si existen
                let coordinatesArray = [];
                if (data.features && data.features.length > 0) {
                    //Iterar sobre cada polígono
                    data.features.forEach((feature) => {
                        if (feature.geometry && feature.geometry.coordinates) {
                            const multipolygonCoordinates = feature.geometry.coordinates;

                            // Procesa los polígonos
                            multipolygonCoordinates.forEach((polygonCoordinates) => {
                                let polygon = [];
                                polygonCoordinates.forEach((coordinate) => {
                                    // Verifica que cada `coordinate` sea un array con dos valores (longitud, latitud)
                                    if (
                                        Array.isArray(coordinate) &&
                                        coordinate.length === 2 &&
                                        typeof coordinate[0] === "number" &&
                                        typeof coordinate[1] === "number"
                                    ) {
                                        polygon.push([coordinate[1], coordinate[0]]); // Convertir [longitud, latitud] a [latitud, longitud]
                                    } else {
                                        console.warn("Punto inválido encontrado:", coordinate);
                                    }
                                });
                                if (polygon.length > 0) {
                                    coordinatesArray.push({
                                        element: feature.properties.element,
                                        coordinates: polygon,
                                    });
                                }
                            });
                        }
                    });
                    if (coordinatesArray.length > 0) {
                        onDataFetched(coordinatesArray); // Envía las coordenadas al componente padre
                    } else {
                        console.warn("No se encontraron coordenadas válidas en los datos de cartografía.");
                    }
                } else {
                    console.error("La estructura de datos no es la esperada.");
                }
            } catch (error) {
                console.error("Error fetching cartography data:", error);
            }
        };
        if (element) {
            fetchCartographyData();
        }
    }, [element, onDataFetched]);

    return null; // Este componente no renderiza nada visual
};

export default Cartography;




// if (
//     data.features &&
//     data.features[0] &&
//     data.features[0].geometry &&
//     data.features[0].geometry.coordinates
// ) {
//     const multipolygonCoordinates = data.features[0].geometry.coordinates;

//     // Procesa los polígonos (en este caso, es un solo polígono)
//     multipolygonCoordinates.forEach((polygon) => {
//         polygon.forEach((coordinate) => {
//             // Verifica que cada `coordinate` sea un array con dos valores (longitud, latitud)
//             if (
//                 Array.isArray(coordinate) &&
//                 coordinate.length === 2 &&
//                 typeof coordinate[0] === "number" &&
//                 typeof coordinate[1] === "number"
//             ) {
//                 coordinatesArray.push([coordinate[1], coordinate[0]]); // Convertir [longitud, latitud] a [latitud, longitud]
//             } else {
//                 console.warn("Punto inválido encontrado:", coordinate);
//             }
//         });
//     });