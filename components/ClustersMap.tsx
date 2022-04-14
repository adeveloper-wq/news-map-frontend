import * as React from 'react';
import {useRef, useMemo, useState} from 'react';
import {render} from 'react-dom';
import {Map, Source, Layer} from 'react-map-gl';

import ControlPanel from './ControlPanel'
import {clusterLayer, unclusteredPointLayer} from './Layers';

import type {MapRef} from 'react-map-gl';
import type {GeoJSONSource} from 'react-map-gl';
import { Date, Location } from '../interfaces';

function filterFeaturesByDay(dateCollection, time) {
    let features = []
    dateCollection.forEach(date => {
        if (time === undefined || date.date === dateCollection[time].date){
            date.locations.forEach(location => {
                features.push({type: 'Feature', geometry: {type: 'Point', coordinates: [location.longitude, location.latitude]}, country: location.country})
            });
        }
    });
    return {type: 'FeatureCollection', features: features};
}

type Props = {
    mapboxKey?: string,
    className?: string,
    dates?: Array<Date>,
}

const MapComponent = ({ mapboxKey, className, dates }: Props) => {
    const [allDays, useAllDays] = useState(true);
    const [absoluteCount, useAbsoulteCount] = useState(true);
    const [timeRange, setTimeRange] = useState([0, 0]);
    const [selectedTime, selectTime] = useState(0);
    const [locations, setLocations] = useState(null);
    const [clusterCountLayer, setClusterCountLayer] = useState({
      id: 'cluster-count',
      type: 'symbol',
      source: 'news-locations',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    })

    useMemo(() => {
        if (dates !== undefined){
            setTimeRange([0, dates.length - 1]);
            setLocations(dates);
            selectTime(0);
        }     
    }, [dates]);

    const data = useMemo(() => {
        if (locations !== null){
            const data = allDays ? filterFeaturesByDay(locations, undefined) : filterFeaturesByDay(locations, selectedTime);
            setClusterCountLayer({
              id: 'cluster-count',
              type: 'symbol',
              source: 'news-locations',
              filter: ['has', 'point_count'],
              layout: {
                'text-field': absoluteCount ? '{point_count_abbreviated}' : ["concat", ["to-string", ["/", ["round", ["*", ["/", ['get', 'point_count'], data.features.length], 10000]], 100]], "%"],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
              }
            })
            return data;
        }
    }, [locations, allDays, selectedTime]);

    useMemo(() => {
      setClusterCountLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'news-locations',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': absoluteCount ? '{point_count_abbreviated}' : ["concat", ["to-string", ["/", ["round", ["*", ["/", ['get', 'point_count'], data.features.length], 10000]], 100]], "%"],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      })   
    }, [absoluteCount]);

    const mapRef = useRef<MapRef>(null);

  return (<div className={className}>
      <Map
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={mapboxKey}
        interactiveLayerIds={[clusterLayer.id]}
        /* onClick={onClick} */
        ref={mapRef}
      >
        <Source
          id="news-locations"
          type="geojson" data={data}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </Map>
      <ControlPanel
            startTime={timeRange[0]}
            endTime={timeRange[1]}
            selectedTime={selectedTime}
            allDays={allDays}
            onChangeTime={selectTime}
            onChangeAllDays={useAllDays}
            allDatesArray={dates}
            absoluteCount={absoluteCount}
            onChangeAbsoluteCount={useAbsoulteCount}
            chosenLocationData={data}
        />
      </div>)
}

export default MapComponent