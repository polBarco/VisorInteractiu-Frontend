import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Cartography from "./Cartography";
import Map from "./Map";
import "./Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [geoData, setGeoData] = useState(null); // Almacena los datos de cartografía
    const [selectedElement, setSelectedElement] = useState(null);
    const [cachedData, setCacheData] = useState({});

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedElement(option);
        setIsMenuOpen(false);

        if(cachedData && cachedData[option]) {
            setGeoData(cachedData[option]);
        } else {
            setSelectedElement(option);
        }
    };

    const handleDataFetched = (data) => {
        console.log("Datos de cartografía recibidos:", data); // Verifica los datos en Header
        setCacheData((prevCache) => ({
            ...prevCache,
            [selectedElement]: data
        }));
        setGeoData(data); // Almacena los datos en el estado local para pasarlos al mapa
    };

    return (
        <div>
            <header className="header">
                {/* <h1 className="header-title">Visor de Mapas</h1> */}
                <div className="dropdown-container">
                    <button onClick={toggleMenu} className="dropdown-button">
                        Filtro <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-menu-item" onMouseEnter={() => setIsMenuOpen(true)}>
                                Cartography <FontAwesomeIcon icon={faChevronRight} />
                                <div className="dropdown-submenu">
                                    <div onClick={() => handleOptionClick("Aeolionite")} className="dropdown-submenu-item">
                                        Aeolionite
                                    </div>
                                    <div onClick={() => handleOptionClick("Barrier system")} className="dropdown-submenu-item">
                                        Barrier system
                                    </div>
                                    <div onClick={() => handleOptionClick("Coral fringe")} className="dropdown-submenu-item">
                                        Coral fringe
                                    </div>
                                    <div onClick={() => handleOptionClick("Coral reef")} className="dropdown-submenu-item">
                                        Coral reef
                                    </div>
                                    <div onClick={() => handleOptionClick("Delta")} className="dropdown-submenu-item">
                                        Delta
                                    </div>
                                    <div onClick={() => handleOptionClick("Ebb-flood delta")} className="dropdown-submenu-item">
                                        Ebb-flood delta
                                    </div>
                                    <div onClick={() => handleOptionClick("Estuary")} className="dropdown-submenu-item">
                                        Estuary
                                    </div>
                                    <div onClick={() => handleOptionClick("Foredune")} className="dropdown-submenu-item">
                                        Foredune
                                    </div>
                                    <div onClick={() => handleOptionClick("Island")} className="dropdown-submenu-item">
                                        Island
                                    </div>
                                    <div onClick={() => handleOptionClick("Rocky coast")} className="dropdown-submenu-item">
                                        Rocky coast
                                    </div>
                                    <div onClick={() => handleOptionClick("Sandy beach")} className="dropdown-submenu-item">
                                        Sandy beach
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
            {/* Renderiza Cartography solo si `selectedElement` está definido */}
            {selectedElement && !cachedData[selectedElement] && (
                <Cartography element={selectedElement} onDataFetched={handleDataFetched} />
            )}
            {/* Renderiza el mapa con los datos de `geoData` una vez recibidos */}
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
