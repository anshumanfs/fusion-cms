'use client';
import React, { useContext, useState } from 'react';
import { SideBar } from './sideBar';
import { playlists } from './playlist';
import DatabasePage from './databases/page';
import SwitchContext from './switchContext';
import { ModeToggle } from '@/components/themeToggle';

export default function Dashboard() {
  const [dashBoardContext, setDashBoardContext] = useState(<DatabasePage />);
  return (
    <>
      <SwitchContext.Provider value={[dashBoardContext, setDashBoardContext]}>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-3">
            <SideBar playlists={playlists} />
          </div>
          <div className="col-span-9">
            <div className="h-[10%]">
              <div className="float-right mr-2 mt-2">
                <ModeToggle />
              </div>
            </div>
            <DashBoardContent />
          </div>
        </div>
      </SwitchContext.Provider>
    </>
  );
}

function DashBoardContent() {
  const [dashBoardContext, setDashBoardContext] = useContext(SwitchContext);
  return <>{dashBoardContext}</>;
}

export { SwitchContext };
