import React from 'react';
import { useApp } from '../hooks/useApp';

const Toast = () => {
  const { toast } = useApp();

  return (
    <div id="toast" className={`toast ${toast.show ? 'show' : ''}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
