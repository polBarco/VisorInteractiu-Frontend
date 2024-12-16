import { useEffect } from "react"

const Era5Node = ({element, onDataFetched}) => {
    useEffect(() => {
        const fetchEra5NodeData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cyclone_era5_node/all`);
                // const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/cyclone_era5_node/all`);
                if (!response.ok) {
                    throw new Error("Error fetching era5 node data");
                }

                const data = await response.json();
                console.log("Datos de era5 node:", data)

                let coordinatesArray = [];
                if (data.features && data.features.length > 0) {
                    data.features.forEach((feature) => {
                        if (feature.geometry && feature.geometry.coordinates && feature.geometry.type === "MultiPoint") {
                            const multipointCoordinates = feature.geometry.coordinates;

                            multipointCoordinates.forEach((pointCoordinates) => {
                                if (
                                    Array.isArray(pointCoordinates) &&
                                    pointCoordinates.length === 2 &&
                                    typeof pointCoordinates[0] === "number" &&
                                    typeof pointCoordinates[1] === "number"
                                ) {
                                    coordinatesArray.push({
                                        type: "Era5NodeCollection",
                                        id: feature.properties.id,
                                        coordinates: [pointCoordinates[1], pointCoordinates[0]],
                                    });
                                } else {
                                    console.log("Invalid point: ", pointCoordinates);
                                }
                            });
                        }
                    });
                    if (coordinatesArray.length > 0) {
                        onDataFetched(coordinatesArray);
                    } else {
                        console.error("No valid coordinates were found in the era5 node data.");
                    }
                } else {
                    console.error("The data structure is not as expected.");
                }
            } catch (error) {
                console.error("Error fetching era5 node data: ", error);
            }
        };
        if (element) {
            fetchEra5NodeData();
        }
    }, [element, onDataFetched]);

    return null;
};

export default Era5Node;