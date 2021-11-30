import React from 'react';
import ReactDOM from 'react-dom';

import {
  readConfigTerm,
  readPursesDataTerm,
  readPursesTerm,
  readBoxTerm,
} from 'rchain-token';
import { AppComponent } from './App';

const DEFAULT_MASTER_REGISTRY_URI_MAINNET =
  'egghoagj6jtxxsiifsx9sk35y1yzqjypds6ankji1tkyk6ckbj78pf';

class BodyError extends React.Component {
  render() {
    return (
      <div className="body-errors">
        <p className="body-error-1">{this.props.error}</p>
        <p className="body-error-2">
          <span>URL should have the following structure : </span>
          <u>page?contract=mynftcontract&purse=page</u>
          <br />
          <br />
          <span>
            If you are using an alternative/private network, also reference the
            master registry uri &master=aaabbb
          </span>
        </p>
      </div>
    );
  }
}
const bodyError = (err) => {
  ReactDOM.render(
    <BodyError error={err}></BodyError>,
    document.getElementById('root')
  );
  return;
};

document.addEventListener('DOMContentLoaded', function () {
  // In Dappy, window is already loaded when this code executes
  if (typeof dappyRChain !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    
    const rchainWeb = new RChainWeb.http({
      readOnlyHost: "dappynetwork://",
      validatorHost: "dappynetwork://",
    })

    let masterRegistryUri;
    if (urlParams.get('master')) {
      console.log(
        'found master registry URI in parameters',
        urlParams.get('master')
      );
      masterRegistryUri = urlParams.get('master');
    } else if (dappy.dappyDomain.startsWith('gammanetwork/')) {
      masterRegistryUri =
        'mpddrwyph33qikosct81pbgkb11td4qrzub4najkfs63skn3fr1di8';
    } else {
      console.log(
        'picking default mainnet / d network master registry URI',
        DEFAULT_MASTER_REGISTRY_URI_MAINNET
      );
      masterRegistryUri = DEFAULT_MASTER_REGISTRY_URI_MAINNET;
    }
    let contractId = urlParams.get('contract');
    let purseId = urlParams.get('purse') || 'index';

    if (!contractId || contractId.length === 0) {
      bodyError('did not find contract id in parameters ?contract=x');
      throw new Error('');
    }

    if (!masterRegistryUri || masterRegistryUri.length !== 54) {
      bodyError(
        'master registry URI is incorrect ?master=x, length must be 54'
      );
      throw new Error('');
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
        const configNotParsed = JSON.parse(results[0].data).expr[0];
        if (!configNotParsed) {
          bodyError(
            'Did not find contract config, make sure the contract and master exist'
          );
          return;
        }
        const config = RChainWeb.utils.rhoValToJs(configNotParsed);
        if (config.fungible !== false) {
          bodyError(
            'This contract is fungible=true (FT), you need a fungible=false (NFT) contract to use tipboard'
          );
          return;
        }

        if (config.version !== '14.0.0') {
          bodyError('Version should be 14.0.0');
          return;
        }

        let data;
        if (JSON.parse(results[1].data).expr[0]) {
          data = RChainWeb.utils.rhoValToJs(
            JSON.parse(results[1].data).expr[0]
          );
        }

        let purses;
        const d = JSON.parse(results[2].data).expr[0];
        if (d) {
          purses = RChainWeb.utils.rhoValToJs(d);
        }

        if (data && data[purseId]) {
          const purseData = JSON.parse(decodeURI(data[purseId]));
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
                  'critical: did not find box associated with purse ' + purseId
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
