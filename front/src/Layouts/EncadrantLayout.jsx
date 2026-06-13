import React from "react";
import { Outlet } from "react-router-dom";
import SidebarEncadrant from "../Componentes/SideBar/SidebarEncadrant";

export default function LayoutEncadrant() {
  return (
    <div className="layout-encadrant">
      <SidebarEncadrant />
      <main className="layout-main">
        <Outlet />
      </main>

      <style>{`

        .layout-entreprise{
          display: flex;
          min-height: 100vh;
          background: #f5f7f9;
        }

        /* MAIN */

        .layout-main{
          flex: 1;
          margin-left: 230px;
          min-height: 100vh;
          background: #f5f7f9;

          transition: all 0.3s ease;
        }

        /* RESPONSIVE */

        @media(max-width:992px){

          .layout-entreprise{
            flex-direction: column;
          }

          .layout-main{
            margin-left: 0;
            width: 100%;
          }

        }

      `}</style>
    </div>
  );
}