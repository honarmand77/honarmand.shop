// src/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = ({ dependencies = [] }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, ...dependencies]); // به دپندنسی‌ها هم وابسته میشه

  return null;
};