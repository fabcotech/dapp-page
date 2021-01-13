import React, { Fragment } from 'react';
import showdown from 'showdown';

import {
  updateBagDataTerm,
  createTokensTerm,
  readBagsTerm,
} from 'rchain-token-files';
import { GenesisFormComponent } from './GenesisForm';

const converter = new showdown.Converter();

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: undefined,
      update: false,
    };
  }

  onUpdatePage = (payload) => {
    if (typeof dappyRChain === 'undefined') {
      console.warn('window.dappyRChain is undefined, cannot deploy page');
      return;
    }

    // must create bag "page"
    if (this.props.nonce) {
      const bags = {
        page: {
          quantity: 1,
          price: null,
          publicKey: this.props.publicKey,
          n: '0',
          nonce: blockchainUtils.generateNonce(),
        },
      };
      const data = {
        page: encodeURI(
          JSON.stringify({ text: payload.text, title: payload.title })
        ),
      };
      const payloadForTerm = {
        bags: bags,
        data: data,
        nonce: this.props.nonce,
        newNonce: blockchainUtils.generateNonce(),
      };
      const ba = blockchainUtils.toByteArray(payloadForTerm);
      const term = createTokensTerm(
        this.props.registryUri.replace('rho:id:', ''),
        payloadForTerm,
        'SIGN'
      );
      dappyRChain
        .transaction({
          term: term,
          signatures: {
            SIGN: blockchainUtils.uInt8ArrayToHex(ba),
          },
        })
        .then((a) => {
          this.setState({
            modal: 'transaction-sent',
            update: false,
          });
        });
    } else {
      dappyRChain.exploreDeploys([readBagsTerm('REGISTRY_URI')]).then((a) => {
        const results = JSON.parse(a).results;
        const bags = blockchainUtils.rhoValToJs(
          JSON.parse(results[0].data).expr[0]
        );

        const newNonce = blockchainUtils.generateNonce();

        const payloadForTerm = {
          nonce: bags['page'].nonce,
          newNonce: newNonce,
          bagId: 'page',
          data: encodeURI(
            JSON.stringify({ text: payload.text, title: payload.title })
          ),
        };
        const ba = blockchainUtils.toByteArray(payloadForTerm);
        const term = updateBagDataTerm(
          this.props.registryUri.replace('rho:id:', ''),
          payloadForTerm,
          'SIGN'
        );
        dappyRChain
          .transaction({
            term: term,
            signatures: {
              SIGN: blockchainUtils.uInt8ArrayToHex(ba),
            },
          })
          .then((a) => {
            this.setState({
              modal: 'transaction-sent',
              update: false,
            });
          });
      });
    }
  };

  render() {
    if (this.state.modal === 'transaction-sent') {
      return (
        <div className="modal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Transaction successfully sent</p>
              <button
                onClick={() => this.setState({ modal: undefined })}
                className="delete"
                aria-label="close"
              ></button>
            </header>
            <section className="modal-card-body">
              Transaction was successfully sent. Wait few minutes, reload, and
              you should see the page updated.
            </section>
            <footer className="modal-card-foot">
              <button
                onClick={() => this.setState({ modal: undefined })}
                class="button"
              >
                Ok
              </button>
            </footer>
          </div>
        </div>
      );
    }
    if (this.props.text && !this.state.update) {
      return (
        <Fragment>
          <div
            className="page-text"
            dangerouslySetInnerHTML={{
              __html: converter.makeHtml(this.props.text),
            }}
          ></div>
          <a
            className="update-page"
            onClick={() => {
              this.setState({
                update: true,
              });
            }}
          >
            Update page (admin only)
          </a>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <GenesisFormComponent
          onUpdatePage={this.onUpdatePage}
          cancel={() => {
            this.setState({
              update: false,
            });
          }}
          text={this.props.text}
          title={this.props.title}
        ></GenesisFormComponent>
      </Fragment>
    );
  }
}
