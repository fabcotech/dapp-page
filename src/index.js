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
  dappyRChain
    // Shortcut : will be changed to dappy://NETWORK_ID/REGISTRY_URI by Dappy browser
    .fetch('dappy://REGISTRY_URI')
    .then((a) => {
      const response = JSON.parse(a);
      const rholangTerm = response.expr[0];
      const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
      /*
        If a file names "page" exists, it means that the page has been created,
        we can display the page

        If it does not exist we must display the form to create it
      */
      console.log(jsValue);
      if (jsValue.files.page) {
        dappyRChain
          // Shortcut : will be changed to dappy://NETWORK_ID/REGISTRY_URI by Dappy browser
          .exploreDeploys('dappy://explore-deploys', [
            /* Get page from the rholang-files-module contract */
            `new return,
              fileCh,
              fileCh,
              filesModuleCh,
              lookup(\`rho:registry:lookup\`) in {
                lookup!(\`${jsValue.files.page}\`, *fileCh) |
                for(file <- fileCh) {
                  return!(*file)
                }
            }`,
          ])
          .then((a) => {
            const results = JSON.parse(a).results;
            const page = blockchainUtils.rhoValToJs(
              JSON.parse(results[0].data).expr[0]
            );
            const text = decodeURI(page.text);
            const title = decodeURI(page.title);
            document.title = title;
            console.log(
              'files-module .page file retrieved with explore-deploy :'
            );
            console.log(text);

            ReactDOM.render(
              <AppComponent
                nonce={jsValue.nonce}
                title={title}
                text={text}
              ></AppComponent>,
              document.getElementById('root')
            );
          });
      } else {
        ReactDOM.render(
          <AppComponent nonce={jsValue.nonce} text={undefined} />,
          document.getElementById('root')
        );
      }
    })
    .catch((err) => {
      console.error(
        'Something went wrong when retreiving the files module object'
      );
      console.log(err);
    });
}
