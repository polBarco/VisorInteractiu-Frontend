import { useEffect, useState, useRef } from "react";

const LitoralCells = ({ elements, onDataFetched }) => {
    const [cache, setCache] = useState({}); 
    const [loading, setLoading] = useState(new Set()); 
    const prevElementsRef = useRef([]); 

    useEffect(() => {
        const fetchLitoralCellsData = async () => {
            try {
                const allData = [];
                const uncachedElements = elements.filter(
                    (element) => !cache[element] && !loading.has(element)
                );

                /* If all elements are in the cache, we return them directly */
                if (uncachedElements.length === 0) {
                    const cachedData = elements.flatMap((element) => cache[element] || []);
                    onDataFetched(cachedData);
                    return;
                }

                setLoading((prev) => new Set([...prev, ...uncachedElements])); 

                for (const element of uncachedElements) {
                    try {
                        const response = await fetch(`http://localhost:8000/api/litoral_cells?name=${encodeURIComponent(element)}`);
                        // const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/litoral_cells?name=${encodeURIComponent(element)}`);
                        if (!response.ok) {
                            throw new Error(`Error retrieving data from ${element}`);
                        }

                        const data = await response.json();
                        console.log(`Datos de Litoral Cells (${element}):`, data);

                        if (data.features && data.features.length > 0) {
                            const coordinatesArray = data.features.flatMap((feature) => {
                                if (
                                    feature.geometry &&
                                    feature.geometry.type === "MultiLineString" &&
                                    feature.geometry.coordinates
                                ) {
                                    return feature.geometry.coordinates.map((line) => ({
                                        type: "LitoralCellsCollection",
                                        name: feature.properties.name,
                                        length: feature.properties.length,
                                        length_km: feature.properties.length_km,
                                        coord_xfin: feature.properties.coord_xfin,
                                        coord_yfin: feature.properties.coord_yfin,
                                        coord_xini: feature.properties.coord_xini,
                                        coord_yini: feature.properties.coord_yini,
                                        par_impar: feature.properties.par_impar,
                                        coordinates: line.map((coordinate) => [coordinate[1], coordinate[0]]),
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
                            console.error(`The data structure is not valid for ${element}`);
                        }
                    } catch (error) {
                        console.error(`Error fetching litoral cells data for ${element}:`, error);
                    }
                }

                /* Remove elements from "loading" once completed */ 
                setLoading((prev) => {
                    const updated = new Set(prev);
                    uncachedElements.forEach((el) => updated.delete(el));
                    return updated;
                });

                if (allData.length > 0) {
                    onDataFetched(allData);
                }
            } catch (error) {
                console.error("Error fetching litoral cells data:", error);
            }
        };

        /* Detect newly selected elements */ 
        const newElements = elements.filter((el) => !prevElementsRef.current.includes(el));
        if (newElements.length > 0) {
            fetchLitoralCellsData();
        }
        prevElementsRef.current = elements;
    }, [elements, cache, onDataFetched]);

    return null;
};

export default LitoralCells;
