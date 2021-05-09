import React, { createContext, FunctionComponent, ReactNode, useEffect, useState } from 'react';
import merge from 'lodash.merge';

import loadConfig, { validateConfig } from '../services/config.service';
import type { Config, Options } from '../../types/Config';
import LoadingOverlay from '../components/LoadingOverlay/LoadingOverlay';

const defaultConfig: Config = {
  id: '',
  siteName: '',
  description: '',
  footerText: '',
  player: '',
  assets: {},
  content: [],
  menu: [],
  options: {
    shelveTitles: true,
  },
};

export const ConfigContext = createContext<Config>(defaultConfig);

export type ProviderProps = {
  children: ReactNode;
  configLocation: string;
  onLoading: (isLoading: boolean) => void;
  onValidationError: (error: Error) => void;
};

const ConfigProvider: FunctionComponent<ProviderProps> = ({
  children,
  configLocation,
  onLoading,
  onValidationError,
}) => {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAndValidateConfig = async (configLocation: string) => {
      onLoading(true);
      setLoading(true);
      const config = await loadConfig(configLocation);
      validateConfig(config)
        .then((configValidated) => {
          setConfig(() => merge({}, defaultConfig, configValidated));
          setCssVariables(configValidated.options);
          onLoading(false);
          setLoading(false);
        })
        .catch((error: Error) => {
          onValidationError(error);
          onLoading(false);
          setLoading(false);
        });
    };
    loadAndValidateConfig(configLocation);
  }, [configLocation, onLoading, onValidationError]);

  const setCssVariables = ({ backgroundColor, highlightColor }: Options) => {
    const root = document.querySelector(':root') as HTMLElement;

    if (root && backgroundColor) {
      root.style.setProperty('--background-color', backgroundColor);
    }

    if (root && highlightColor) {
      root.style.setProperty('--highlight-color', highlightColor);
    }
  };

  return (
    <ConfigContext.Provider value={config}>
      {loading ? <LoadingOverlay /> : null}
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;