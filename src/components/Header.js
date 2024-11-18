import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Cartography from "./Cartography";
import Map from "./Map";
import D50 from "./d50";
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
                {/* <h1 className="header-title">Visor de Mapas</h1> */}
                <div className="dropdown-container">
                    <button onClick={toggleMenu} className="dropdown-button">
                        Layers <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-menu-item">
                                Cartography <FontAwesomeIcon icon={faChevronRight} />
                                <div className="dropdown-submenu">
                                    <div onClick={() => handleOptionClick("cartography", "Aeolionite")} className="dropdown-submenu-item">
                                        Aeolionite
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Barrier system")} className="dropdown-submenu-item">
                                        Barrier system
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Coral fringe")} className="dropdown-submenu-item">
                                        Coral fringe
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Coral reef")} className="dropdown-submenu-item">
                                        Coral reef
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Delta")} className="dropdown-submenu-item">
                                        Delta
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Ebb-flood delta")} className="dropdown-submenu-item">
                                        Ebb-flood delta
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Estuary")} className="dropdown-submenu-item">
                                        Estuary
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Foredune")} className="dropdown-submenu-item">
                                        Foredune
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Island")} className="dropdown-submenu-item">
                                        Island
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Rocky coast")} className="dropdown-submenu-item">
                                        Rocky coast
                                    </div>
                                    <div onClick={() => handleOptionClick("cartography", "Sandy beach")} className="dropdown-submenu-item">
                                        Sandy beach
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-menu-item">
                                d50 <FontAwesomeIcon icon={faChevronRight} />
                                <div className="dropdown-submenu">
                                    <div onClick={() => handleOptionClick("d50", "Barra rompientes")} className="dropdown-submenu-item">
                                        Barra rompientes
                                    </div>
                                    <div onClick={() => handleOptionClick("d50", "Barra seca")} className="dropdown-submenu-item">
                                        Barra seca
                                    </div>
                                    <div onClick={() => handleOptionClick("d50", "DB rompientes")} className="dropdown-submenu-item">
                                        DB rompientes
                                    </div>
                                    <div onClick={() => handleOptionClick("d50", "DB seca")} className="dropdown-submenu-item">
                                        DB seca
                                    </div>
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
                    ) : null
                )
            }
            
            {/* Render the map with the geoData once it is received */}
            <Map geoData={geoData} element={selectedElement} />
        </div>
    );
};

export default Header;







// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
// import Cartography from "./Cartography";
// import Map from "./Map";
// import "./Header.css";

// const Header = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
//     const [geoData, setGeoData] = useState(null); // Almacena los datos de cartografía
//     const [selectedElement, setSelectedElement] = useState(null);

//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     const handleOptionClick = (option) => {
//         setIsMenuOpen(false);
//         setSelectedElement(option);
//         setIsSubMenuOpen(false);
//     };

//     const toggleSubMenu = () => {
//         setIsSubMenuOpen(!isSubMenuOpen);
//     }

//     const handleDataFetched = (data) => {
//         console.log("Datos de cartografía recibidos:", data); // Verifica los datos en Header
//         setGeoData(data); // Almacena los datos en el estado local para pasarlos al mapa
//     };

//     return (
//         <div>
//             <header className="header">
//                 <h1 className="header-title">Visor de Mapas</h1>
//                 <div className="dropdown-container">
//                     <button onClick={toggleMenu} className="dropdown-button">
//                         Filtro <FontAwesomeIcon icon={faChevronDown} />
//                     </button>
//                     {isMenuOpen && (
//                         <div className="dropdown-menu">
//                             <div onClick={toggleSubMenu} className="dropdown-menu-item">
//                                 Cartography <FontAwesomeIcon icon={faChevronRight} />
//                             </div>
//                             {isSubMenuOpen && (
//                                 <div className="dropdown-submenu">
//                                     <div onClick={() => handleOptionClick("Sandy beach")} className="dropdown-menu-item">
//                                         Sandy beach
//                                     </div>
//                                     <div onClick={() => handleOptionClick("Delta")} className="dropdown-menu-item">
//                                         Delta
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </header>
//             {/* Renderiza Cartography solo si `showCartography` es true */}
//             {selectedElement && (
//                 <Cartography element={selectedElement} onDataFetched={handleDataFetched} />
//             )}
//             {/* Renderiza el mapa con los datos de `geoData` una vez recibidos */}
//             <Map geoData={geoData} />
//         </div>
//     );
// };

// export default Header;
