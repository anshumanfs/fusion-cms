'use client';
import React from 'react';
export const defaultContextValues: any = {
  schemaFields: [],
  dialogStates: {},
  loaderStates: false
};
export const AppContext = React.createContext(defaultContextValues);
