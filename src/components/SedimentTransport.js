import { useEffect } from "react"

const SedimentTransport = ({element, onDataFetched}) => {
    useEffect(() => {
        const fetchSedimentTransportData = async () => {
            try {
                //const response = await fetch(`http://localhost:8000/api/cyclone_sediment_transport/all`);
                const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/cyclone_sediment_transport/all`);
                if (!response.ok) {
                    throw new Error("Error fetching sediment transport data");
                }

                const data = await response.json();
                console.log("Datos de sediment transport:", data)

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
                                        type: "SedimentTransportCollection",
                                        id: feature.properties.id,
                                        transport: feature.properties.transport,
                                        percent: feature.properties.percent,
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
                        console.error("No valid coordinates were found in the sediment transport data.");
                    }
                } else {
                    console.error("The data structure is not as expected.");
                }
            } catch (error) {
                console.error("Error fetching sediment transport data: ", error);
            }
        };
        if (element) {
            fetchSedimentTransportData();
        }
    }, [element, onDataFetched]);

    return null;
};

export default SedimentTransport;