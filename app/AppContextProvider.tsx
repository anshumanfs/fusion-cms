'use client';
import React from 'react';
export const defaultContextValues: any = {
  schemaFields: [],
};
export const AppContext = React.createContext(defaultContextValues);
