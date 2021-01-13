import React from 'react';
import ReactDOM from 'react-dom';

import { readBagOrTokenDataTerm, read } from 'rchain-token-files';
import { AppComponent } from './App';

// In Dappy, window is already loaded when this code executes
if (typeof dappyRChain !== 'undefined') {
  dappyRChain
    .exploreDeploys([
      read('REGISTRY_URI'),
      readBagOrTokenDataTerm('REGISTRY_URI', 'bags', 'page'),
    ])
    .then((a) => {
      const results = JSON.parse(a).results;

      const mainValues = blockchainUtils.rhoValToJs(
        JSON.parse(results[0].data).expr[0]
      );
      console.log('mainValues', mainValues);
      const expr = JSON.parse(results[1].data).expr[0];
      const bagData = expr ? blockchainUtils.rhoValToJs(expr) : undefined;
      console.log('bagData', bagData);

      if (bagData) {
        const data = JSON.parse(decodeURI(bagData));
        if (data.title) {
          document.title = data.title;
        }
        ReactDOM.render(
          <AppComponent
            registryUri={mainValues.registryUri}
            nonce={undefined}
            title={data.title}
            text={data.text}
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
                  registryUri={mainValues.registryUri}
                  nonce={mainValues.nonce}
                  publicKey={b.publicKey}
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
