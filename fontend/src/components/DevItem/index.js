import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./styles.css";

function DevItem({ dev, onEdit, onDelete }) {
  const [{ mode, dev: old }, setMode] = onEdit;

  function handleEdit() {
    setMode({ mode: old._id !== dev._id ? true : !mode, dev });
  }

  function handleDelete() {
    onDelete(dev._id);
  }
  return (
    <li className="dev-item">
      <div className="dev-icons">
        <FaEdit
          size={16}
          onClick={handleEdit}
          color="#666"
          className="icon-hover"
        />
        <FaTrash
          className="icon"
          size={14}
          color="#666"
          onClick={handleDelete}
        />
      </div>
      <header>
        <img src={dev.avatar_url} alt={dev.name} />
        <div className="user-info">
          <strong>{dev.name}</strong>

          <span>{dev.techs.join(", ")}</span>
        </div>
      </header>
      <p>{dev.bio}</p>

      <a href={`https://github.com/${dev.github_username}`}>
        Acessa perfil no Github
      </a>
    </li>
  );
}

export default DevItem;
