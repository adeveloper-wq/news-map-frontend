import Layout from '../components/Layout'
import MapComponent from '../components/ClustersMap';
import axios from 'axios'
import { Date } from '../interfaces';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ClustersPage = () => {
  const [dates, setDates] = useState<Array<Date>>(undefined);

  let mapboxKey = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    toast.promise(axios.get<Date[]>(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/cnn`)
      .then(response => {
        setDates(response.data);
      })
      , {
        loading: '\xa0Loading locations',
        success: '\xa0Finished loading the locations👌',
        error: '\xa0Failed loading the locations 🤯'
      })
  }, [])
  // @ts-ignore
  return <Layout title="Locations from CNN" dates={dates}>
    <MapComponent className="h-full rounded" mapboxKey={mapboxKey} dates={dates} />
    <Toaster position="bottom-center" />
  </Layout>
}

export default ClustersPage 