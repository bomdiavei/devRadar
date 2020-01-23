import React, { useEffect, useState } from "react";
import "./App.css";
import "./Main.css";
import "./global.css";
import "./Sidebar.css";
import api from "./services/api";
import DevItem from "./components/DevItem";
import DevForm from "./components/DevForm";

function App() {
  const [devs, setDevs] = useState([]);
  const edit = useState({ mode: false, dev: {} });
  const { mode } = edit[0];

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get("/devs");
      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post("/devs", data);

    setDevs([...devs, response.data]);
  }

  async function handleEditDev(dev, data) {
    const { _id } = dev;

    const updateDevs = devs.map(async dev => {
      if (dev._id === _id) {
        const response = await api.put(`devs/${_id}`, data);
        if (response.data.nModified > 0) {
          const updateDev = await api.get(`/devs/${_id}`);
          return updateDev.data;
        }
      } else return dev;
    });

    const res = await Promise.all(updateDevs);
    setDevs(res);
  }

  async function handleDeleteDev(_id) {
    await api.delete(`/devs/${_id}`);
    setDevs(devs.filter(dev => dev._id !== _id));
  }

  return (
    <div id="app">
      <aside>
        <strong>{mode ? "Atualizar Dev" : "Cadastrar"}</strong>
        <DevForm onSubmit={handleAddDev} onEdit={handleEditDev} onMode={edit} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem
              key={dev._id}
              dev={dev}
              onDelete={handleDeleteDev}
              onEdit={edit}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
