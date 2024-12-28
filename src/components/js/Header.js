import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Cartography from "./Cartography";
import GeoMap from "./Map";
import D50 from "./d50";
import LitoralCells from "./LitoralCells";
import Cyclone from "./Cyclone";
import Hurricane from "./Hurricane";
import RiversMozambique from "./RiversMozambique";
import "../css/Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null); 
    const [geoData, setGeoData] = useState([]);
    const [selectedType, setSelectedType] = useState(null);

    const [selectedD50Elements, setSelectedD50Elements] = useState([]);
    const [selectedLitoralCellsElements, setSelectedLitoralCellsElements] = useState([]);
    const [selectedRiversElements, setSelectedRiversElements] = useState([]);
    const [selectedCycloneElements, setSelectedCycloneElements] = useState([]);
    const [selectedCartographyElements, setSelectedCartographyElements] = useState([]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSubmenu = (submenu) => {
        setOpenSubmenu(openSubmenu === submenu ? null : submenu);
    };

    const cleanData = (type) => {
        if (type != "d50") setSelectedD50Elements([]);
        if (type != "litoral_cells") setSelectedLitoralCellsElements([]);
        if (type != "rivers") setSelectedRiversElements([]);
        if (type != "cyclone") setSelectedCycloneElements([]);
        if (type != "cartography") setSelectedCartographyElements([]);
    };

    const handleOptionToggle = (type, option) => {
        if (type === "d50") {
            cleanData(type);
            
            setSelectedD50Elements((prev) => {
                const updatedSelection = prev.includes(option)
                    ? prev.filter((item) => item !== option) // Deselect
                    : [...prev, option]; // Select
    
                /* Update geoData by removing deselected elements */
                setGeoData((prevGeoData) =>
                    prevGeoData.filter((item) => updatedSelection.includes(item.name))
                );
    
                return updatedSelection;
            });
            setSelectedType("d50");

        } else if (type === "litoral_cells") {
            cleanData(type);
    
            setSelectedLitoralCellsElements((prev) => {
                const updatedSelection = prev.includes(option)
                    ? prev.filter((item) => item !== option) 
                    : [...prev, option]; 
    
                setGeoData((prevGeoData) =>
                    prevGeoData.filter((item) => updatedSelection.includes(item.name))
                );
    
                return updatedSelection;
            });
            setSelectedType("litoral_cells");

        } else if (type === "rivers") {
            cleanData(type);

            setSelectedRiversElements((prev) => {
                const updatedSelection = prev.includes(option)
                    ? prev.filter((item) => item !== option)
                    : [...prev, option];

                setGeoData((prevGeoData) => 
                    prevGeoData.filter((item) => updatedSelection.includes(item.region))
                );
                return updatedSelection;
            });
            setSelectedType("rivers");

        } else if (type === "cyclone") {
            cleanData(type);

            setSelectedCycloneElements((prev) => {
                const updatedSelection = prev.includes(option)
                    ? prev.filter((item) => item !== option) // Deselect
                    : [...prev, option]; // Select
    
                return updatedSelection;
            });
            setSelectedType("cyclone");

        } else if (type === "cartography") {
            cleanData(type);

            setSelectedCartographyElements((prev) => {
                const updatedSelection = prev.includes(option)
                    ? prev.filter((item) => item !== option)
                    : [...prev, option];

                setGeoData((prevGeoData) => 
                    prevGeoData.filter((item) => updatedSelection.includes(item.element))
                );
                return updatedSelection;
            });
            setSelectedType("cartography");

        } 
    };   

    const handleDataFetched = (data) => {
        setGeoData((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
    
            // Combinar nuevos datos con los previos sin duplicados
            const combinedData = [...safePrev, ...data].reduce((acc, item) => {
                const key = `${item.arcid || item.name || item.region || JSON.stringify(item.coordinates)}`; // Clave robusta
                if (!acc.some((existing) => `${existing.arcid || existing.name || existing.region || JSON.stringify(existing.coordinates)}` === key)) {
                    acc.push(item);
                }
                return acc;
            }, []);
    
            return combinedData; 
        });
    };

    const handleHurricaneData = (type, data) => {
        cleanData(type);
        setGeoData([]); 
        setGeoData(data);
        setSelectedType(type);
        toggleMenu();
    };

    // useEffect(() => {
    //     prevSelectedElement.current = selectedElement;
    //     prevSelectedType.current = selectedType;
    // }, [selectedElement, selectedType]);

    return (
        <div>
            <header className="header">
                <div className="app-title">Interactive Viewer</div>
                <div className="dropdown-container">
                    <button onClick={toggleMenu} className="dropdown-button">
                        Layers <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">

                            {/* Cartography */}
                            <div
                                className="dropdown-menu-item"
                                onClick={() => toggleSubmenu("cartography")}
                            >
                                Cartography <FontAwesomeIcon icon={faChevronRight} />
                                {openSubmenu === "cartography" && (
                                    <div className="dropdown-submenu">
                                        {["Aeolionite", "Barrier system", "Coral fringe", "Coral reef", "Delta", "Ebb-flood delta",
                                            "Estuary", "Foredune", "Island", "Rocky coast", "Sandy beach",
                                        ].map((option, index) => (
                                            <div
                                                key={index}
                                                onClick={() =>
                                                    handleOptionToggle("cartography", option)
                                                }
                                                className={`dropdown-submenu-item ${
                                                    selectedCartographyElements.includes(option) ? "selected" : "" 
                                                }`}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Cyclone */}
                            <div
                                className="dropdown-menu-item"
                                onClick={() => toggleSubmenu("cyclone")}
                            >
                                Cyclone <FontAwesomeIcon icon={faChevronRight} />
                                {openSubmenu === "cyclone" && (
                                    <div className="dropdown-submenu">
                                        {["Sediment transport", "Era 5 node"].map((option, index) => {
                                            const elementType = option === "Sediment transport" ? "sediment_transport" : "era5_node";
                                            const isSelected = selectedCycloneElements.includes(elementType);

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => handleOptionToggle("cyclone", elementType)}
                                                    className={`dropdown-submenu-item ${isSelected ? "selected" : ""}`}
                                                >
                                                    {option}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* D50 */}
                            <div
                                className="dropdown-menu-item"
                                onClick={() => toggleSubmenu("d50")}
                            >
                                D50 <FontAwesomeIcon icon={faChevronRight} />
                                {openSubmenu === "d50" && (
                                    <div className="dropdown-submenu">
                                        {["Barra rompientes", "Barra seca", "DB rompientes", "DB seca"].map((option, index) => (
                                            <div
                                                key={index}
                                                onClick={() =>
                                                    handleOptionToggle("d50", option)
                                                }
                                                className={`dropdown-submenu-item ${
                                                    selectedD50Elements.includes(option) ? "selected" : "" 
                                                }`}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Hurricane */}
                            <div
                                className="dropdown-menu-item"
                                onClick={() => toggleSubmenu("hurricane")}
                            >
                                Hurricane <FontAwesomeIcon icon={faChevronRight} />
                                {openSubmenu === "hurricane" && (
                                    <Hurricane
                                        onClose={() => toggleSubmenu(null)} 
                                        onSelect={(data) => handleHurricaneData("hurricane", data)}
                                    />
                                )}
                            </div>

                            {/* Litoral Cells */}
                            <div
                                className="dropdown-menu-item"
                                onClick={() => toggleSubmenu("litoral_cells")}
                            >
                                Litoral Cells <FontAwesomeIcon icon={faChevronRight} />
                                {openSubmenu === "litoral_cells" && (
                                    <div className="dropdown-submenu">
                                        {["Lit_0", "Lit_1", "Lit_2", "Lit_3", "Lit_4", 
                                            "Lit_5", "Lit_6", "Lit_7", "Lit_8", "Lit_9",
                                        ].map((option, index) => (
                                            <div
                                                key={index}
                                                onClick={() =>
                                                    handleOptionToggle("litoral_cells", option)
                                                }
                                                className={`dropdown-submenu-item ${
                                                    selectedLitoralCellsElements.includes(option) ? "selected" : "" 
                                                }`}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Rivers */}
                            <div
                                className="dropdown-menu-item"
                                onClick={() => toggleSubmenu("rivers")}
                            >
                                Rivers <FontAwesomeIcon icon={faChevronRight} />
                                {openSubmenu === "rivers" && (
                                    <div className="dropdown-submenu">
                                        {["East", "North", "South", "West"].map((option, index) => (
                                            <div
                                                key={index}
                                                onClick={() =>
                                                    handleOptionToggle("rivers", option)
                                                }
                                                className={`dropdown-submenu-item ${
                                                    selectedRiversElements.includes(option) ? "selected" : "" 
                                                }`}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Render Components */}
            {selectedType === "cartography" && selectedCartographyElements.length > 0 && (
                <Cartography elements={selectedCartographyElements} onDataFetched={handleDataFetched} />
            )}

            {selectedType === "d50" && selectedD50Elements.length > 0 && (
                <D50 elements={selectedD50Elements} onDataFetched={handleDataFetched} />
            )}

            {selectedType === "litoral_cells" && selectedLitoralCellsElements.length > 0 && (
                <LitoralCells elements={selectedLitoralCellsElements} onDataFetched={handleDataFetched} />
            )}

            {selectedType === "rivers" && selectedRiversElements.length > 0 && (
                <RiversMozambique elements={selectedRiversElements} onDataFetched={handleDataFetched} />
            )}

            {selectedCycloneElements.length > 0 && (
                <Cyclone elements={selectedCycloneElements} onDataFetched={handleDataFetched} />
            )}

            {/* Render GeoMap */}
            <GeoMap
                geoData={geoData.filter((item) => {
                    if (selectedType === "cartography") return selectedCartographyElements.includes(item.element);
                    if (selectedType === "d50") return selectedD50Elements.includes(item.name);
                    if (selectedType === "litoral_cells") return selectedLitoralCellsElements.includes(item.name);
                    if (selectedType === "rivers") return selectedRiversElements.includes(item.region);
                    if (item.type === "SedimentTransportCollection" && selectedCycloneElements.includes("sediment_transport")) return true;
                    if (item.type === "Era5NodeCollection" && selectedCycloneElements.includes("era5_node")) return true;
                    if (selectedType === "hurricane") return item.type === "HurricaneCollection";
                    return false;
                })}
                selectedElements={selectedCartographyElements}
            />
        </div>
    );
};

export default Header;
