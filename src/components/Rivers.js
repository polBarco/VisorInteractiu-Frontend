import { useState } from "react";

const Rivers = ({ onClose, onDataFetched }) => {
    const [page, setPage] = useState(1);
    const [inputPage, setInputPage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchRiversData = async () => {
        try {
            const response = await fetch(`https://visorinteractiu-backend.onrender.com/api/rivers?page=${inputPage}`);
            //const response = await fetch(`http://localhost:8000/api/rivers?page=${inputPage}`);
            if (!response.ok) {
                throw new Error("Error fetching rivers data");
            }
            const data = await response.json();
            console.log("Datos de Rivers recibidos en el componente:", data);

            let coordinatesArray = [];
            if (data.data.features && data.data.features.length > 0) {
                data.data.features.forEach((feature) => {
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
                                        return [coordinate[1], coordinate[0]]; // [lat, lon]
                                    } else {
                                        console.warn("Punto inválido encontrado:", coordinate);
                                        return null;
                                    }
                                }).filter((coord) => coord !== null);

                                if (lineArray.length > 0) {
                                    coordinatesArray.push({
                                        type: "RiverCollection",
                                        arcid: feature.properties.arcid,
                                        up_cells: feature.properties.up_cells,
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
            console.error("Error fetching rivers data:", error);
        }
    };

    const handlePageInputChange = (event) => {
        const newPage = event.target.value === '' ? '' : parseInt(event.target.value, 10);
        setInputPage(newPage);
    };

    const handlePageSubmit = () => {
        if (inputPage >= 1 && inputPage <= 310) {
            setErrorMessage('');
            setPage(inputPage);
            fetchRiversData();
        } else {
            setErrorMessage("Please enter a number between 1 and 310"); 
        }
    };

    return (
        <div className="popup-container" onClick={onClose}>
            <div
                className="popup-content"
                onClick={(event) => event.stopPropagation()}
            >
                <h2>Rivers</h2>
                <p>Enter a number from 1 to 310:</p>
                <input
                    type="number"
                    value={inputPage}
                    onChange={handlePageInputChange}
                    min="1"
                    max="310"
                    className="page-input"
                />
                <button 
                    className="send-button" 
                    onClick={handlePageSubmit} 
                >
                    Enviar
                </button>
                <button
                    className="close-button"
                    onClick={onClose}
                >
                    Cerrar
                </button>
                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}
            </div>
        </div>
    );
};

export default Rivers;
