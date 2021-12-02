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
      createPayload: undefined,
    };
  }

  onCreatePage = (p) => {
    // create purse
    const payload = {
      masterRegistryUri: this.props.masterRegistryUri,
      contractId: p.contractId,
      // avoid replacement of dappy cli
      // will be replaced by dappy browser
      boxId: ['BOX_', 'ID'].join(''),
      purses: {
        [p.purseId]: {
          id: p.purseId,
          // avoid replacement of dappy cli
          // will be replaced by dappy browser
          boxId: ['BOX_', 'ID'].join(''),
          quantity: 1,
          price: null,
        },
      },
      data: {
        [p.purseId]: encodeURI(
          JSON.stringify({ text: p.text, title: p.title })
        ),
      },
    };

    const term = createPursesTerm(payload);

    dappyRChain
      .sendTransaction({
        term: term,
        signatures: {},
      })
      .then((a) => {
        this.setState({
          modal: 'transaction-sent',
          update: false,
        });
      });

      this.setState({ createPayload: p })
  }

  onUpdatePage = (p) => {
    const payload = {
      masterRegistryUri: this.props.masterRegistryUri,
      purseId: this.props.purseId,
      contractId: this.props.contractId,
      boxId: ['BOX_', 'ID'].join(''),
      data: encodeURI(JSON.stringify({ text: p.text, title: p.title })),
    };

    const term = updatePurseDataTerm(payload);

    dappyRChain
      .sendTransaction({
        term: term,
        signatures: {},
      })
      .then((a) => {
        this.setState({
          modal: 'transaction-sent',
          update: false,
        });
      });

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
              {
                this.state.new && <><br />The address of the new page will be : <u>page?contract={this.state.createPayload.contractId}&page={this.state.createPayload.purseId || 'index'}</u></>
              }
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

    if (this.props.text && !this.state.update && !this.state.new) {
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
                className="button tip"
                onClick={() => {
                  dappyRChain.requestPayment({
                    amount: this.state.tip * 100000000,
                    from: undefined,
                    to: this.props.boxConfig.publicKey,
                  });
                }}
              >
                tip page owner
              </button>
            </div>
            <div
              className="page-text"
              dangerouslySetInnerHTML={{
                __html: converter.makeHtml(this.props.text),
              }}
            ></div>
            <div className="bottom-buttons">
              <a
                className="button is-light is-medium"
                onClick={() => {
                  this.setState({
                    update: true,
                    new: false,
                  });
                }}
              >
                Update page (admin only)
              </a>
              <a
                className="button is-light is-medium"
                onClick={() => {
                  this.setState({
                    update: false,
                    new: true,
                  });
                }}
              >
                Create a new page
              </a>
            </div>
          </div>
        </Fragment>
      );
    }

    if (this.state.new) {
      return (
        <Fragment>
          <GenesisFormComponent
            onCreatePage={this.onCreatePage}
            cancel={() => {
              this.setState({
                update: false,
                create: false,
              });
            }}
            text={''}
            title={''}
          ></GenesisFormComponent>
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
              new: false,
            });
          }}
          text={this.props.text}
          title={this.props.title}
        ></GenesisFormComponent>
      </Fragment>
    );
  }
}
