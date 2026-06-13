import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../Componentes/SideBar/SidebarAdmin";

export default function AdminLayout() {
    return (
        <div className="layout-admin">
            <SidebarAdmin />
            <main className="layout-main">
                <Outlet />
            </main>

            <style>{`
        .layout-admin {
          display: flex;
          min-height: 100vh;
          background: #f5f7f9;
        }

        /* MAIN */
        .layout-main {
          flex: 1;
          margin-left: 270px; 
          min-height: 100vh;
          background: #f5f7f9;
          transition: all 0.3s ease;
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .layout-admin {
            flex-direction: column;
          }

          .layout-main {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
}