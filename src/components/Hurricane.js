import React, { useEffect, useState } from "react";
import "./css/Hurricane.css";

const Hurricane = ({ onClose, onSelect }) => {
    const [types, setTypes] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [hurricaneData, setHurricaneData] = useState(null); 
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const layersButton = document.querySelector(".dropdown-button"); // Select "Layers" button
        if (layersButton) {
            const rect = layersButton.getBoundingClientRect(); // Button position
            setButtonPosition({
                top: rect.bottom + window.scrollY, // Vertical position
                left: rect.left + window.scrollX, // Horizontal position
            });
        }
    }, []);

    /* API call to fetch the types of hurricanes */
    useEffect(() => {
        fetch("http://localhost:8000/api/hurricane/types")
        //fetch("https://visorinteractiu-backend.onrender.com/api/hurricane/types")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTypes(data); 
                } else {
                    console.error("Expected array but got:", data);
                }
            })
            .catch((error) => console.error("Error fetching hurricane types:", error));
    }, []);

    /* API call to fetch the years of hurricanes based on the selected type */
    useEffect(() => {
        if (selectedType) {
            fetch(`http://localhost:8000/api/hurricane/years/${selectedType}`)
            //fetch(`https://visorinteractiu-backend.onrender.com/api/hurricane/years/${selectedType}`)
                .then((response) => response.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setYears(data); 
                    } else {
                        console.error("Expected array but got:", data);
                    }
                })
                .catch((error) => console.error("Error fetching hurricane years:", error));
        } else {
            setYears([]); 
        }
    }, [selectedType]);

    const handleSend = async () => {
        if (selectedType && selectedYear) {
            try {
                const response = await fetch(`http://localhost:8000/api/hurricane/${selectedType}/${selectedYear}`);
                //const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/hurricane/${selectedType}/${selectedYear}`);
                if (!response.ok) {
                    throw new Error("Error fetching hurricane data");
                }

                const data = await response.json();
                console.log("Hurricane GeoJSON data:", data);

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
                                            return [coordinate[1], coordinate[0]]; // Convert [longitud, latitud] a [latitud, longitud]
                                        } else {
                                            console.warn("Invalid point found:", coordinate);
                                            return null;
                                        }
                                    }).filter((coord) => coord !== null);

                                    if (lineArray.length > 0) {
                                        coordinatesArray.push({
                                            type: "HurricaneCollection",
                                            name: feature.properties.name,
                                            year: feature.properties.year,
                                            hurricaneType: feature.properties.type,
                                            coordinates: lineArray,
                                        });
                                    }
                                }
                            
                            });
                        }
                    });
                    if (coordinatesArray.length > 0) {
                        setHurricaneData(coordinatesArray);
                        onSelect(coordinatesArray);
                        onClose();
                    } else {
                        console.error("No valid coordinates were found in the hurricane data.");
                    } 
                } else {
                    console.error("The data structure is not as expected.");
                }
            } catch (error) {
                console.error("Error fetching hurricane data:", error);
            }
        };
    }

    return (
        <div className="popup-container" onClick={onClose}>
            <div
                className="popup-content"
                onClick={(e) => e.stopPropagation()} // Prevents the click from closing the popup
            >
                <h3>Hurricanes</h3>
                <div className="dropdown-fields">
                    <label>
                        Type:
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">Select Type</option>
                            {types.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Year:
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            disabled={!selectedType}
                        >
                            <option value="">Select Year</option>
                            {years.map((year, index) => (
                                <option key={index} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="vutton-container">
                    <button 
                        className="send-button" 
                        onClick={handleSend}
                        disabled={!selectedType || !selectedYear}
                    >
                        Send
                    </button>
                    <button className="close-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hurricane;
