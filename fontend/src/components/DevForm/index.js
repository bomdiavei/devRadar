import React, { useState, useEffect } from "react";
import "./styles.css";

function DevForm({ onSubmit, onEdit, onMode }) {
  const [github_username, setGithubUsername] = useState("");
  const [techs, setTechs] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [{ mode, dev }, setMode] = onMode;

  useEffect(() => {
    if (!mode) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        err => {
          console.log(err);
        },
        {
          timeout: 30000
        }
      );
    } else {
      const {
        github_username,
        techs,
        location: {
          coordinates: [longitude, latitude]
        }
      } = dev;
      setGithubUsername(github_username);
      setTechs(techs.join(", "));
      setLatitude(latitude);
      setLongitude(longitude);
    }
  }, [mode, dev]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (mode) {
      await onEdit(dev, {
        techs
      });
      setMode({ mode: false, dev: {} });
    } else
      await onSubmit({
        github_username,
        techs,
        latitude,
        longitude
      });

    setGithubUsername("");
    setTechs("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor="github_username">Usuário do Github</label>
        <input
          name="github_username"
          id="github_username"
          required
          value={github_username}
          onChange={e => setGithubUsername(e.target.value)}
        />
      </div>

      <div className="input-block">
        <label htmlFor="techs">Tecnologias</label>
        <input
          name="techs"
          id="techs"
          required
          value={techs}
          onChange={e => setTechs(e.target.value)}
        />
      </div>

      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude</label>
          <input
            name="latitude"
            id="latitude"
            required
            value={latitude}
            type="number"
            onChange={e => setLatitude(e.target.value)}
          />
        </div>

        <div className="input-block">
          <label htmlFor="longitude">Longitude</label>
          <input
            name="longitude"
            id="longitude"
            required
            value={longitude}
            type="number"
            onChange={e => setLongitude(e.target.value)}
          />
        </div>
      </div>

      <button type="submit">{mode ? "Atualizar" : "Salvar"}</button>
    </form>
  );
}

export default DevForm;
