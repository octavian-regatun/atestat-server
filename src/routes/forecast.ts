import axios from "axios";
import { Router } from "express";
import { OPENWEATHERMAP_API_KEY } from "../constants";
import { CurrentForecast } from "../interfaces/currentForecast";

const router = Router();

router.get("/current", async (req, res) => {
  interface Query {
    q?: string;
  }
  const { q }: Query = req.query;

  try {
    const response = await axios.get<CurrentForecast>(
      `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
    );

    const { data } = response;

    return res.send({
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      sunrise: data.sys?.sunrise,
      sunset: data.sys?.sunset,
      description: data.weather[0]?.description,
      icon: data.weather[0].icon,
    });
  } catch {
    return res.send("city not found");
  }
});

router.get("/current", async (req, res) => {
  interface Query {
    lat?: string;
    lon?: string;
  }
  const { lat, lon }: Query = req.query;

  const { data } = await axios.get<CurrentForecast>(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`
  );

  return res.send({
    temperature: data.main?.temp,
    feelsLike: data.main?.feels_like,
    sunrise: data.sys?.sunrise,
    sunset: data.sys?.sunset,
    description: data.weather[0]?.description,
    icon: data.weather[0].icon,
  });
});

export { router as forecast };
