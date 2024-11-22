import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Cartography from "./Cartography";
import Map from "./Map";
import D50 from "./d50";
import LitoralCells from "./LitoralCells";
import "./Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [geoData, setGeoData] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [cachedData, setCacheData] = useState({});
    const prevSelectedElement = useRef(null);
    const prevSelectedType = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleOptionClick = (type, option) => {
        if (cachedData?.[type]?.[option]) {
            setGeoData(cachedData[type][option]);
        } else {
            if(selectedElement !== option || selectedType !== type) {
                setSelectedElement(option);
                setSelectedType(type);
                setGeoData(null);
            }
        }
        setIsMenuOpen(false);
    };

    const handleDataFetched = (data) => {
        console.log("Datos recibidos:", data); 
        setCacheData((prevCache) => ({
            ...prevCache,
            [selectedType]: {
                ...prevCache[selectedType],
                [selectedElement]: data
            },
        }));
        setGeoData(data);
    };

    useEffect(() => {
        prevSelectedElement.current = selectedElement;
        prevSelectedType.current = selectedType;
    }, [selectedElement, selectedType]);

    return (
        <div>
            <header className="header">
                <div className="dropdown-container">
                    <button onClick={toggleMenu} className="dropdown-button">
                        Layers <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-menu-item">
                                Cartography <FontAwesomeIcon icon={faChevronRight} />
                                <div className="dropdown-submenu">
                                    {["Aeolionite", "Barrier system", "Coral fringe", "Coral reef", "Delta", "Ebb-flood delta", "Estuary", "Foredune", "Island", "Rocky coast", "Sandy beach"].map((option, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleOptionClick("cartography", option)}
                                            className="dropdown-submenu-item"
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="dropdown-menu-item">
                                d50 <FontAwesomeIcon icon={faChevronRight} />
                                <div className="dropdown-submenu">
                                    {["Barra rompientes", "Barra seca", "DB rompientes", "DB seca"].map((option, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleOptionClick("d50", option)}
                                            className="dropdown-submenu-item"
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="dropdown-menu-item">
                                Litoral cells <FontAwesomeIcon icon={faChevronRight} />
                                <div className="dropdown-submenu">
                                    {["Lit_0", "Lit_1", "Lit_2", "Lit_3", "Lit_4", "Lit_5", "Lit_6", "Lit_7", "Lit_8", "Lit_9"].map((option, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleOptionClick("litoral_cells", option)}
                                            className="dropdown-submenu-item"
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
            
            {/* Render only if selectedElement is defined */}
            {selectedElement && !cachedData[selectedType]?.[selectedElement] &&
                (prevSelectedElement.current !== selectedElement || prevSelectedType.current !== selectedType) && 
                (
                    selectedType === "cartography" ? (
                        <Cartography element={selectedElement} onDataFetched={handleDataFetched} />
                    ) : selectedType === "d50" ? (
                        <D50 element={selectedElement} onDataFetched={handleDataFetched} />
                    ) : selectedType === "litoral_cells" ? (
                        <LitoralCells element={selectedElement} onDataFetched={handleDataFetched} />
                    ) : null
                )
            }
            
            {/* Render the map with the geoData once it is received */}
            <Map geoData={geoData} element={selectedElement} />
        </div>
    );
};

export default Header;
