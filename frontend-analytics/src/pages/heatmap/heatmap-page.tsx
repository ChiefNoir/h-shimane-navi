import 'mapbox-gl/dist/mapbox-gl.css';
import "./heatmap-page.scss";
import { AnalyticsClient, AnalyticsHeatZone, AnalyticsSource, Incident } from "../../services";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { HeatFilterComponent, MapComponent } from "./features/";
import { useEffect, useState } from "react";
import Map, { Layer, Source, FillLayer } from 'react-map-gl';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': {
      property: 'temperature',
      stops: [
        [0, '#808080'],
        [10, '#00ffe4'],
        [20, '#33f3b9'],
        [30, '#5ae68b'],
        [40, '#7ad65b'],
        [50, '#95c524'],
        [60, '#afb100'],
        [70, '#c79a00'],
        [80, '#dd7d00'],
        [90, '#f05700'],
        [100, '#ff0000'],
      ]
    },
    'fill-opacity': 0.5
  }
};

function HeatmapPage() {
  const [analyticsSources, setAnalyticsSources] = useState<AnalyticsSource[] | null>(null);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [heatZones, setHeatZones] = useState<FeatureCollection<Geometry, GeoJsonProperties>>();

  async function reloadHeatZone(sourceCodes: string[]) 
  {
    const result = await AnalyticsClient.getHeatMap(sourceCodes);
    setHeatZones(result);
  }

  useEffect(() => {
    const fetchData = async() => {
      const result = await AnalyticsClient.getSources();
      //const result2 = await AnalyticsClient.getHeatMap(["",""]);
    //setHeatZones(result2);

      if (result.isSucceed) {
        setAnalyticsSources(result.data);
      } else {
        setIncident(result.error);
      }
    };

    setIncident(null);
    fetchData();
  }, []);

  if (incident) {
    return <div>error</div>;
  }

  if (analyticsSources == null) {
    return <div>load</div>;
  } else {
    return (
      <div className="heatmap-container">
        <Map 
          initialViewState={{
          latitude: 35.383822,
          longitude: 132.767306,
          zoom: 12 }}
          style={{height: 600}}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          interactiveLayerIds={['heatZones']}
          mapboxAccessToken={window._env_.REACT_APP_MAPBOX_API_KEY}>
            <Source type="geojson" data={heatZones}>
              <Layer {...dataLayer} />
            </Source>
        </Map>
      <HeatFilterComponent analyticsSources={analyticsSources!} reloadHeatZone={reloadHeatZone}/>
    </div>
    );
  }
}

export { HeatmapPage };
