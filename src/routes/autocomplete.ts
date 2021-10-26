import axios from "axios";
import { Router } from "express";
import { nanoid } from "nanoid";
import { MAPBOX_API_KEY } from "../constants";
import Languages from "../enums/languages";
import LatLon from "../interfaces/latLon";
import MapboxAutocomplete from "../interfaces/mapboxAutocomplete";

const router = Router();

async function getMapboxData(
  query: string,
  language: Languages = Languages.english
) {
  try {
    const { data } = await axios.get<MapboxAutocomplete>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
      {
        params: {
          access_token: MAPBOX_API_KEY,
          language: language,
          types: "place",
        },
      }
    );

    return data.features;
  } catch (error) {
    console.log(error);
  }
}

interface Query {
  lat?: string;
  lon?: string;
  q?: string;
}

router.get("/", async (req, res) => {
  const { lat, lon, q }: Query = req.query;

  if (!lat || !lon || !q) return res.send([]);

  let data: {
    id: string;
    title: string;
    position: LatLon;
  }[] = [];

  const mapboxData = await getMapboxData(q);

  if (!mapboxData) return res.sendStatus(501);

  for (const mapboxEntry of mapboxData) {
    data.push({
      id: nanoid(10),
      title: mapboxEntry.place_name,
      position: {
        lat: mapboxEntry.center[0],
        lon: mapboxEntry.center[1],
      },
    });
  }

  return res.send(data);
});

export { router as autocomplete };
