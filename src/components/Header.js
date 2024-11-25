import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Cartography from "./Cartography";
import Map from "./Map";
import D50 from "./d50";
import LitoralCells from "./LitoralCells";
import SedimentTransport from "./SedimentTransport";
import Era5Node from "./Era5Node";
import "./Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null); // State to track open submenu
    const [geoData, setGeoData] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [cachedData, setCacheData] = useState({});

    const prevSelectedElement = useRef(null);
    const prevSelectedType = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSubmenu = (submenu) => {
        setOpenSubmenu(openSubmenu === submenu ? null : submenu);
    };

    const handleOptionClick = (type, option) => {
        if (cachedData?.[type]?.[option]) {
            setGeoData(cachedData[type][option]);
        } else {
            if (selectedElement !== option || selectedType !== type) {
                setSelectedElement(option);
                setSelectedType(type);
                setGeoData(null);
            }
        }
        setIsMenuOpen(false);
        setOpenSubmenu(null); // Close submenu after selection
    };

    const handleDataFetched = (data) => {
        console.log("Datos recibidos:", data);
        setCacheData((prevCache) => ({
            ...prevCache,
            [selectedType]: {
                ...prevCache[selectedType],
                [selectedElement]: data,
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
                <div className="app-title">Interactive Viewer</div>
                <div className="dropdown-container">
                    <button onClick={toggleMenu} className="dropdown-button">
                        Layers <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
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
                                                    handleOptionClick("cartography", option)
                                                }
                                                className="dropdown-submenu-item"
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

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
                                                    handleOptionClick("d50", option)
                                                }
                                                className="dropdown-submenu-item"
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

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
                                                    handleOptionClick("litoral_cells", option)
                                                }
                                                className="dropdown-submenu-item"
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div
                                className="dropdown-menu-item"
                                onClick={() => toggleSubmenu("cyclone")}
                            >
                                Cyclone <FontAwesomeIcon icon={faChevronRight} />
                                {openSubmenu === "cyclone" && (
                                    <div className="dropdown-submenu">
                                        {["Sediment transport", "Era 5 node"].map(
                                            (option, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() =>
                                                        option === "Sediment transport"
                                                            ? handleOptionClick("sediment_transport", option)
                                                            : handleOptionClick("era5_node", option)
                                                    }
                                                    className="dropdown-submenu-item"
                                                >
                                                    {option}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Render only if selectedElement is defined */}
            {selectedElement &&
                !cachedData[selectedType]?.[selectedElement] &&
                (prevSelectedElement.current !== selectedElement || prevSelectedType.current !== selectedType) &&
                (
                    selectedType === "cartography" ? (
                    <Cartography element={selectedElement} onDataFetched={handleDataFetched} />
                    ) : selectedType === "d50" ? (
                    <D50 element={selectedElement} onDataFetched={handleDataFetched} />
                    ) : selectedType === "litoral_cells" ? (
                    <LitoralCells element={selectedElement} onDataFetched={handleDataFetched} />
                    ) : selectedType === "sediment_transport" ? (
                    <SedimentTransport element={selectedElement} onDataFetched={handleDataFetched} />
                    ) : selectedType === "era5_node" ? (
                    <Era5Node element={selectedElement} onDataFetched={handleDataFetched} />
                    ) : null
                )
            }

            {/* Render the map with the geoData once it is received */}
            <Map geoData={geoData} element={selectedElement} />
        </div>
    );
};

export default Header;
