import { useEffect, useState, useRef } from "react";

const Cyclon = ({ elements, onDataFetched }) => {
    const [cache, setCache] = useState({}); 
    const [loading, setLoading] = useState(new Set());
    const prevElementsRef = useRef([]);

    useEffect(() => {
        const fetchCycloneData = async () => {
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
                        let url = "";
                        if (element === "sediment_transport") {
                            url = `http://localhost:8000/api/cyclone_sediment_transport/all`;
                        } else if (element === "era5_node") {
                            url = `http://localhost:8000/api/cyclone_era5_node/all`;
                        } else {
                            console.error("Invalid element provided to Cyclon component");
                            return;
                        }

                        const response = await fetch(url);
                        if (!response.ok) {
                            throw new Error(`Error fetching ${element} data`);
                        }

                        const data = await response.json();
                        console.log(`Datos de ${element}:`, data);

                        if (data.features && data.features.length > 0) {
                            const coordinatesArray = data.features.flatMap((feature) => {
                                if (
                                    feature.geometry &&
                                    feature.geometry.type === "MultiPoint" &&
                                    feature.geometry.coordinates
                                ) {
                                    return feature.geometry.coordinates
                                        .map((point) => {
                                            if (
                                                Array.isArray(point) &&
                                                point.length === 2 &&
                                                typeof point[0] === "number" &&
                                                typeof point[1] === "number"
                                            ) {
                                                const baseData = {
                                                    id: feature.properties.id,
                                                    coordinates: [point[1], point[0]],
                                                };

                                                if (element === "sediment_transport") {
                                                    return {
                                                        ...baseData,
                                                        type: "SedimentTransportCollection",
                                                        transport: feature.properties.transport,
                                                        percent: feature.properties.percent,
                                                    };
                                                } else if (element === "era5_node") {
                                                    return {
                                                        ...baseData,
                                                        type: "Era5NodeCollection",
                                                    };
                                                }
                                            } else {
                                                console.log("Invalid point: ", point);
                                                return null;
                                            }
                                        })
                                        .filter(Boolean); // Eliminar nulos
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
                            console.error(`The ${element} data structure is not as expected`);
                        }
                    } catch (error) {
                        console.error(`Error fetching ${element} data: `, error);
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
                console.error("Error fetching cyclone data:", error);
            }
        };

        const newElements = elements.filter((el) => !prevElementsRef.current.includes(el));
        if (newElements.length > 0) {
            fetchCycloneData();
        }
        prevElementsRef.current = elements;
    }, [elements, cache, onDataFetched]);

    return null;
};

export default Cyclon;
