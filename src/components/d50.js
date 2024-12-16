import { useEffect, useState, useRef } from "react";

const D50 = ({ elements, onDataFetched }) => {
    const [cache, setCache] = useState({}); // CCache to store already retrieved data
    const [loading, setLoading] = useState(new Set()); // State for active requests.
    const prevElementsRef = useRef([]); // Stores previously selected elements

    useEffect(() => {
        const fetchD50Data = async () => {
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
                        const response = await fetch(`http://localhost:8000/api/d50?name=${encodeURIComponent(element)}`);
                        // const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/d50?name=${encodeURIComponent(element)}`);
                        if (!response.ok) {
                            throw new Error(`Error al obtener datos de ${element}`);
                        }

                        const data = await response.json();
                        console.log(`Datos de D50 (${element}):`, data);

                        if (data.features && data.features.length > 0) {
                            const coordinatesArray = data.features.flatMap((feature) => {
                                if (
                                    feature.geometry &&
                                    feature.geometry.type === "MultiPoint" &&
                                    feature.geometry.coordinates
                                ) {
                                    return feature.geometry.coordinates.map((point) => ({
                                        type: "D50Collection",
                                        name: feature.properties.name,
                                        d50: feature.properties.d50,
                                        coordinates: [point[1], point[0]],
                                    }));
                                }
                                return [];
                            });

                            if (coordinatesArray.length > 0) {
                                setCache((prev) => ({
                                    ...prev,
                                    [element]: coordinatesArray,
                                }));
                                allData.push(...coordinatesArray);
                            }
                        } else {
                            console.error(`La estructura de datos no es válida para ${element}`);
                        }
                    } catch (error) {
                        console.error(`Error al procesar ${element}:`, error);
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
                console.error("Error al obtener datos de D50:", error);
            }
        };

        const newElements = elements.filter((el) => !prevElementsRef.current.includes(el));
        if (newElements.length > 0) {
            fetchD50Data();
        }
        prevElementsRef.current = elements;
    }, [elements, cache, onDataFetched]);

    return null;
};

export default D50;
