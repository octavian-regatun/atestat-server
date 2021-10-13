import axios from "axios";
import { Router } from "express";
import LatLon from "../interfaces/latLon";

const router = Router();

router.get("/:ip", async (req, res) => {
  const { ip } = req.params;

  try {
    const { data } = await axios.get<LatLon>(`http://ip-api.com/json/${ip}`, {
      params: {
        fields: "lat,lon",
      },
    });

    return res.send(data);
  } catch (e) {
    return res.sendStatus(501);
  }
});

export { router as currentLocation };
