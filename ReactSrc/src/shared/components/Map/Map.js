import React, {useRef, useEffect} from 'react';

import styles from './Map.module.scss';

const Map = ({center, zoom, className}) => {
    const mapRef = useRef();
    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current, {center, zoom});
        new window.google.maps.Marker({position: center, map});
    }, [center, zoom]);

    return <div ref={mapRef} className={`${styles.Map} ${className ? styles[className] : ''}`}>

    </div>
};

export default Map;