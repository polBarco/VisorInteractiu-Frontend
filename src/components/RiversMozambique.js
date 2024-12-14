import { useEffect } from "react"

const RiversMozambique = ({ element, onDataFetched }) => {
    useEffect(() => {
        const fetchRiversMozambiqueData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/rivers_mozambique?region=${encodeURIComponent(element)}`);
                //const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/litoral_cells?name=${encodeURIComponent(element)}`);
                if (!response.ok) {
                    throw new Error("Error fetching rivers data");
                }

                const data = await response.json();
                console.log("Datos de rivers:", data)

                let coordinatesArray = [];
                if (data.features && data.features.length > 0) {
                    data.features.forEach((feature) => {
                        if (
                            feature.geometry &&
                            feature.geometry.coordinates &&
                            feature.geometry.type === "MultiLineString"
                        ) {
                            const multilinestringCoordinates = feature.geometry.coordinates;

                            multilinestringCoordinates.forEach((lineCoordinates) => {
                                if (Array.isArray(lineCoordinates)) {
                                    let lineArray = lineCoordinates.map((coordinate) => {
                                        if (
                                            Array.isArray(coordinate) &&
                                            coordinate.length === 2 &&
                                            typeof coordinate[0] === "number" &&
                                            typeof coordinate[1] === "number"
                                        ) {
                                            return [coordinate[1], coordinate[0]]; 
                                        } else {
                                            console.warn("Punto inválido encontrado:", coordinate);
                                            return null;
                                        }
                                    }).filter((coord) => coord !== null);

                                    if (lineArray.length > 0) {
                                        coordinatesArray.push({
                                            type: "RiversMozambiqueCollection",
                                            arcid: feature.properties.arcid,
                                            up_cells: feature.properties.up_cells,
                                            region: feature.properties.region,
                                            coordinates: lineArray, 
                                        });
                                    }
                                }
                            });
                        }
                    });
                    if (coordinatesArray.length > 0) {
                        onDataFetched(coordinatesArray);
                    } else {
                        console.error("No valid coordinates were found in the rivers data.");
                    }
                } else {
                    console.error("The data structure is not as expected.");
                }
            } catch (error) {
                console.error("Error fetching rivers data: ", error);
            }
        };
        if (element) {
            fetchRiversMozambiqueData();
        }
    }, [element, onDataFetched]);

    return null;
};

export default RiversMozambique;