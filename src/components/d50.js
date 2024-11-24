import { type } from "@testing-library/user-event/dist/type";
import { useEffect } from "react"

const D50 = ({ element, onDataFetched }) => {
    useEffect(() => {
        const fetchD50Data = async () => {
            try {
                const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/d50?name=${encodeURIComponent(element)}`);
                // const response = await fetch(`http://localhost:8000/api/d50?name=${encodeURIComponent(element)}`);
                if (!response.ok) {
                    throw new Error("Error fetching d50 data");
                }

                const data = await response.json();
                console.log("Datos de d50:", data)

                let coordinatesArray = [];
                if (data.features && data.features.length > 0) {
                    data.features.forEach((feature) => {
                        if (feature.geometry && feature.geometry.coordinates && feature.geometry.type ==="MultiPoint") {
                            const multipointCoordinates = feature.geometry.coordinates;
    
                            multipointCoordinates.forEach((pointCoordinates) => {
                                if (
                                    Array.isArray(pointCoordinates) &&
                                    pointCoordinates.length === 2 &&
                                    typeof pointCoordinates[0] === "number" &&
                                    typeof pointCoordinates[1] === "number"
                                ) {
                                    coordinatesArray.push({
                                        type: "D50Collection",
                                        name: feature.properties.name,
                                        d50: feature.properties.d50,
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
                        console.error("No valid coordinates were found in the d50 data.");
                    }  
                } else {
                    console.error("The data structure is not as expected.");
                }
            } catch (error) {
                console.error("Error fetching d50 data: ", error);
            }
        };
        if (element) {
            fetchD50Data();
        }
    }, [element, onDataFetched]);

    return null;
};

export default D50;