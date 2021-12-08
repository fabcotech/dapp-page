import React, { Fragment } from 'react';

import { createPursesTerm, updatePurseDataTerm } from 'rchain-token';
import { GenesisFormComponent } from './GenesisForm';
import { HomeComponent } from './Home';
import { PageComponent } from './Page';

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      home: false,
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

    let neww = this.state.new || // has clicked on "create new"
      (this.props.contractId && !this.props.text) // want to create new through direct url

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
                neww && <><br />The address of the new page will be : <u>page?contract={this.state.createPayload.contractId}&page={this.state.createPayload.purseId || 'index'}</u></>
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

    if (this.props.home === true || this.state.home === true) {
      return <HomeComponent
        errorString={this.props.errorString}
        create={() => {
          this.setState({
            update: false,
            new: true,
            home: false,
          });
        }}
      ></HomeComponent>
    }
  
    if (this.props.text && !this.state.update && !this.state.new) {
      return (
        <PageComponent
          boxConfig={this.props.boxConfig}
          text={this.props.text}
          home={() => {
            this.setState({
              update: false,
              new: false,
              home: true,
            });
          }}
          update={() => {
            this.setState({
              update: true,
              new: false,
            });
          }}
          create={() => {
            this.setState({
              update: false,
              new: true,
              home: false,
            });
          }}
        />
      );
    }

    if (neww) {
      return (
        <Fragment>
          <GenesisFormComponent
            onCreatePage={this.onCreatePage}
            contractId={this.state.new ? undefined : this.props.contractId}
            cancel={() => {
              this.setState({
                update: false,
                new: false,
                home: false,
              });
            }}
            home={() => {
              this.setState({
                update: false,
                new: false,
                home: true,
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
              home: false,
            });
          }}
          home={() => {
            this.setState({
              update: false,
              new: false,
              home: true,
            });
          }}
          text={this.props.text}
          title={this.props.title}
        ></GenesisFormComponent>
      </Fragment>
    );
  }
}
