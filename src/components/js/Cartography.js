import { useEffect, useState, useRef } from "react";

const Cartography = ({ elements, onDataFetched }) => {
    const [cache, setCache] = useState({}); 
    const [loading, setLoading] = useState(new Set()); 
    const prevElementsRef = useRef([]); 

    useEffect(() => {
        const fetchCartographyData = async () => {
            try {
                const allData = [];
                const uncachedElements = elements.filter(
                    (element) => !cache[element] && !loading.has(element)
                );

                if (uncachedElements.length === 0) {
                    const cachedData = elements.flatMap((element) => cache[element] || []);
                    onDataFetched(cachedData);
                    return;
                }

                setLoading((prev) => new Set([...prev, ...uncachedElements]));

                for (const element of uncachedElements) {
                    try {
                        const response = await fetch(`http://localhost:8000/api/cartography?element=${encodeURIComponent(element)}`);
                        //const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/cartography?element=${encodeURIComponent(element)}`);
                        if (!response.ok) {
                            throw new Error(`Error fetching cartography data for ${element}`);
                        }

                        const data = await response.json();
                        console.log(`Datos de Cartography (${element}):`, data);

                        let coordinatesArray = [];
                        if (data.features && data.features.length > 0) {
                            data.features.forEach((feature) => {
                                if (feature.geometry && feature.geometry.coordinates) {
                                    const multipolygonCoordinates = feature.geometry.coordinates;

                                    multipolygonCoordinates.forEach((polygonCoordinates) => {
                                        let polygon = [];
                                        polygonCoordinates.forEach((coordinate) => {
                                            if (
                                                Array.isArray(coordinate) &&
                                                coordinate.length === 2 &&
                                                typeof coordinate[0] === "number" &&
                                                typeof coordinate[1] === "number"
                                            ) {
                                                polygon.push([coordinate[1], coordinate[0]]); // Convert [longitude, latitude] to [latitude, longitude]
                                            } else {
                                                console.warn("Invalid point found:", coordinate);
                                            }
                                        });
                                        if (polygon.length > 0) {
                                            coordinatesArray.push({
                                                type: "CartographyCollection",
                                                element: feature.properties.element,
                                                area_m2: feature.properties.area_m2,
                                                area_km2: feature.properties.area_km2,
                                                longitud: feature.properties.longitud,
                                                perimet_km: feature.properties.perimet_km,
                                                coordinates: polygon,
                                            });
                                        }
                                    });
                                }
                            });

                            if (coordinatesArray.length > 0) {
                                setCache((prev) => ({
                                    ...prev,
                                    [element]: coordinatesArray,
                                }));
                                allData.push(...coordinatesArray);
                            }
                        } else {
                            console.error(`The data structure for ${element} is not as expected.`);
                        }
                    } catch (error) {
                        console.error(`Error fetching cartography data for ${element}: `, error);
                    }
                }

                setLoading((prev) => {
                    const updated = new Set(prev);
                    uncachedElements.forEach((el) => updated.delete(el));
                    return updated;
                });

                if (allData.length > 0) {
                    onDataFetched(allData);
                }
            } catch (error) {
                console.error("Error fetching cartography data:", error);
            }
        };

        const newElements = elements.filter((el) => !prevElementsRef.current.includes(el));
        if (newElements.length > 0) {
            fetchCartographyData();
        }
        prevElementsRef.current = elements;
    }, [elements, cache, onDataFetched]);

    return null;
};

export default Cartography;


// import { useEffect } from "react";

// const Cartography = ({ element, onDataFetched }) => {
//     useEffect(() => {
//         const fetchCartographyData = async () => {
//             try {
//                 //const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/cartography?element=${encodeURIComponent(element)}`);
//                 const response = await fetch(`http://localhost:8000/api/cartography?element=${encodeURIComponent(element)}`);
//                 if (!response.ok) {
//                     throw new Error("Error fetching cartography data");
//                 }

//                 const data = await response.json();

//                 let coordinatesArray = [];
//                 if (data.features && data.features.length > 0) {
//                     /* Iterate the polygons */
//                     data.features.forEach((feature) => {
//                         if (feature.geometry && feature.geometry.coordinates) {
//                             const multipolygonCoordinates = feature.geometry.coordinates;

//                             /* Process the polygons */
//                             multipolygonCoordinates.forEach((polygonCoordinates) => {
//                                 let polygon = [];
//                                 polygonCoordinates.forEach((coordinate) => {
//                                     if (
//                                         Array.isArray(coordinate) &&
//                                         coordinate.length === 2 &&
//                                         typeof coordinate[0] === "number" &&
//                                         typeof coordinate[1] === "number"
//                                     ) {
//                                         polygon.push([coordinate[1], coordinate[0]]); // Convert [longitude, latitude] to [latitude, longitude]
//                                     } else {
//                                         console.warn("Punto inválido encontrado:", coordinate);
//                                     }
//                                 });
//                                 if (polygon.length > 0) {
//                                     coordinatesArray.push({
//                                         type: "CartographyCollection",
//                                         element: feature.properties.element,
//                                         area_m2: feature.properties.area_m2,
//                                         area_km2: feature.properties.area_km2,
//                                         longitud: feature.properties.longitud,
//                                         perimet_km: feature.properties.perimet_km,
//                                         coordinates: polygon,
//                                     });
//                                 }
//                             });
//                         }
//                     });
//                     if (coordinatesArray.length > 0) {
//                         onDataFetched(coordinatesArray); // Send the coordinates to the parent component
//                     } else {
//                         console.error("No valid coordinates were found in the cartography data.");
//                     }
//                 } else {
//                     console.error("The data structure is not as expected.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching cartography data: ", error);
//             }
//         };
//         if (element) {
//             fetchCartographyData();
//         }
//     }, [element, onDataFetched]);

//     return null;
// };

// export default Cartography;