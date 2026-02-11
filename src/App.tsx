import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PitchView from './views/PitchView';
import FullDashboard from './views/FullDashboard';

function App() {
  return (
    <Routes>
      <Route path="/pitch" element={<PitchView />} />
      <Route path="/full" element={<FullDashboard />} />
      <Route path="*" element={<Navigate to="/pitch" replace />} />
    </Routes>
  );
}

export default App;
