import { useEffect, useState, useRef } from "react"

const RiversMozambique = ({ elements, onDataFetched }) => {
    const [cache, setCache] = useState({}); 
    const [loading, setLoading] = useState(new Set()); 
    const prevElementsRef = useRef([]);   

    useEffect(() => {
        const fetchRiversMozambiqueData = async () => {
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
                        //const response = await fetch(`http://localhost:8000/api/rivers_mozambique?region=${encodeURIComponent(element)}`);
                        const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/rivers_mozambique?region=${encodeURIComponent(element)}`);
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
                                        type: "RiversMozambiqueCollection",
                                        arcid: feature.properties.arcid,
                                        up_cells: feature.properties.up_cells,
                                        region: feature.properties.region,
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
                            console.error("The data structure is not valid for ${element}");
                        }
                    } catch (error) {
                        console.error(`Error fetching rivers data for ${element}: `, error);
                    }
                }

                setLoading((prev) => {
                    const updated = new Set(prev);
                    uncachedElements.forEach((element) => updated.delete(element));
                    return updated;
                });

                if (allData.length > 0) {
                    onDataFetched(allData);
                }
            } catch (error) {
                console.error("Error fetching rivers data: ", error);
            }
        };

        const newElements = elements.filter((element) => !prevElementsRef.current.includes(element));
        if (newElements.length > 0) {
            fetchRiversMozambiqueData();
        }
        prevElementsRef.current = elements;
    }, [elements, cache, onDataFetched]);

    return null;
};

export default RiversMozambique;