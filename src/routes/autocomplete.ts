import axios from "axios";
import { Router } from "express";
import { HERE_API_KEY } from "../constants";
import queryString from "query-string";
import AutocompleteLocation from "../interfaces/autocompleteLocation";

const router = Router();

router.get("/", async (req, res) => {
  const { lat, lon, q } = req.query;

  if (!lat || !lon || !q) {
    return res.send([]);
  }

  let autocompleteLocations: AutocompleteLocation[] = [];

  let { data: autosuggestLocations } = await axios.get(
    `https://autosuggest.search.hereapi.com/v1/autosuggest`,
    {
      params: {
        apiKey: HERE_API_KEY,
        at: `${lat},${lon}`,
        limit: 5,
        lang: "en",
        q,
      },
    }
  );

  if (autosuggestLocations.length > 0) {
    return res.send([]);
  }

  autosuggestLocations = autosuggestLocations.items;

  for (const autosuggestLocation of autosuggestLocations) {
    const id: string = autosuggestLocation.id;
    let href = autosuggestLocation.href;

    if (id.includes("here:pds:place:") || id.includes("here:cm:namedplace:")) {
      const { data: location } = await axios.get(
        `https://lookup.search.hereapi.com/v1/lookup`,
        {
          params: {
            apiKey: HERE_API_KEY,
            id,
            lang: "en",
          },
        }
      );

      const { title, position } = location;

      autocompleteLocations.push({ title, position });
    } else if (href) {
      const { q, at } = queryString.parse(queryString.extract(href));

      let { data: location } = await axios.get(
        `https://discover.search.hereapi.com/v1/discover`,
        {
          params: {
            apiKey: HERE_API_KEY,
            at,
            q,
            limit: 1,
            lang: "en",
          },
        }
      );

      if (location.items.length > 0) {
        location = location.items[0];

        const { title, position } = location;

        autocompleteLocations.push({ title, position });
      }
    } else {
      const { title, position } = autosuggestLocation;

      autocompleteLocations.push({ title, position });
    }
  }
  return res.send(autocompleteLocations);
});

export { router as autocomplete };
