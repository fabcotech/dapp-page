import React, { Fragment } from 'react';
import showdown from 'showdown';

import { createPursesTerm, updatePurseDataTerm } from 'rchain-token';
import { GenesisFormComponent } from './GenesisForm';

const converter = new showdown.Converter();

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tip: 0.01,
      modal: undefined,
      update: false,
    };
  }

  onUpdatePage = (p) => {
    // update data
    if (this.props.text) {
      const payload = {
        masterRegistryUri: this.props.masterRegistryUri,
        purseId: this.props.purseId,
        contractId: this.props.contractId,
        boxId: ['BOX_', 'ID'].join(''),
        data: encodeURI(JSON.stringify({ text: p.text, title: p.title })),
      };

      const term = updatePurseDataTerm(payload);

      dappyRChain
        .transaction({
          term: term,
          signatures: {},
        })
        .then((a) => {
          this.setState({
            modal: 'transaction-sent',
            update: false,
          });
        });
    } else {
      // create purse
      const payload = {
        masterRegistryUri: this.props.masterRegistryUri,
        contractId: this.props.contractId,
        // avoid replacement of dappy cli
        // will be replaced by dappy browser
        boxId: ['BOX_', 'ID'].join(''),
        purses: {
          [this.props.purseId]: {
            id: this.props.purseId,
            // avoid replacement of dappy cli
            // will be replaced by dappy browser
            boxId: ['BOX_', 'ID'].join(''),
            quantity: 1,
            price: null,
          },
        },
        data: {
          [this.props.purseId]: encodeURI(
            JSON.stringify({ text: p.text, title: p.title })
          ),
        },
      };

      const term = createPursesTerm(payload);

      dappyRChain
        .transaction({
          term: term,
          signatures: {},
        })
        .then((a) => {
          this.setState({
            modal: 'transaction-sent',
            update: false,
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
          <div className="page-text-cont">
            <u>
              {dappy.dappyDomain}
              {dappy.path}
            </u>
            <div className="tip">
              <input
                className="input"
                type="number"
                step="0.01"
                min="0.01"
                value={this.state.tip}
                onChange={(e) => {
                  if (typeof parseFloat(e.currentTarget.value) === 'number') {
                    this.setState({ tip: parseFloat(e.currentTarget.value) });
                  }
                }}
              ></input>
              <b>REV</b>
              <button
                disabled={typeof this.state.tip !== 'number'}
                type="button"
                className="button"
                onClick={() => {
                  dappyRChain.requestPayment({
                    amount: this.state.tip,
                    from: undefined,
                    to: blockchainUtils.revAddressFromPublicKey(
                      this.props.boxConfig.publicKey
                    ),
                  });
                }}
              >
                tip owner of the page
              </button>
            </div>
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
          </div>
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
