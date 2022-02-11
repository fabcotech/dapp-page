import React from 'react';
import ReactDOM from 'react-dom';

import {
  readConfigTerm,
  readPursesDataTerm,
  readPursesTerm,
  readBoxTerm,
} from 'rchain-token';
import { AppComponent } from './App';

const RCHAIN_TOKEN_SUPPORTED_VERSION = '16.0.0';
const DEFAULT_MASTER_REGISTRY_URI_MAINNET =
  '7uwrizef7ewz9izm5bfd8q3p7kbccxmhnqu4sa4qwmdgdysq1p639r';

const bodyError = (err, masterRegistryUri) => {
  ReactDOM.render(
    ReactDOM.render(
      <AppComponent
        home={true}
        errorString={err}
        masterRegistryUri={masterRegistryUri}
        contractId={undefined}
        purseId={undefined}
        title={undefined}
        text={undefined}
        boxConfig={undefined}
      ></AppComponent>,
      document.getElementById('root')
    ),
    document.getElementById('root')
  );
  return;
};

document.addEventListener('DOMContentLoaded', function () {
  // In Dappy, window is already loaded when this code executes
  const dappyRChain = new DappyRChain();
  window.dappyRChain = dappyRChain;
  const urlParams = new URLSearchParams(window.location.search);
  
  const rchainWeb = new RChainWeb.http({
    readOnlyHost: "dappynetwork://",
    validatorHost: "dappynetwork://",
  })

  let masterRegistryUri;
  console.log("urlParams.get('master')", urlParams.get('master'));
  console.log("urlParams.get('contract')", urlParams.get('contract'));
  if (urlParams.get('master')) {
    console.log(
      'found master registry URI in parameters',
      urlParams.get('master')
    );
    masterRegistryUri = urlParams.get('master');
  } else {
    console.log(
      'picking default mainnet / d network master registry URI',
      DEFAULT_MASTER_REGISTRY_URI_MAINNET
    );
    masterRegistryUri = DEFAULT_MASTER_REGISTRY_URI_MAINNET;
  }
  let contractId = urlParams.get('contract');
  let purseId = urlParams.get('page') || 'index';
  if (!contractId || contractId.length === 0 || !masterRegistryUri || masterRegistryUri.length !== 54) {
    ReactDOM.render(
      <AppComponent
        home={true}
        masterRegistryUri={masterRegistryUri}
        contractId={undefined}
        purseId={undefined}
        title={undefined}
        text={undefined}
        boxConfig={undefined}
      ></AppComponent>,
      document.getElementById('root')
    );
    return;
  }

  rchainWeb
    .exploreDeploys([
      readConfigTerm({ masterRegistryUri, contractId }),
      readPursesDataTerm({
        masterRegistryUri: masterRegistryUri,
        pursesIds: [purseId],
        contractId: contractId,
      }),
      readPursesTerm({
        masterRegistryUri: masterRegistryUri,
        pursesIds: [purseId],
        contractId: contractId,
      }),
    ], false)
    .then((a) => {
      const results = a.results;
      console.log('results');
      console.log(results);

      const configNotParsed = JSON.parse(results[0].data).expr[0];
      if (!configNotParsed) {
        bodyError(
          'Did not find contract config, make sure the contract and master exist',
          masterRegistryUri
        );
        return;
      }
      const config = RChainWeb.utils.rhoValToJs(configNotParsed);
      if (config.fungible !== false) {
        bodyError(
          'This contract is fungible=true (FT), you need a fungible=false (NFT) contract to use tipboard',
          masterRegistryUri
        );
        return;
      }

      if (config.version !== RCHAIN_TOKEN_SUPPORTED_VERSION) {
        bodyError('Version should be ', RCHAIN_TOKEN_SUPPORTED_VERSION, masterRegistryUri);
        return;
      }

      let data;
      try {
        if (JSON.parse(results[1].data).expr[0]) {
          data = RChainWeb.utils.rhoValToJs(
            JSON.parse(results[1].data).expr[0]
          );
        }
      } catch (err) {}

      let purses;
      try {
        const d = JSON.parse(results[2].data).expr[0];
        if (d) {
          purses = RChainWeb.utils.rhoValToJs(d);
        }
      } catch (err) { }

      console.log('----------')
      console.log(data)
      console.log(data[purseId])
      if (data && data[purseId]) {
        let purseData;

        try {
          purseData = JSON.parse(decodeURI(data[purseId]));
        } catch (err) {
          bodyError(`Unable to parse page, make sure that ${contractId}.${purseId} exists`);
          return;
        }
        if (purseData.title) {
          document.title = purseData.title;
        }

        rchainWeb
          .exploreDeploys([
            readBoxTerm({
              masterRegistryUri: masterRegistryUri,
              boxId: purses[purseId].boxId,
            }),
          ], false)
          .then((b) => {
            const resultsB = b.results;
            const boxConfig = RChainWeb.utils.rhoValToJs(
              JSON.parse(resultsB[0].data).expr[0]
            );

            if (!boxConfig) {
              bodyError(
                'critical: did not find box associated with purse ' + purseId,
                masterRegistryUri
              );
              return;
            }

            ReactDOM.render(
              <AppComponent
                masterRegistryUri={masterRegistryUri}
                contractId={contractId}
                purseId={purseId}
                title={purseData.title}
                text={purseData.text}
                boxConfig={boxConfig}
              ></AppComponent>,
              document.getElementById('root')
            );
          });
      } else {
        ReactDOM.render(
          <AppComponent
            masterRegistryUri={masterRegistryUri}
            contractId={contractId}
            purseId={purseId}
            title={undefined}
            text={undefined}
          ></AppComponent>,
          document.getElementById('root')
        );
      }
    });
});
