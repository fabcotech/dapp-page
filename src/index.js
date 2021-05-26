import React from 'react';
import ReactDOM from 'react-dom';

import { readConfigTerm, readPursesDataTerm } from 'rchain-token';
import { AppComponent } from './App';

const DEFAULT_MASTER_REGISTRY_URI_MAINNET = 'afjrah43mg5486tt4yweju9nshbhwhg9zumz4g4gxu4b8uwhced9gz';

const bodyError = (err) => {
  const e = document.createElement('p');
  e.style.color = '#B22';
  e.style.fontWeight = '400';
  e.style.fontSize = '1.8rem';
  e.innerText = err;
  const e2 = document.createElement('p');
  e2.innerText = `URL should have the following structure : page?contract=mynftcontract&purse=page\n
If you are using tipboard on a secondary network, also reference the master registry uri &master=aaabbb`;
  e2.style.color = '#B22';
  e2.style.fontWeight = '400';
  e2.style.fontSize = '1.1rem';
  e2.style.paddingTop = '10px';
  document.body.innerHTML = '';
  document.body.style.background = '#111';
  document.body.style.padding = '20px';
  document.body.appendChild(e);
  document.body.appendChild(e2);
};

document.addEventListener('DOMContentLoaded', function () {
  // In Dappy, window is already loaded when this code executes
  if (typeof dappyRChain !== 'undefined') {

    const urlParams = new URLSearchParams(window.location.search)

    let masterRegistryUri ;
    if (urlParams.get('master')) {
      console.log('found master registry URI in parameters', urlParams.get('master'))
      masterRegistryUri = urlParams.get('master');
    } else {
      console.log('picking default mainnet / d network master registry URI', DEFAULT_MASTER_REGISTRY_URI_MAINNET)
      masterRegistryUri = DEFAULT_MASTER_REGISTRY_URI_MAINNET
    }
    let contractId = urlParams.get('contract');
    let purseId = urlParams.get('purse') || "index";

    if (!contractId || contractId.length === 0) {
      bodyError(
        'did not find contract id in parameters ?contract=x, length must be 54'
      );
      throw new Error('')
    }

    if (!masterRegistryUri || masterRegistryUri.length !== 54) {
      bodyError(
        'master registry URI is incorrect ?master=x, length must be 54'
      );
      throw new Error('')
    }

    dappyRChain
      .exploreDeploys([
        readConfigTerm({ masterRegistryUri, contractId }),
        readPursesDataTerm({
          masterRegistryUri: masterRegistryUri,
          pursesIds: [purseId],
          contractId: contractId,
        }),
      ])
      .then((a) => {
        console.log(a);
        const results = JSON.parse(a).results;

        const config = blockchainUtils.rhoValToJs(
          JSON.parse(results[0].data).expr[0]
        );
        console.log('config', config)
        if (config.fungible !== false) {
          bodyError(
            'This contract is fungible=true (FT), you need a fungible=false (NFT) contract to use tipboard'
          );
          return;
        }

        if (config.version !== '6.0.0') {
          bodyError('Version should be 6.0.0');
          return;
        }

        let data;
        if (JSON.parse(results[1].data).expr[0]) {
          data = blockchainUtils.rhoValToJs(
            JSON.parse(results[1].data).expr[0]
          );
        }
        console.log(data)
        if (data && data[purseId]) {
          const purseData = JSON.parse(decodeURI(data[purseId]));
          if (purseData.title) {
            document.title = purseData.title;
          }
          ReactDOM.render(
            <AppComponent
              masterRegistryUri={masterRegistryUri}
              contractId={contractId}
              purseId={purseId}
              title={purseData.title}
              text={purseData.text}
            ></AppComponent>,
            document.getElementById('root')
          );
        } else {
          dappyRChain
            .identify({ publicKey: undefined })
            .then((b) => {
              if (b.identified) {
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
              } else {
                console.error('This dapp needs identification');
              }
            })
            .catch((err) => {
              console.error('This dapp needs identification');
              console.log(err);
            });
        }
      });
  }
});