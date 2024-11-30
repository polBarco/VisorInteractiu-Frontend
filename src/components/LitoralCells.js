import { useEffect } from "react"

const LitoralCells = ({ element, onDataFetched }) => {
    useEffect(() => {
        const fetchLitoralCellsData = async () => {
            try {
                // const response = await fetch(`http://localhost:8000/api/litoral_cells?name=${encodeURIComponent(element)}`);
                const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/litoral_cells?name=${encodeURIComponent(element)}`);
                if (!response.ok) {
                    throw new Error("Error fetching litoral cells data");
                }

                const data = await response.json();
                console.log("Datos de litoral cells:", data)

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
                                            type: "LitoralCellsCollection",
                                            name: feature.properties.name,
                                            length: feature.properties.length,
                                            length_km: feature.properties.length_km,
                                            coord_xfin: feature.properties.coord_xfin,
                                            coord_yfin: feature.properties.coord_yfin,
                                            coord_xini: feature.properties.coord_xini,
                                            coord_yini: feature.properties.coord_yini,
                                            par_impar: feature.properties.par_impar,
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
                        console.error("No valid coordinates were found in the litoral cells data.");
                    }
                } else {
                    console.error("The data structure is not as expected.");
                }
            } catch (error) {
                console.error("Error fetching litoral cells data: ", error);
            }
        };
        if (element) {
            fetchLitoralCellsData();
        }
    }, [element, onDataFetched]);

    return null;
};

export default LitoralCells;