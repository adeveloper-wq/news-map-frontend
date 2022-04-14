import * as React from 'react'
import { useState, useEffect, useMemo } from 'react';
import ReactPlayer from 'react-player/youtube'

import MapGL, { Source, Layer } from 'react-map-gl';
import ControlPanel from '../components/ControlPanel';
import { heatmapLayer } from '../components/MapStyles';
import { Date, Location } from '../interfaces';

function filterFeaturesByDay(dateCollection, time) {
    let features = []
    dateCollection.forEach(date => {
        if (time === undefined || date.date === dateCollection[time].date) {
            date.locations.forEach(location => {
                features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [location.longitude, location.latitude] } })
            });
        }
    });
    return { type: 'FeatureCollection', features };
}

type Props = {
    mapboxKey?: string,
    className?: string,
    dates?: Array<Date>,
}

const MapComponent = ({ mapboxKey, className, dates }: Props) => {
    const [allDays, useAllDays] = useState(true);
    const [timeRange, setTimeRange] = useState([0, 0]);
    const [selectedTime, selectTime] = useState(0);
    const [locations, setLocations] = useState(null);

    useMemo(() => {
        if (dates !== undefined) {
            setTimeRange([0, dates.length - 1]);
            setLocations(dates);
            selectTime(0);
        }
    }, [dates]);

    const data = useMemo(() => {
        if (locations !== null) {
            return allDays ? filterFeaturesByDay(locations, undefined) : filterFeaturesByDay(locations, selectedTime);
        }
    }, [locations, allDays, selectedTime]);

    return (<div className={className}>
        <MapGL
            initialViewState={{
                latitude: 40,
                longitude: -100,
                zoom: 3
            }}
            mapStyle="mapbox://styles/mapbox/dark-v9"
            mapboxAccessToken={mapboxKey}
        >
            {data && (
                <Source type="geojson"
                    // @ts-ignore
                    data={data}>
                    <Layer {...heatmapLayer} />
                </Source>
            )}
        </MapGL >
        <ControlPanel
            startTime={timeRange[0]}
            endTime={timeRange[1]}
            selectedTime={selectedTime}
            allDays={allDays}
            onChangeTime={selectTime}
            onChangeAllDays={useAllDays}
            allDatesArray={dates}
        />
    </div>);
}

export default MapComponent