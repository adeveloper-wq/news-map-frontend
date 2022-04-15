import Layout from '../components/Layout'
import MapComponent from '../components/HeatMap';
import axios from 'axios'
import { Date } from '../interfaces';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const IndexPage = () => {
  const [dates, setDates] = useState<Array<Date>>(undefined);

  let mapboxKey = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    toast.promise(axios.get<Date[]>(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/cnn`)
      .then(response => {
        setDates(response.data);
      })
      , {
        pending: '\xa0Loading locations',
        success: '\xa0Finished loading the locations👌',
        error: '\xa0Failed loading the locations 🤯'
      })
  }, [])

  return <Layout title="Locations from CNN">
    <MapComponent className="h-full rounded" mapboxKey={mapboxKey} dates={dates} />
  </Layout>
}

export default IndexPage
