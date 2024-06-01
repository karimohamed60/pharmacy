import React, { useState } from "react";
import "./IsidebarItem.css";
const IsidebarItem = ({ item }) => {
  const [open, setOpen] = useState(true);

  if (item.childrens) {
    return (
      <div className={open ? "sidebar-item open" : "sidebar-item"}>
        <div className="sidebar-title">
          <span>
            {item.icon && (
              <i className={item.icon} style={{ marginLeft: "-10px" }}></i>
            )}
            {item.title}
          </span>
          <i
            className="bi-caret-down-fill toggle-btn"
            onClick={() => setOpen(!open)}
          ></i>
        </div>
        <div className="sidebar-content">
          {item.childrens.map((child, index) => (
            <IsidebarItem key={index} item={child} />
          ))}{" "}
        </div>
      </div>
    );
  } else {
    return (
      <a href={item.path || "#"} className="sidebar-item plain">
        <div className="sidebar-title">
          <span>
            {item.icon && <i className={item.icon}></i>}

            {item.title}
          </span>
        </div>
      </a>
    );
  }
};

export default IsidebarItem;
